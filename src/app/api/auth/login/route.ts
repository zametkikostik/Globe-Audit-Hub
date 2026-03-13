import { NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';

// In-memory users
const users = new Map<string, any>();

// Demo user (password: password123)
hash('password123', 12).then((hashed) => {
  users.set('admin@globeaudit.com', {
    id: '1',
    email: 'admin@globeaudit.com',
    name: 'Admin User',
    password: hashed,
    country: 'RU',
    taxId: '7701234567',
    role: 'admin'
  });
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = users.get(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Создаём простую сессию (в продакшене использовать JWT)
    const sessionToken = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    })).toString('base64');

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        country: user.country,
        taxId: user.taxId,
        role: user.role
      }
    });

    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session-token')?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  try {
    const session = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    const user = users.get(session.email);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        country: user.country,
        taxId: user.taxId,
        role: user.role
      }
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
