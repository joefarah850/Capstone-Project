import React, { useState } from "react";
import Avatar from "react-avatar-edit";

interface ProfilePicPageProps {
  onClose: () => void;
  onProfilePicSubmit: (profilePic: string) => void;
}

const ProfilePicPage: React.FC<ProfilePicPageProps> = ({
  onClose,
  onProfilePicSubmit,
}) => {
  const [profilePic, setProfilePic] = useState(null);

  const onCrop = (view: any) => {
    setProfilePic(view);
    onProfilePicSubmit(view);
  };

  return (
    <div>
      <div>
        <Avatar
          width={400}
          height={400}
          onCrop={onCrop}
          src={profilePic || undefined}
        />
      </div>
      <div>
        <button onClick={onClose}>Submit</button>
      </div>
    </div>
  );
};

export default ProfilePicPage;
