import React, { useEffect, useMemo, useState } from "react";
import { User } from "../types";
import httpClient from "../httpClient";
import "../css/userPage.scss";
import ProfilePicPage from "./ProfilePicPage";
import Organization from "../components/Organization";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profilePic, setProfilePic] = useState<string>("");
  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false);
  const [organizations, setOrganizations] = useState<any>([]);
  const [organizationId, setOrganizationId] = useState<number>(1);
  const [showNewOrg, setShowNewOrg] = useState<boolean>(false);
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [editable, setEditable] = useState<boolean>(false);

  const countries = useMemo(() => countryList().getData(), []);
  const labelCountry = useMemo(() => countryList(), []);

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
        setCountry(userData.data.country);
        setCity(userData.data.city);
        setPhoneNumber(userData.data.phone);
        setOrganizationId(userData.data.organizationId);

        console.log(user);
      } catch (error: any) {
        console.log(error);
        window.location.replace("/login");
      }
    })();
  }, []);

  const saveChanges = async () => {
    try {
      const resp = await httpClient.post("http://localhost:5000/update-user", {
        phone: phoneNumber,
        country: country,
        city: city,
        organizationId: organizationId,
      });

      console.log(resp.data);

      setEditable(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const toggleProfileEditor = () => {
    setShowProfileEditor(!showProfileEditor);
  };

  const toggleNewOrg = () => {
    if (showNewOrg) {
      getOrganizations();
    }

    setShowNewOrg(!showNewOrg);
  };

  const toggleEdit = () => {
    setEditable(true);
  };

  useEffect(() => {
    if (profilePic === "") {
      setProfilePic(require("../images/noprofilepic.png"));
    }
  }, [profilePic]);

  const getOrganizations = async () => {
    const resp = await httpClient.get("http://localhost:5000/organizations");
    setOrganizations(await resp.data.data);
    console.log(resp.data.data);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return (
    <>
      {user != null ? (
        <div>
          <div id="profile-user-container">
            <form id="profile-user-form">
              <div
                id="profile-user-slide"
                className={
                  showProfileEditor
                    ? "slide-left"
                    : showNewOrg
                    ? "slide-up"
                    : ""
                }
              >
                <div className="user-profile">
                  <div className="profile-user-pic-container">
                    <img id="profile-user-pic" src={profilePic} alt="" />
                    <button
                      id="profile-user-button"
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
                    <div className={editable ? "" : "uneditable"}>
                      <div>
                        <strong>Phone Number:</strong>{" "}
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={phoneNumber || ""}
                          onChange={(e) => setPhoneNumber(e || "")}
                        />
                      </div>
                      <p>
                        <strong>Country:</strong>{" "}
                        <select
                          name=""
                          id=""
                          onChange={(e) =>
                            setCountry(labelCountry.getLabel(e.target.value))
                          }
                          value={country}
                        >
                          {countries.map((country: any) => {
                            return (
                              <option key={country.value} value={country.value}>
                                {country.label}
                              </option>
                            );
                          })}
                        </select>
                      </p>
                      <p>
                        <strong>City: </strong>
                        <input
                          type="text"
                          onChange={(e) => setCity(e.target.value)}
                          value={city}
                        />
                      </p>
                      <p>
                        <strong>Organization:</strong>{" "}
                        <select
                          name=""
                          id=""
                          onChange={(e) =>
                            setOrganizationId(Number(e.target.value))
                          }
                        >
                          {organizations.map((org: any) => {
                            return (
                              <option key={org.id} value={org.id}>
                                {org.name}
                              </option>
                            );
                          })}
                        </select>
                        <button type="button" onClick={toggleNewOrg}>
                          Add organization
                        </button>
                      </p>
                      <button type="button" onClick={saveChanges}>
                        Save Changes
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={toggleEdit}
                      className={!editable ? "" : "uneditable"}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              <ProfilePicPage
                onClose={toggleProfileEditor}
                onProfilePicSubmit={(e: string) => setProfilePic(e)}
                className={showProfileEditor ? "" : "slide-left"}
                id="profile-user-pic-userpage"
              />
              <Organization
                className={showNewOrg ? "slide-up" : ""}
                toggleNewOrg={toggleNewOrg}
                id="organization-userpage"
              />
            </form>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UserPage;
