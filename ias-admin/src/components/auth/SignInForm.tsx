import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import {
  login,
  clearError,
  selectLoginStatus,
  selectAuthError,
  selectIsAuthenticated,
  selectCurrentUser,
} from "../../store/slices/authslice"; // Adjust path as needed
import type { AppDispatch } from "../../store"; // <-- Import your AppDispatch type

export default function SignInForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: ""
  });

  // Redux state
  const loginStatus = useSelector(selectLoginStatus);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  // Redirect if already authenticated — respect role
  useEffect(() => {
    if (isAuthenticated) {
      const role = currentUser?.role || localStorage.getItem("role");
      if (role === "news_editor") {
        navigate("/news");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle input changes
  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {
      email: "",
      password: ""
    };

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
     
      const result = await dispatch(login({
        email: formData.email.trim(),
        password: formData.password.trim(),
      }));

      if (login.fulfilled.match(result)) {
        // Login successful - persist role and navigate based on role
        const payloadUser = result.payload?.user;
        try {
          const roleToStore = payloadUser?.role || payloadUser?.data?.role;
          if (roleToStore) {
            localStorage.setItem("role", String(roleToStore));
          }
        } catch (e) {
          // ignore
        }

        if (payloadUser?.role === "news_editor") {
          navigate("/news");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const isLoading = loginStatus === "loading";

  return (
    <div className="flex flex-col justify-center w-full max-w-md mx-auto my-auto">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-[#017DC3] dark:text-gray-400"
        >
          <ChevronLeftIcon className="size-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="w-full p-7 sm:p-8 bg-white border border-gray-200/80 shadow-xl rounded-2xl dark:bg-gray-900 dark:border-gray-800">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl tracking-tight">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your email and password to sign in!
          </p>
        </div>

        {/* Display API error if any */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
            <p className="text-xs font-medium">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input 
              placeholder="info@gmail.com" 
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isLoading}
              className={formErrors.email ? "border-red-500" : ""}
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <Label>
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={isLoading}
                className={formErrors.password ? "border-red-500" : ""}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-3.5 top-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeIcon className="size-5 fill-current" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-current" />
                )}
              </span>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Checkbox 
                checked={isChecked} 
                onChange={setIsChecked}
                disabled={isLoading}
              />
              <span className="text-sm font-normal text-gray-700 dark:text-gray-400 select-none">
                Keep me logged in
              </span>
            </div>
          </div>
          
          <div>
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-[#017DC3] hover:bg-[#0168A5] active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-md shadow-[#017DC3]/25 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}