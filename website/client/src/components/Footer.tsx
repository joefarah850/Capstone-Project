import React from "react";
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import "../css/footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="contact-info">
          <p style={{ marginBottom: "8px" }}>
            Contact us:{" "}
            <a
              href="mailto:techpropaicustomerservice@gmail.com
"
            >
              techpropaicustomerservice@gmail.com
            </a>
          </p>
        </div>
        <div className="legal-links">
          <a href="/privacy-policy" target="_blank">
            Privacy Policy
          </a>
          <a href="/terms-and-conditions" target="_blank">
            Terms and Conditions
          </a>
        </div>
        <div className="social-media-icons">
          <a
            href="https://twitter.com/SLUMadrid"
            aria-label="Twitter"
            target="_blank"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/slumadrid/?hl=en"
            aria-label="Instagram"
            target="_blank"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/joe-farah-2036051b5/"
            aria-label="LinkedIn"
            target="_blank"
          >
            <FaLinkedin />
          </a>
        </div>
        <div className="company-address">
          <address
            style={{
              marginTop: "10px",
            }}
          >
            Av. del Valle, 34, Chamberí, 28003 Madrid
          </address>
        </div>
        <div className="copyright">
          <p>© 2024 TechProp.ai All rights reserved.</p>
        </div>
        <div className="mission-statement">
          <p style={{ marginTop: "0px" }}>
            Our mission is to empower real estate decisions through advanced AI
            analytics.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
