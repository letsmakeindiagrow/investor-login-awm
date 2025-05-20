import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
    setLoginError(""); // Clear login error when user starts typing
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address (e.g., name@example.com)";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        }
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const getErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
    // Try to get the error message from the response data
    const responseData = error.response?.data;
    if (responseData) {
      return (
        responseData.message ||
        responseData.error ||
        responseData.details ||
        "Unknown error occurred"
      );
    }
    return "An error occurred while processing your request";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); // Clear any previous login errors

    // Validate all fields before submitting
    let hasErrors = false;
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field as keyof typeof formData]);
      if (!formData[field as keyof typeof formData]) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setLoginError("Please fill in all required fields: Email and Password");
      return;
    }

    try {
      const response = await axios.post(`/api/v1/auth/login`, formData, {
        withCredentials: true,
      });
      console.log("Login successful:", response.data);
      window.location.href = import.meta.env.VITE_REDIRECT_URL;
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof AxiosError) {
        if (!error.response) {
          setLoginError(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        } else {
          // Get the error message from the API response
          const errorMessage = getErrorMessage(error);

          switch (error.response.status) {
            case 401:
              setLoginError(`Authentication failed: ${errorMessage}`);
              break;
            case 403:
              setLoginError(`Access denied: ${errorMessage}`);
              break;
            case 404:
              setLoginError(`Not found: ${errorMessage}`);
              break;
            case 429:
              setLoginError(`Rate limit exceeded: ${errorMessage}`);
              break;
            case 500:
              setLoginError(`Server error: ${errorMessage}`);
              break;
            default:
              setLoginError(
                `Error (${error.response.status}): ${errorMessage}`
              );
          }
        }
      } else {
        setLoginError(
          "An unexpected error occurred. Please refresh the page and try again."
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle
            className="text-2xl font-bold"
            style={{ color: "#00ADEF" }}
          >
            Login to Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-red-500" : ""}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: "#A8CF45", color: "white" }}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
            <Link to="/register">
              <Button
                variant="outline"
                style={{ borderColor: "#00ADEF", color: "#00ADEF" }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
