import React, { useState } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../httpClient";
import RegisterFormField from "./RegisterFormField";
import { useForm } from "react-hook-form";
import { RegisterFormData, UserSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    register,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema),
    mode: "onBlur",
  });

  const newPassword = watch("password");

  const handleResetPassword = async () => {
    try {
      await httpClient.post(`http://localhost:5000/reset-password/${token}`, {
        password: newPassword,
      });
      alert("Password reset successfully");
    } catch (error: any) {
      if (error.response.status === 400) {
        alert("Invalid Credentials");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <div>
        <RegisterFormField
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          name="password"
          register={register}
          error={errors.password}
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? "Hide" : "Show"}
        </button>
      </div>
      <div>
        <RegisterFormField
          type={isConfirmPasswordVisible ? "text" : "password"}
          placeholder="Confirm Password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
        />
        <button type="button" onClick={toggleConfirmPasswordVisibility}>
          {isConfirmPasswordVisible ? "Hide" : "Show"}
        </button>
      </div>
      <button type="button" onClick={handleResetPassword}>
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
