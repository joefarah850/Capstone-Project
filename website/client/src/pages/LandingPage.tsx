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
          <div>
            <div className="intro">
              <div id="slogan">
                <h1>
                  Enhance Investment<br></br>Decisions<br></br>
                  <br></br>Predict with AI<br></br>Invest Smart
                </h1>
              </div>
              <div id="getting-started">
                <h2>Get Started</h2>
                <video id="help-video" controls>
                  <source
                    src={require("../videos/help.mp4")}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="get-started-buttons">
                  <button onClick={() => (window.location.href = "/login")}>
                    Login
                  </button>
                  <button onClick={() => (window.location.href = "/register")}>
                    Register
                  </button>
                </div>
              </div>
            </div>
            <div>
              <PredictionForm className={user ? "" : "disabled"} />
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
