import React, { useState } from "react";
import httpClient from "../httpClient";
import { LoginFormData, LoginUserSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginFormField from "./LoginFormField";

const ForgotPassword: React.FC = (data: any) => {
  const {
    register,
    watch,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginUserSchema),
  });

  const email = watch("email");

  const handleForgotPassword = async () => {
    try {
      await httpClient.post("http://localhost:5000/forgot-password", {
        email: email,
      });
      alert("Password reset email sent successfully");
    } catch (error: any) {
      if (error.response.status === 400) {
        alert("Invalid Credentials");
      }
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <LoginFormField
        type="email"
        placeholder="Email"
        name="email"
        login={register}
        error={undefined}
      />
      <button type="button" onClick={handleForgotPassword}>
        Submit
      </button>
    </div>
  );
};

export default ForgotPassword;
