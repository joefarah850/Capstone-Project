import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import { useNavigate } from "react-router-dom";

const ProfilePicPage: React.FC = () => {
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const onClose = () => {
    setProfilePic(null);
  };

  const onCrop = (view: any) => {
    setProfilePic(view);
  };

  const navigateToRegister = () => {
    navigate("/register", { state: { profilePic } });
  };

  return (
    <div>
      <div>
        <Avatar
          width={400}
          height={400}
          onClose={onClose}
          onCrop={onCrop}
          src={profilePic || undefined}
        />
      </div>
      <div>
        <button onClick={navigateToRegister}>Submit</button>
      </div>
    </div>
  );
};

export default ProfilePicPage;
