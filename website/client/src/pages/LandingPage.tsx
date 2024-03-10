import React, { useEffect } from "react";
import httpClient from "../httpClient";
import { User } from "../types";
import PredictionForm from "../components/PredictionForm";
import "../css/landingPage.scss";
import Footer from "../components/Footer";

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
        <div className="container">
          <div>
            <div className="intro">
              <div id="slogan">
                <h1>
                  Enhance Investment<br></br>Decisions
                  <br></br>
                  <br></br>Predict with AI<br></br>Invest Smart
                  <br></br>
                  <span
                    style={{
                      fontSize: "0.5em",
                      color: "white",
                      fontWeight: "normal",
                      position: "relative",
                      top: "-10px",
                    }}
                  >
                    (Dubai Market Only)
                  </span>
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
                {user == null ? (
                  <div className="get-started-buttons">
                    <button onClick={() => (window.location.href = "/login")}>
                      Login
                    </button>
                    <button
                      onClick={() => (window.location.href = "/register")}
                    >
                      Register
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <PredictionForm className={user ? "" : "disabled"} />
            </div>
            <div className="divs">
              <div className="divs2">
                <div className="info">
                  <h2>Mission Statement</h2>
                  <img
                    src={require("../images/ai_image3.png")}
                    alt="Mission Statement"
                    id="img1"
                  />
                  <p>
                    Empowering the real estate industry with cutting-edge AI
                    technology, our Real Estate Market Analysis Tool
                    revolutionizes the way professionals, investors, and
                    everyday users engage with the market. By automating and
                    enhancing the accuracy of property analysis and market trend
                    predictions, we provide a time-efficient, data-driven
                    solution that supports informed decision-making. Our mission
                    is to transform real estate market analysis, making it
                    accessible, reliable, and pivotal for success in today's
                    fast-paced environment.
                  </p>
                </div>
                <div className="info">
                  <h2>How it works</h2>
                  <p>
                    Through the leveraging of Artificial Neural Networks, we are
                    able to analyze vast amounts of real-time Dubai real estate
                    market data gathered from property listing websites. By
                    inputting property features and other relevant data, our
                    tool processes this information through sophisticated
                    machine learning models to predict property prices and
                    provide actionable market insights. The process is
                    streamlined and user-friendly, ensuring that even those with
                    no technical background can benefit from our powerful
                    analytics. Furthermore, this tool is successful at giving
                    data driven insight with an astounding accuracy of 90%.
                  </p>
                  <img
                    src={require("../images/ai_image4.png")}
                    alt="How It Works"
                  />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
