'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import {BrowserProvider, parseUnits, Contract} from 'ethers';

// Конфигурация
const TARGET_WALLET = '0xE0613404337e4a5F4cc68aD7C72393e99dF18bFA';
const PAYMENT_AMOUNT = '10'; // 10 DAI / A7A5
const TOKEN_ADDRESS = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'; // DAI на Polygon
const CHAIN_ID = 137; // Polygon Mainnet
const CHAIN_NAME = 'Polygon Mainnet';
const RPC_URL = 'https://polygon-rpc.com';
const EXPLORER_URL = 'https://polygonscan.com/tx';

// Testnet конфигурация (для тестирования)
const TEST_TOKEN_ADDRESS = '0x0fa87802d00677d8784061aeeb722893ca063f0d'; // Test DAI на Mumbai
const TEST_CHAIN_ID = 80001; // Mumbai Testnet
const TEST_CHAIN_NAME = 'Polygon Mumbai Testnet';
const TEST_RPC_URL = 'https://rpc-mumbai.maticvigil.com';
const TEST_EXPLORER_URL = 'https://mumbai.polygonscan.com/tx';
const FAUCET_URL = 'https://faucet.polygon.technology/';

// A7A5 Stablecoin (CIS region)
const A7A5_ADDRESS = '0xYourA7A5ContractAddress'; // Заменить на реальный контракт

// CIS страны для A7A5
const CIS_COUNTRIES = ['RU', 'KZ', 'BY', 'UA', 'UZ', 'AM', 'AZ'];

interface PaymentStatus {
  idle: 'idle';
  processing: 'processing';
  success: 'success';
  error: 'error';
}

type PaymentStatusType = 'idle' | 'processing' | 'success' | 'error';

interface TaxData {
  amount: number;
  rate: number;
  tax: number;
  total: number;
  tax_type: string;
}

export default function CryptoPayment() {
  const t = useTranslations('Payment');
  const [status, setStatus] = useState<PaymentStatusType>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [walletInstalled, setWalletInstalled] = useState(false);
  const [useTestnet, setUseTestnet] = useState(false);
  const [taxData, setTaxData] = useState<TaxData | null>(null);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Geo-targeting - по умолчанию DAI для международных пользователей
  const [paymentToken, setPaymentToken] = useState('DAI');
  const [tokenAddress, setTokenAddress] = useState(TOKEN_ADDRESS);

  // Определение региона пользователя (упрощённо)
  useEffect(() => {
    setIsClient(true);
    setWalletInstalled(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined');
    
    // Можно определить по IP или выбрать вручную
    // Сейчас по умолчанию DAI для всех
    setPaymentToken('DAI');
    setTokenAddress(TOKEN_ADDRESS);
  }, []);

  // Переключение на Polygon сеть
  const switchToPolygon = async () => {
    if (!walletInstalled || !window.ethereum) return false;

    const chainId = useTestnet ? TEST_CHAIN_ID : CHAIN_ID;
    const chainName = useTestnet ? TEST_CHAIN_NAME : CHAIN_NAME;
    const rpcUrl = useTestnet ? TEST_RPC_URL : RPC_URL;
    const explorerUrl = useTestnet ? TEST_EXPLORER_URL : EXPLORER_URL;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: `0x${chainId.toString(16)}`}],
      });
      return true;
    } catch (switchError: any) {
      // Если сеть не добавлена, добавляем её
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: chainName,
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: [rpcUrl],
              blockExplorerUrls: [explorerUrl.replace('/tx', '')]
            }],
          });
          return true;
        } catch (addError) {
          return false;
        }
      }
      return false;
    }
  };

  // Обработка платежа
  const handlePayment = async () => {
    if (!walletInstalled || !window.ethereum) {
      setErrorMsg(t('error.walletNotFound'));
      setStatus('error');
      return;
    }

    try {
      setStatus('processing');
      setErrorMsg('');

      // Создаём провайдер
      const provider = new BrowserProvider(window.ethereum);
      
      // Переключаем на Polygon (или testnet)
      const switched = await switchToPolygon();
      if (!switched) {
        throw new Error(t('error.networkError'));
      }

      // Получаем signer
      const signer = await provider.getSigner();
      
      // Выбираем контракт в зависимости от сети
      const selectedTokenAddress = useTestnet ? TEST_TOKEN_ADDRESS : tokenAddress;
      
      // Создаём транзакцию для DAI (ERC20)
      // ABI для transfer функции
      const abi = ['function transfer(address to, uint256 amount) returns (bool)'];
      const contract = new Contract(selectedTokenAddress, abi, signer);
      
      // Конвертируем сумму в wei (DAI имеет 18 decimals)
      const amount = parseUnits(PAYMENT_AMOUNT, 18);
      
      // Отправляем транзакцию
      const tx = await contract.transfer(TARGET_WALLET, amount);
      
      // Ждём подтверждения
      await tx.wait();
      
      setTxHash(tx.hash);
      setStatus('success');
    } catch (error: any) {
      console.error('Payment error:', error);
      
      if (error.code === 4001) {
        setErrorMsg(t('error.userRejected'));
      } else if (error.code === -32602 || error.message?.includes('insufficient funds')) {
        setErrorMsg(t('error.insufficientFunds'));
      } else if (error.message?.includes('transfer amount exceeds balance')) {
        setErrorMsg('⚠️ Недостаточно DAI токенов на балансе.');
      } else if (error.message?.includes('user rejected')) {
        setErrorMsg(t('error.userRejected'));
      } else {
        setErrorMsg(t('error.unknown'));
      }
      setStatus('error');
    }
  };

  // Сброс состояния
  const resetPayment = () => {
    setStatus('idle');
    setTxHash('');
    setErrorMsg('');
  };

  // Показываем компонент только после гидратации
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/50 via-slate-800/50 to-blue-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{t('title')}</h3>
          <p className="text-sm text-slate-400">
            {useTestnet ? TEST_CHAIN_NAME : CHAIN_NAME}
          </p>
        </div>
        <button
          onClick={() => setUseTestnet(!useTestnet)}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
            useTestnet 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
              : 'bg-green-500/20 text-green-400 border border-green-500/50'
          }`}
          title={useTestnet ? 'Testnet mode' : 'Mainnet mode'}
        >
          {useTestnet ? '🧪 Test' : '💎 Main'}
        </button>
      </div>

      {status === 'idle' && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-500 mb-1">{t('amount')}</div>
              <div className="text-white font-semibold text-lg">
                {PAYMENT_AMOUNT} {paymentToken}
                {paymentToken === 'A7A5' && (
                  <span className="block text-xs text-green-400 mt-1">
                    🇷🇺 CIS Region Token
                  </span>
                )}
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-500 mb-1">{t('wallet')}</div>
              <div className="text-white font-mono text-xs truncate">
                {TARGET_WALLET.slice(0, 10)}...{TARGET_WALLET.slice(-8)}
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-500 hover:via-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Pay with {paymentToken}</span>
            {paymentToken === 'A7A5' && (
              <span className="text-xs bg-green-500/20 px-2 py-1 rounded">CIS</span>
            )}
          </button>

          {!walletInstalled && (
            <p className="mt-3 text-center text-sm text-amber-400">
              ⚠️ {t('error.walletNotFound')}
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                {t('installMetaMask')}
              </a>
            </p>
          )}

          {useTestnet && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-300 mb-2">
                🧪 <strong>Testnet Mode:</strong> Получите бесплатные тестовые DAI и MATIC для проверки.
              </p>
              <a
                href={FAUCET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-1"
              >
                Открыть faucet
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </>
      )}

      {status === 'processing' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
          <p className="text-white font-medium">{t('processing')}</p>
          <p className="text-slate-400 text-sm mt-2">Подтвердите транзакцию в кошельке</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-500/20 rounded-full">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-white mb-2">{t('success')}</h4>
          <p className="text-slate-300 mb-4">{t('thankYou')}</p>

          {txHash && (
            <>
              <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                <div className="text-slate-500 text-sm mb-1">{t('txHash')}</div>
                <a
                  href={`${useTestnet ? TEST_EXPLORER_URL : EXPLORER_URL}/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-mono break-all"
                >
                  {txHash.slice(0, 20)}...{txHash.slice(-20)}
                </a>
              </div>

              {/* Секция генерации отчёта */}
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 mb-4 border border-blue-500/30">
                <h5 className="text-white font-semibold mb-3 flex items-center gap-2 justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Скачать официальный отчёт
                </h5>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ваше имя / Название компании"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Email для получения отчёта"
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <p className="text-xs text-slate-400">
                    📧 Отчёт будет отправлен на ваш email автоматически
                  </p>
                </div>

                <button
                  onClick={async () => {
                    if (!clientName.trim()) {
                      setErrorMsg('Пожалуйста, введите имя для отчёта');
                      setStatus('error');
                      return;
                    }

                    setGeneratingReport(true);
                    try {
                      const response = await fetch('http://localhost:8000/api/generate-report', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                          client_name: clientName,
                          client_email: clientEmail || undefined,
                          tax_result: taxData || {
                            amount: 100000,
                            rate: 6,
                            tax: 6000,
                            total: 94000,
                            tax_type: 'УСН'
                          },
                          transaction_hash: txHash,
                          locale: 'ru'
                        })
                      });

                      if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.detail || 'Failed to generate report');
                      }

                      // Скачиваем PDF
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `globe_audit_report_${new Date().toISOString().split('T')[0]}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);

                    } catch (error: any) {
                      console.error('Report generation error:', error);
                      setErrorMsg(`Ошибка генерации отчёта: ${error.message}`);
                      setStatus('error');
                    } finally {
                      setGeneratingReport(false);
                    }
                  }}
                  disabled={generatingReport || !clientName.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                  {generatingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Генерация PDF...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Скачать PDF отчёт</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={`${useTestnet ? TEST_EXPLORER_URL : EXPLORER_URL}/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t('viewExplorer')}
              </a>
            </>
          )}

          <button
            onClick={resetPayment}
            className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
          >
            Новая оплата
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-500/20 rounded-full">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 font-medium mb-4">{errorMsg}</p>
          <button
            onClick={resetPayment}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            Попробовать снова
          </button>
        </div>
      )}
    </div>
  );
}
