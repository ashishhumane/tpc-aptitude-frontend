import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice.ts";
const Auth = (): React.ReactNode => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    otp: "",
    isAdmin: false,
    rememberMe: false,
  });
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      toast.success("Login Successful", { description: response.data.message });
      console.log("userId", response.data);
      const userData = {
        user: {
          userId: response.data.user.id,
          email: response.data.user.email,
          firstName: response.data.user.firstName, // Add this
          lastName: response.data.user.lastName,
        },
        token: response.data.token,
      };

      dispatch(login(userData)); // Store user & token in Redux
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Login failed",
      });
    }
  };

  const handleGetOTP = async (e: any) => {
    console.log(import.meta.env.VITE_BASE_URL);
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}api/auth/register`, {
        email: formData.email,
      });
      setStep(2);
      toast.success("OTP Sent", {
        description: "Check your email for the OTP.",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to send OTP",
      });
    }
  };

  const handleRegister = async (e: any) => {
    console.log(formData.otp);
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/auth/verify`,
        formData
      );
      const userData = {
        user: {
          userId: response.data.user.id,
          email: response.data.user.email,
          firstName: response.data.user.firstName, // Add this
          lastName: response.data.user.lastName,
        },
        token: response.data.token,
      };

      dispatch(login(userData)); // Store user & token in Redux
      navigate("/dashboard");
      toast.success("Registration Successful", {
        description: response.data.message,
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full  justify-center items-center  text-white">
      <h1 className="text-xl font-semibold">Authentication</h1>
      <Tabs
        defaultValue="login"
        className="w-[400px] dark:bg-zinc-950 p-6 shadow-lg rounded-lg"
      >
        <TabsList className="flex justify-center mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        {/* Login Form */}
        <TabsContent value="login" className="text-center">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              className="text-gray-800 dark:text-gray-300"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              className="text-gray-800 dark:text-gray-300"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </TabsContent>

        {/* Register Form */}
        <TabsContent value="register" className="text-center">
          {step === 1 ? (
            <form onSubmit={handleGetOTP} className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full">
                Get OTP
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              className="space-y-4 flex flex-col justify-center items-center"
            >
              <InputOTP
                maxLength={6}
                value={formData.otp}
                onChange={(value) => setFormData({ ...formData, otp: value })} // Fix here
              >
                <label htmlFor="">OTP </label>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
