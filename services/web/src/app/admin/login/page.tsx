"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { api } from "@/lib/api"

export default function AdminLoginPage() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isLoading && auth.user?.role === "ADMIN") {
      router.replace("/admin")
    }
  }, [auth.isLoading, auth.user, router])

  const handleSendOtp = async () => {
    setError("")
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number")
      return
    }
    setIsLoading(true)
    try {
      await api.sendOtp(phone)
      setOtpSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    setError("")
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP")
      return
    }
    setIsLoading(true)
    try {
      const { token, user } = await api.verifyOtp(phone, otpValue)
      if (user.role !== "ADMIN") {
        setError("This account does not have admin access")
        return
      }
      auth.login(token, user)
      router.replace("/admin")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="max-w-sm w-full rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <p className="font-serif text-2xl">
            To<span className="text-primary">Moola</span>
          </p>
          <h1 className="font-serif text-xl font-bold text-foreground">
            Admin Login
          </h1>
          <p className="text-muted-foreground text-sm">
            Authorized personnel only
          </p>
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
              placeholder="Admin phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
            />
          </div>
        </div>

        {!otpSent ? (
          <Button
            className="w-full"
            onClick={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? "Sending\u2026" : "Send OTP"}
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
                      otpRefs.current[i] = el
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
              className="w-full"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? "Verifying\u2026" : "Verify & Login"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
