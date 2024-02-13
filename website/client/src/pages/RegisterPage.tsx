import React, { useEffect, useState } from "react";
import httpClient from "../httpClient";
import { useLocation } from "react-router-dom";
import "../style.css";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [organization, setOrganization] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    showProfilePic();
  }, []);

  function showProfilePic(): void {
    try {
      const profilePicUrl = location.state.profilePic;
      if (profilePicUrl) {
        setProfilePic(profilePicUrl);
      } else {
        setProfilePic("../images/noprofilepic.png");
      }
    } catch (error) {
      setProfilePic("../images/noprofilepic.png");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const registerUser = async () => {
    try {
      const resp = await httpClient.post("http://localhost:5000/register", {
        email,
        password,
        gender,
        dateOfBirth,
        profilePic,
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
      <form action="">
        <div>
          <img id="profile-pic" src={profilePic} alt="" />
          <a href="/profilepic">Add Profile Picture</a>
        </div>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id=""
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id=""
          />
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="M"
              checked={gender === "M"}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            />
            Male
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="F"
              checked={gender === "F"}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            />
            Female
          </label>
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            max={today}
          />
        </div>
        {/* <div>
          <label>Organization:</label>
          <select name="organizations" id="organizations">
            {organization.map((org: any) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <a href="/organization-page">
            <button type="button">Add Organization</button>
          </a>
        </div> */}
        <button type="submit" onClick={() => registerUser()}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
