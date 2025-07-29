'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "@/components/theme-switcher";

// ThemeSwitcher component for dark/light mode
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      setMessage("User already exists with this email.");
      return;
    }

    // 2. Insert new user (plain password, not secure for production)
    const { error: insertError } = await supabase
      .from("user")
      .insert([{ email, password }]);

    if (insertError) {
      setMessage("Error creating user: " + insertError.message);
    } else {
      setMessage("Signup successful! You can now log in.");
      setEmail('');
      setPassword('');
      setTimeout(() => router.push("/auth/login"), 1200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors relative">
      <ThemeSwitcher />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-200 mb-2">Create an Account</h1>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-6">Sign up to start your blogging journey!</p>
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pr-12"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(show => !show)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-blue-600 dark:text-blue-300 bg-transparent hover:underline focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md"
          >
            Sign Up
          </button>
        </form>
        {message && (
          <div className={`mt-6 text-center text-base font-medium ${message.startsWith("Signup successful") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </div>
        )}
        <div className="mt-6 text-center text-gray-500 dark:text-gray-300 text-sm">
          Already have an account? <a href="/auth/login" className="text-blue-600 hover:underline">Log in</a>
        </div>
      </div>
    </div>
  );
}