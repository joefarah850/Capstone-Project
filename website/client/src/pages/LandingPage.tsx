import React, { useEffect } from "react";
import httpClient from "../httpClient";
import { User } from "../types";
import PredictionForm from "../components/PredictionForm";
import "../css/landingPage.scss";

const LandingPage = () => {
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("http://localhost:5000/@me");

        setUser(resp.data);
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <div>
        {/* {user != null ? (
          <div>
            <h2>Logged in</h2>
            <img src={getProfilePic()} alt="Profile Pic" />
            <h3>Email: {user.data.email}</h3>
            <h3>ID: {user.data.id}</h3>
            <h3>{user.message}</h3>
          </div>
        ) : ( */}
        <div className="container">
          <img
            src={require("../images/dubai_night.jpeg")}
            alt="background"
            id="background"
          />
          <div>
            <p>{user ? "Logged In" : "You are not logged in"}</p>
            <div className="divs">
              <a href="/login">
                <button>Login</button>
              </a>
              <a href="/register">
                <button>Register</button>
              </a>
            </div>
            <div className={user ? "divs" : "divs disabled"}>
              <div className={user ? "" : "disabled-cover"}></div>
              <span className={user ? "disabled" : ""}>
                Login or Register *Lock Icon*
              </span>
              <PredictionForm />
            </div>
            <div className="divs">
              <div>
                <img src="" alt="" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                  nec libero at lectus tincidunt tincidunt. Nulla facilisi. Nunc
                  sit amet odio nec libero tincidunt tincidunt. Nulla facilisi.
                  Nunc sit amet odio nec libero tincidunt tincidunt. Nulla
                  facilisi. Nunc sit amet odio nec libero tincidunt tincidunt.
                  Nulla facilisi. Nunc sit amet odio nec libero tincidunt
                  tincidunt. Nulla facilisi.
                </p>
              </div>
              <div>
                <img src="" alt="" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                  nec libero at lectus tincidunt tincidunt. Nulla facilisi. Nunc
                  sit amet odio nec libero tincidunt tincidunt. Nulla facilisi.
                  Nunc sit amet odio nec libero tincidunt tincidunt. Nulla
                  facilisi. Nunc sit amet odio nec libero tincidunt tincidunt.
                  Nulla facilisi. Nunc sit amet odio nec libero tincidunt
                  tincidunt. Nulla facilisi.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
      <footer>
        <p>Footer</p>
      </footer>
    </>
  );
};

export default LandingPage;
