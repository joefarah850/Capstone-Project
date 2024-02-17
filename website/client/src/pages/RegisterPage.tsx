import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import { useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { RefObject } from "react";
import "../style.css";
import RegisterFormField from "../components/RegisterFormField";
import { RegisterFormData, UserSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterPage: React.FC = () => {
  const [gender, setGender] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reCaptcha, setReCaptcha] = useState<string>("");
  const location = useLocation();
  const reCaptacharRef = React.createRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    showProfilePic();
  }, []);

  function showProfilePic(): void {
    try {
      const profilePicUrl = location.state.profilePic;
      if (profilePicUrl) {
        setProfilePic(profilePicUrl);
      } else {
        setProfilePic(require("../images/noprofilepic.png"));
      }
    } catch (error) {
      setProfilePic(require("../images/noprofilepic.png"));
    }
  }

  // const today = new Date().toISOString().split("T")[0];

  const registerUser = async (data: any) => {
    try {
      console.log(profilePic);
      const resp = await httpClient.post("http://localhost:5000/register", {
        ...data,
        profilePic,
        reCaptcha,
      });

      window.location.href = "/";
    } catch (error: any) {
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  //   useEffect(() => {
  //     const getOrganizations = async () => {
  //       const resp = await httpClient.get("http://localhost:5000/organizations");
  //       setOrganization(await resp.data.data);
  //       console.log(resp.data.data);
  //     };
  //     getOrganizations();
  //   }, []);

  return (
    <div>
      <h1>Create an account</h1>
      <p>{errorMessage}</p>
      <form onSubmit={handleSubmit(registerUser)}>
        <div>
          <img id="profile-pic" src={profilePic} alt="" />
          <a href="/profilepic">Add Profile Picture</a>
        </div>
        <div>
          <RegisterFormField
            type="text"
            placeholder="First Name"
            name="firstName"
            register={register}
            error={errors.firstName}
          />
        </div>
        <div>
          <RegisterFormField
            type="text"
            placeholder="Last Name"
            name="lastName"
            register={register}
            error={errors.lastName}
          />
        </div>
        <div>
          <RegisterFormField
            type="email"
            placeholder="Email"
            name="email"
            register={register}
            error={errors.email}
          />
        </div>
        <div>
          <RegisterFormField
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
          />
        </div>
        <div>
          <RegisterFormField
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
          />
        </div>
        <div>
          <RegisterFormField
            type="date"
            placeholder="Date of Birth"
            name="dateOfBirth"
            register={register}
            error={errors.dateOfBirth}
          />
        </div>
        <div>
          <RegisterFormField
            type="radio"
            options={[
              { label: "Male", value: "M" },
              { label: "Female", value: "F" },
            ]}
            name="gender"
            register={register}
            error={errors.gender}
            placeholder={""}
          />
        </div>
        <div>
          <ReCAPTCHA
            ref={reCaptacharRef as RefObject<ReCAPTCHA>}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
            onChange={(token) => setReCaptcha(token || "")}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterPage;
function zodSolver(
  UserSchema: any
): import("react-hook-form").Resolver<FormData, any> | undefined {
  throw new Error("Function not implemented.");
}
