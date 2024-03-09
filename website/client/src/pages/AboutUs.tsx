import React from "react";
import "../css/aboutus.scss";
import Footer from "../components/Footer";

const AboutUs: React.FC = () => {
  return (
    <>
      <div>
        <div className="container-aboutus">
          <div>
            <div className="divs-aboutus">
              <div className="divs2-aboutus">
                <div className="info-aboutus">
                  <h2>About Us</h2>

                  <p>
                    Welcome to Techprop.ai, where the future of real estate in
                    Dubai meets Artificial Intelligence. We are a team of two
                    ambitious seniors, Samia Mahdaoui and Joe Farah, from Saint
                    Louis University, Madrid. Standing on the brink of
                    graduation, we both have a shared passion that lies at the
                    intersection of mathematics, artificial intelligence, and
                    data science.<br></br> Our journey began almost a year ago,
                    driven by our curiosity and a shared vision to revolutionize
                    the way property prices are predicted in Dubai. As seniors,
                    our academic paths have been rich with courses in AI,
                    machine learning, and data analytics, equipping us with the
                    necessary skills to tackle real-world problems. <br></br>
                    <br></br>
                    Our Project: Techprop.ai is more than just a capstone; it's
                    the culmination of our academic journey and a testament to
                    our year-long dedication. We've developed a website that
                    hosts an innovative Artificial Neural Network (ANN) designed
                    to predict property prices in Dubai with 90% accuracy. This
                    project not only showcases our technical prowess but also
                    our commitment to contributing to the field of AI in real
                    estate. <br></br>
                    <br></br>As we stand on the threshold of graduation,
                    Techprop.ai represents not just what we have learned, but
                    also our hopes for the future. It's a bridge between our
                    academic pursuits and our professional aspirations,
                    illustrating our belief in the power of AI to transform the
                    world for the better. We invite you to explore Techprop.ai,
                    a reflection of our journey, passion, and the possibilities
                    that lie ahead in the realm of AI and real estate. Join us
                    as we embark on this exciting venture, pushing the
                    boundaries of what's possible and paving the way for a new
                    era in property valuation.
                  </p>
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

export default AboutUs;
