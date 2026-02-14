"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";

function getRoleDashboard(role: string) {
  switch (role) {
    case "ARTIST":
      return "/artist";
    case "ADMIN":
      return "/admin";
    default:
      return "/dashboard";
  }
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"client" | "artist">(
    "client"
  );
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && auth.user) {
      router.replace(getRoleDashboard(auth.user.role));
    }
  }, [auth.isLoading, auth.user, router]);

  const handleSendOtp = async () => {
    setError("");
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setIsLoading(true);
    try {
      await api.sendOtp(phone);
      setOtpSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const { token, user } = await api.verifyOtp(
        phone,
        otpValue,
        selectedRole.toUpperCase()
      );
      auth.login(token, user);
      router.replace(getRoleDashboard(user.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-secondary px-4 py-12">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <p className="font-serif text-2xl">
            To<span className="text-primary">Moola</span>
          </p>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Welcome to ToMoola
          </h1>
          <p className="text-muted-foreground text-sm">
            Login or create an account to get started
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("client")}
            className={`flex-1 p-4 rounded-xl border-2 cursor-pointer text-center transition ${
              selectedRole === "client"
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <span className="text-2xl block mb-1">🎉</span>
            <p className="font-medium text-sm text-foreground">
              I&apos;m a Client
            </p>
            <p className="text-xs text-muted-foreground">
              Book artists for events
            </p>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("artist")}
            className={`flex-1 p-4 rounded-xl border-2 cursor-pointer text-center transition ${
              selectedRole === "artist"
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <span className="text-2xl block mb-1">🎭</span>
            <p className="font-medium text-sm text-foreground">
              I&apos;m an Artist
            </p>
            <p className="text-xs text-muted-foreground">
              Get bookings &amp; earn
            </p>
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2">
            <div className="flex items-center justify-center rounded-md border border-input bg-muted px-3 text-sm font-medium text-foreground">
              +91
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
            />
          </div>
        </div>

        {!otpSent ? (
          <Button
            className="w-full mb-6"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? "Sending…" : "Send OTP"}
          </Button>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              <Label>Enter OTP</Label>
              <div className="flex gap-2 justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-input bg-transparent outline-none focus:border-primary transition"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive?{" "}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </p>
            </div>

            <Button
              className="w-full mb-6"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? "Verifying…" : "Verify & Login"}
            </Button>
          </>
        )}

        <div className="flex items-center gap-3 mb-6">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" className="w-full">
          <svg className="size-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
