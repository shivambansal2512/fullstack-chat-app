import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessagesSquare, User } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() === true) signup(formData);
  };

  return (
    <div className="relative h-full flex items-center justify-center px-4 py-8 overflow-y-auto">
      {/* Soft glow behind the card */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[28rem] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <MessagesSquare className="size-6 text-primary-content" />
          </div>
          <h1 className="text-2xl font-semibold mt-4">Create your account</h1>
          <p className="text-sm text-base-content/50 mt-1">Start chatting in a few seconds</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-base-100 border border-base-300 rounded-2xl p-6"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-base-content/60">Full name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Shivam Bansal"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-base-200 border border-base-300 text-sm
                  placeholder:text-base-content/40 focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-base-content/60">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full h-11 pl-9 pr-3 rounded-xl bg-base-200 border border-base-300 text-sm
                  placeholder:text-base-content/40 focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-base-content/60">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full h-11 pl-9 pr-10 rounded-xl bg-base-200 border border-base-300 text-sm
                  placeholder:text-base-content/40 focus:outline-none focus:border-primary/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full h-11 rounded-xl bg-primary text-primary-content text-sm font-medium
              hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-base-content/50 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
