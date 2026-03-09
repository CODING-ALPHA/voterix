import Image from "next/image";
import Link from "next/link";
import AuthImageSlider from "@/components/AuthImageSlider";

export default function Login() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side: Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 bg-white text-zinc-900">
        <div className="mb-12">
          {/* Logo */}

          <h1 className="text-3xl font-bold text-[#000a33] mb-8">Login</h1>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 letter-spacing-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="olivia@untitledui.com"
                className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Password
              </label>
              <input
                type="password"
                placeholder="********"
                className="w-full h-12 px-4 rounded-lg border border-zinc-200 bg-white text-gray-900 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

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
                Login
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm font-medium">
            Don't have an Account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden w-1/2 bg-[#000129] lg:flex flex-col justify-center p-16 text-white">
        <AuthImageSlider />
      </div>
    </div>
  );
}
