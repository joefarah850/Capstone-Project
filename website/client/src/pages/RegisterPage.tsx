import React, { ReactNode, useEffect, useRef, useState } from "react";
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
  const [exists, setExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isSafari, setIsSafari] = useState(false);

  // useEffect(() => {
  //   setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  // }, []);

  library.add(faEye, faEyeSlash);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(UserSchema),
    mode: "onBlur",
  });

  const registerUser = async (data: any) => {
    localStorage.removeItem("registrationResponse");
    setIsLoading(true);

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    try {
      const resp = await httpClient.post("http://localhost:5000/register", {
        ...data,
        profilePic,
        reCaptcha,
      });

      // localStorage.setItem(
      //   "registrationResponse",
      //   JSON.stringify({
      //     message: resp.data.message,
      //     data: resp.data.data,
      //     error: false,
      //   })
      // );

      // window.location.reload();
      // localStorage.setItem("autoReload", "true");
      setMessage(resp.data.message);
      await delay(1500);
      window.location.href = "/";
    } catch (error: any) {
      if (error.response.status === 400) {
        localStorage.setItem(
          "registrationResponse",
          JSON.stringify({
            message: error.response.data.message,
            data: error.response.data.data,
            error: true,
          })
        );

        window.location.reload();
        localStorage.setItem("autoReload", "true");
      }
    } finally {
      setIsLoading(false);
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  useEffect(() => {
    if (
      pass !== confirmPassword &&
      confirmPassword.length >= pass.length &&
      confirmPassword !== ""
    ) {
      setConfirmPasswordError(
        <span className="error-message-register">Passwords do not match</span>
      );
    } else {
      setConfirmPasswordError(null);
    }
  }, [pass, confirmPassword]);

  const handleConfirmPassword = (pass: string, confirmPassword: string) => {
    if (pass !== confirmPassword) {
      setConfirmPasswordError(
        <span className="error-message-register">Passwords do not match</span>
      );
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleExists = () => {
    setExists(false);
    setErrorMessage("");
  };

  useEffect(() => {
    const registrationResponse = localStorage.getItem("registrationResponse");

    if (registrationResponse) {
      const { message, data, error } = JSON.parse(registrationResponse);

      if (error) {
        setValue("email", data.email, { shouldValidate: true });
        setValue("firstName", data.firstName, { shouldValidate: true });
        setValue("lastName", data.lastName, { shouldValidate: true });
        setValue("dateOfBirth", data.dateOfBirth, { shouldValidate: true });
        setValue("gender", data.gender, { shouldValidate: true });
        setProfilePic(data.profilePic);

        setExists(true);
        setErrorMessage(message);
      } else {
        setMessage(message);
      }
    } else {
      setProfilePic(require("../images/noprofilepic.png"));
    }
  }, [setValue]);

  useEffect(() => {
    if (profilePic === "") {
      setProfilePic(require("../images/noprofilepic.png"));
    }
  }, [profilePic]);

  const hasRunOnce = useRef(false);

  useEffect(() => {
    if (hasRunOnce.current) {
      return;
    }
    const navigationEntries = performance.getEntriesByType("navigation");
    if (navigationEntries.length > 0) {
      const navigationEntry =
        navigationEntries[0] as PerformanceNavigationTiming;
      // The 'type' property can be 'navigate', 'reload', 'back_forward', or 'prerender'
      if (
        navigationEntry.type === "reload" &&
        localStorage.getItem("autoReload") !== "true"
      ) {
        localStorage.removeItem("registrationResponse");
        setMessage("");
        console.log("Page reloaded");
      } else {
        localStorage.removeItem("autoReload");
        console.log("Page loaded normally");
      }
    }
    hasRunOnce.current = true;
  }, []);

  return (
    <div>
      {/* <p>{errorMessage}</p> */}

      <div id="register-container">
        <div id="register-image">
          <img src={require("../images/dubai_night.jpeg")} alt="" />
        </div>
        <form id="register-form" onSubmit={handleSubmit(registerUser)}>
          {isLoading && (
            <>
              <div id="loading-container">
                <img src={require("../images/loading.gif")} alt="Loading..." />
              </div>
              <span id="created">{message}</span>
            </>
          )}
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
                    onFocus={() => {
                      setMessage("");
                    }}
                  />
                </div>
                <div className="fields">
                  <RegisterFormField
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    register={register}
                    error={errors.lastName}
                    onFocus={() => {
                      setMessage("");
                    }}
                  />
                </div>
              </div>
              <div className="fields">
                {errorMessage !== "" ? (
                  <span
                    className="error-message-register"
                    style={{
                      marginTop: "-16.5px",
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
                  onChange={handleExists}
                  onFocus={() => {
                    setMessage("");
                  }}
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
                  onFocus={() => {
                    setMessage("");
                  }}
                />
                <button
                  tabIndex={-1}
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
                  onBlur={() => handleConfirmPassword(pass, confirmPassword)}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => {
                    setMessage("");
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                  }}
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
                  tabIndex={-1}
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
                  onFocus={() => {
                    setMessage("");
                  }}
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
                  onFocus={() => {
                    setMessage("");
                  }}
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
