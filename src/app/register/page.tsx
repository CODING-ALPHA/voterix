"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VerificationCodeModal from "@/components/VerificationCodeModal";
import VerifyingModal from "@/components/VerifyingModal";
import SuccessModal from "@/components/SuccessModal";
import AuthImageSlider from "@/components/AuthImageSlider";
import { formatApiErrorMessage, register as registerAssociation } from "@/lib/api-client";

import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isVerifyingOpen, setIsVerifyingOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formError) setFormError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsVerifyingOpen(true);

    try {
      const result = await registerAssociation({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (result.status === "success") {
        setIsVerifyingOpen(false);
        setIsCodeModalOpen(true);
      } else {
        setIsVerifyingOpen(false);
        setFormError(
          formatApiErrorMessage(
            { message: result.message, errors: result.errors },
            "Registration failed"
          )
        );
      }
    } catch (error) {
      setIsVerifyingOpen(false);
      console.error("Registration error:", error);
      setFormError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen" suppressHydrationWarning>
      {/* Left Side: Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 bg-white text-zinc-900">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#000a33] mb-8">Registration</h1>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g NACOS BOWEN"
                className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="olivia@untitledui.com"
                className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="BU22CVT2222"
                  className="w-full h-12 px-4 pr-11 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="BU22CVT2222"
                  className="w-full h-12 px-4 pr-11 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {formError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              >
                {formError}
              </p>
            )}

            <div className="pt-2">
              <button
                className="w-full h-12 font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  borderRadius: '11.155px',
                  border: '1.394px solid #909090',
                  background: 'linear-gradient(180deg, #3457B4 0%, #4A496A 100%)',
                  boxShadow: '0 1.394px 2.789px 0 rgba(16, 24, 40, 0.05)'
                }}
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm font-medium">
            Already have an Account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Modal Components */}
        <VerificationCodeModal
          isOpen={isCodeModalOpen}
          onClose={() => setIsCodeModalOpen(false)}
          email={formData.email}
          purpose="signup"
          onVerify={() => {
            setIsCodeModalOpen(false);
            setIsSuccessModalOpen(true);
          }}
        />
        <VerifyingModal isOpen={isVerifyingOpen} />
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onDashboard={() => {
            setIsSuccessModalOpen(false);
            router.push('/login');
          }}
        />
      </div>

      {/* Right Side: Visual */}
      <div className="hidden w-1/2 bg-[#000129] lg:flex flex-col justify-center p-16 text-white">
        <AuthImageSlider
          title="Quick Set-up"
          subtitle="Creating an election should not be a sport, it should be easy, smooth and understandable. Voterix is here to provide that."
        />
      </div>
    </div>
  );
}
