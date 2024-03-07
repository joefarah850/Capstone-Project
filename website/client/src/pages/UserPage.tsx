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

  const load = async () => {
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
    } catch (error: any) {
      console.log(error);
      window.location.replace("/login");
    }
  };

  useEffect(() => {
    load();
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
    if (profilePic === "" || profilePic === "../images/noprofilepic.png") {
      setProfilePic(require("../images/noprofilepic.png"));
    }
  }, [profilePic]);

  const getOrganizations = async () => {
    const resp = await httpClient.get("http://localhost:5000/organizations");
    setOrganizations(await resp.data.data);
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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
                    <div className="pair">
                      <div>
                        <strong>Email:</strong>{" "}
                        <input disabled type="text" value={user.data.email} />
                      </div>
                      <div>
                        <strong>Date of Birth:</strong>{" "}
                        <input
                          disabled
                          type="text"
                          value={user.data.dateOfBirth.toDateString()}
                        />
                      </div>
                    </div>
                    <div className={editable ? "" : "uneditable"}>
                      <div className="pair">
                        <div>
                          <strong>Phone Number:</strong>{" "}
                          <PhoneInput
                            placeholder="Enter phone number"
                            value={phoneNumber || ""}
                            onChange={(e) => setPhoneNumber(e || "")}
                          />
                        </div>
                        <div>
                          <strong>Country:</strong>{" "}
                          <select
                            name=""
                            id=""
                            onChange={(e) =>
                              setCountry(labelCountry.getLabel(e.target.value))
                            }
                            value={country}
                            defaultValue={"AE"}
                          >
                            {countries.map((country: any) => {
                              return (
                                <option
                                  key={country.value}
                                  value={country.value}
                                >
                                  {country.label}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="pair">
                        <div>
                          <strong>City: </strong>
                          <input
                            type="text"
                            onChange={(e) => setCity(e.target.value)}
                            value={city}
                            placeholder="Enter city name"
                          />
                        </div>
                        <div>
                          <strong>Organization:</strong>{" "}
                          <div id="new-org">
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
                              <span id="add">+</span>
                              {/* <span id="text-add">Add</span> */}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pair">
                      <div>
                        <strong>Account Created:</strong>{" "}
                        <input
                          disabled
                          type="text"
                          value={formatDate(user.data.accountCreationDate)}
                        />
                      </div>
                      <div>
                        <strong>Last Login:</strong>{" "}
                        <input
                          disabled
                          type="text"
                          value={formatDate(user.data.lastLogin)}
                        />
                      </div>
                    </div>
                    <div className="buttons">
                      {!editable ? (
                        <button type="button" onClick={toggleEdit}>
                          Edit Profile
                        </button>
                      ) : (
                        <>
                          <button type="button" onClick={saveChanges} id="save">
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditable(false);
                              load();
                            }}
                            id="cancel"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
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
