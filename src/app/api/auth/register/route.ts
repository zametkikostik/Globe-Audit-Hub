import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

// In-memory users (в продакшене использовать MongoDB)
const devUsers = new Map<string, any>();

export async function POST(request: Request) {
  try {
    const { email, password, name, country, taxId, businessName } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    if (devUsers.has(email)) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user object
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      country: country || "US",
      taxId: taxId || "",
      businessName: businessName || "",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      businessType: "individual",
      currency: country === "RU" || country === "KZ" || country === "BY" ? "A7A5" : "DAI",
      emailVerified: false,
      twoFactorEnabled: false
    };

    // Save user
    devUsers.set(email, newUser);

    return NextResponse.json(
      { 
        message: "User created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          country: newUser.country,
          currency: newUser.currency
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
