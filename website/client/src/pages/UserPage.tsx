import React, { useEffect, useState } from "react";
import { User } from "../types";
import httpClient from "../httpClient";
import "../css/userPage.scss";
import ProfilePicPage from "./ProfilePicPage";

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setProfilePic] = useState<string>("");
  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("http://localhost:5000/@me");

        const userData: User = {
          ...resp.data,
          data: {
            ...resp.data.data,
            dateOfBirth: new Date(resp.data.data.dateOfBirth),
            accountCreationDate: new Date(resp.data.data.accountCreationDate),
            lastLogin: new Date(resp.data.data.lastLogin),
          },
        };

        setUser(userData);
        setProfilePic(userData.data.profile_pic);

        console.log(user);
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, []);

  const toggleProfileEditor = () => {
    setShowProfileEditor(!showProfileEditor);
  };

  useEffect(() => {
    if (profilePic === "") {
      setProfilePic(require("../images/noprofilepic.png"));
    }
  }, [profilePic]);

  return (
    <>
      {user != null ? (
        <div>
          {/* <p>{errorMessage}</p> */}

          <div id="profile-container">
            <form id="profile-form">
              <div
                id="profile-slide"
                className={showProfileEditor ? "slide-left" : ""}
              >
                <div className="user-profile">
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
                  <div className="user-details">
                    <h1>{`${user.data.firstName} ${user.data.lastName}`}</h1>
                    <p>
                      <strong>Email:</strong> {user.data.email}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {user.data.dateOfBirth.toDateString()}
                    </p>
                    <p>
                      <strong>Account Created:</strong>{" "}
                      {user.data.accountCreationDate.toDateString()}
                    </p>
                    <p>
                      <strong>Last Login:</strong>{" "}
                      {user.data.lastLogin.toDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <ProfilePicPage
                onClose={toggleProfileEditor}
                onProfilePicSubmit={(e: string) => setProfilePic(e)}
                className={showProfileEditor ? "" : "slide-left"}
                id="profile-pic-userpage"
              />
            </form>
          </div>
        </div>
      ) : (
        window.location.replace("/login")
      )}
    </>
  );
};

export default UserPage;
