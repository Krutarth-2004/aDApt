import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { Users, Mail, Lock, Key, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPg = () => {
  const [showPass, setShowPass] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    admincode: "",
  });
  const [admin, setAdmin] = useState(false);
  const { login, isLoggingIn, adminlogin } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin) {
      adminlogin(formData);
    } else {
      login(formData);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="flex flex-col justify-center items-center mt-12 p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Sign In</h1>
                <p className="text-base-content/60">
                  Get started with your free account
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="xyz@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="******"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Key Field (Conditionally Rendered) */}
              {admin && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Admin Key</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type={showKey ? "text" : "password"}
                      className={`input input-bordered w-full pl-10`}
                      placeholder="Admin Key"
                      value={formData.admincode}
                      onChange={(e) =>
                        setFormData({ ...formData, admincode: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowKey(!showKey)}
                      aria-label={showKey ? "Hide admin key" : "Show admin key"}
                    >
                      {showKey ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Toggle Admin Mode */}
            <p className="text-base-content/60 text-xl my-3">
              Admin?{" "}
              <span
                className="text-primary cursor-pointer"
                onClick={() => setAdmin(!admin)}
              >
                {admin ? "No" : "Yes"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPg;
