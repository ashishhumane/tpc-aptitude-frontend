import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {Loader2} from "lucide-react"
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGettingOtp, setIsGettingOtp] = useState(false);

  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },{
          withCredentials: true
        }
      );

      toast.success(response.data.message);
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
      })
    }finally{
      setIsLoggingIn(false);
    }
  };

  const handleGetOTP = async (e: any) => {
    console.log(import.meta.env.VITE_BASE_URL);
    e.preventDefault();
    setIsGettingOtp(true);
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
    }finally {
      setIsGettingOtp(false)
    }
  };

  const handleRegister = async (e: any) => {
    console.log(formData.otp);
    e.preventDefault();
    setIsRegistering(true);
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

      dispatch(login(userData )); // Store user & token in Redux
      navigate("/dashboard");
      toast.success("Registration Successful", {
        description: response.data.message,
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Registration failed",
      });
    }finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full  justify-center items-center  text-white">
      <div className="mb-8">
      {/* Light mode logo */}
      <img
        src="/TPC-PCE%20TRANSPARENT%20(1).png"
        alt="TPC Logo"
        className="h-32 mx-auto block dark:hidden"
      />
      
      {/* Dark mode logo */}
      <img
        src="/white%20font%20tpc%20(1).png"
        alt="TPC Logo"
        className="h-32 mx-auto hidden dark:block"
      />
    </div>
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

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
              ) : (
                  "Login"
              )}
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
                className="text-black dark:text-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full">
                {isGettingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                ) : (
                    "Get Otp"
                )}
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
                <InputOTPGroup className="text-black dark:text-white">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="text-black dark:text-white">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Input
                type="text"
                name="firstName"
                className="text-black dark:text-white"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="text-black dark:text-white"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="text-black dark:text-white"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                ) : (
                    "Register"
                )}
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
