import React, { ReactNode, useEffect, useState } from "react";
import httpClient from "../httpClient";
import ReCAPTCHA from "react-google-recaptcha";
import { RefObject } from "react";
import RegisterFormField from "../components/RegisterFormField";
import { RegisterFormData, UserSchema } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfilePicPage from "./ProfilePicPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

const RegisterPage: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reCaptcha, setReCaptcha] = useState<string>("");
  const reCaptacharRef = React.createRef();
  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [confirmPasswordError, setConfirmPasswordError] =
    useState<ReactNode>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [exists, setExists] = useState<boolean>(true);

  library.add(faEye, faEyeSlash);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    setProfilePic(require("../images/noprofilepic.png"));
  }, []);

  const registerUser = async (data: any) => {
    try {
      await httpClient.post("http://localhost:5000/register", {
        ...data,
        profilePic,
        reCaptcha,
      });

      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        gender: "",
      });

      setProfilePic(require("../images/noprofilepic.png"));
      setReCaptcha("");
      setConfirmPassword("");

      setMessage("Account created successfully!");
    } catch (error: any) {
      if (error.response.status === 400) {
        console.log(error.response.data.message);
        setErrorMessage(error.response.data.message);

        setExists(false);

        reset({
          password: "",
        });

        setReCaptcha("");
        setConfirmPassword("");
      }
    }
  };

  const toggleProfileEditor = () => {
    setShowProfileEditor(!showProfileEditor);
  };

  const maxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    const maxDate = today.toISOString().split("T")[0];
    return maxDate;
  };

  //   useEffect(() => {
  //     const getOrganizations = async () => {
  //       const resp = await httpClient.get("http://localhost:5000/organizations");
  //       setOrganization(await resp.data.data);
  //       console.log(resp.data.data);
  //     };
  //     getOrganizations();
  //   }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  useEffect(() => {
    if (
      pass !== confirmPassword &&
      confirmPassword.length >= pass.length - 1 &&
      confirmPassword !== ""
    ) {
      setConfirmPasswordError(
        <span className="error-message-register">Passwords do not match</span>
      );
    } else {
      setConfirmPasswordError(null);
    }
  }, [pass, confirmPassword]);

  return (
    <div>
      {/* <p>{errorMessage}</p> */}

      <div id="register-container">
        <div id="register-image">
          <img src={require("../images/dubai_night.jpeg")} alt="" />
        </div>
        <form id="register-form" onSubmit={handleSubmit(registerUser)}>
          <div
            id="register-slide"
            className={showProfileEditor ? "slide-left" : ""}
          >
            <h1>Create an account</h1>
            <div className="register-fields">
              <div className="profile-pic-container">
                <img id="profile-pic" src={profilePic} alt="" />
                <button
                  id="profile-button"
                  type="button"
                  onClick={toggleProfileEditor}
                >
                  Add/Edit Profile Picture
                </button>
              </div>
              <div id="first-last">
                <div className="fields">
                  <RegisterFormField
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    register={register}
                    error={errors.firstName}
                  />
                </div>
                <div className="fields">
                  <RegisterFormField
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    register={register}
                    error={errors.lastName}
                  />
                </div>
              </div>
              <div className="fields">
                {errorMessage !== "" ? (
                  <span
                    className="error-message-register"
                    style={{
                      marginTop: "-20.5px",
                      position: "relative",
                    }}
                  >
                    {errorMessage}
                  </span>
                ) : null}
                <RegisterFormField
                  type="email"
                  placeholder="Email"
                  name="email"
                  register={register}
                  error={errors.email}
                  exists={exists}
                />
              </div>
              <div className="fields" id="pass">
                <RegisterFormField
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  register={register}
                  error={errors.password}
                  onChange={(e) => {
                    setPass(e.target.value);
                  }}
                />
                <button
                  id="clear-1"
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={
                    (errors.password?.message?.length ?? 0) > 45
                      ? { top: "41%" }
                      : { top: "17%" }
                  }
                >
                  {isPasswordVisible ? (
                    <FontAwesomeIcon icon={["fas", "eye-slash"]} />
                  ) : (
                    <FontAwesomeIcon icon={["fas", "eye"]} />
                  )}
                </button>
              </div>
              <div className="fields" id="confirm-pass">
                {confirmPasswordError}
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  // onBlur={() => handleConfirmPassword(pass, confirmPassword)}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={
                    confirmPasswordError
                      ? {
                          borderWidth: "2px",
                          borderColor: "rgb(201, 3, 3)",
                          padding: "9px",
                        }
                      : { padding: "9px", borderWidth: "2px" }
                  }
                />
                <button
                  id="clear-2"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {isConfirmPasswordVisible ? (
                    <FontAwesomeIcon icon={["fas", "eye-slash"]} />
                  ) : (
                    <FontAwesomeIcon icon={["fas", "eye"]} />
                  )}
                </button>
              </div>
              <div id="date-field">
                <label>Date of Birth:</label>
                <RegisterFormField
                  type="date"
                  max={maxDate()}
                  placeholder="Date of Birth"
                  name="dateOfBirth"
                  register={register}
                  error={errors.dateOfBirth}
                />
              </div>
              <div id="radio-fields">
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
              <div className="fields">
                <ReCAPTCHA
                  ref={reCaptacharRef as RefObject<ReCAPTCHA>}
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
                  onChange={(token) => setReCaptcha(token || "")}
                />
              </div>
              <div id="buttons">
                <button id="submit-1" type="submit">
                  Create
                </button>
              </div>
              <span id="created">{message}</span>
            </div>
          </div>
          <ProfilePicPage
            onClose={toggleProfileEditor}
            onProfilePicSubmit={(e: string) => setProfilePic(e)}
            className={showProfileEditor ? "" : "slide-left"}
            id="profile-pic-page"
          />
        </form>
        <div id="login">
          Already have an account?&nbsp;
          <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
