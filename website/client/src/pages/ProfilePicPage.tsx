import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import "../css/register.scss";

interface ProfilePicPageProps {
  onClose: () => void;
  onProfilePicSubmit: (profilePic: string) => void;
  className?: string;
  id?: string;
}

const ProfilePicPage: React.FC<ProfilePicPageProps> = ({
  onClose,
  onProfilePicSubmit,
  className,
  id,
}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCrop = (croppedView: string) => {
    setCroppedImage(croppedView);
  };

  const onSave = () => {
    if (croppedImage) {
      onProfilePicSubmit(croppedImage);
      onClose();
    }
  };

  return (
    <div id={id} className={className}>
      <h2>Upload Profile Picture</h2>
      <div id="avatar-hover">
        <Avatar
          width={300}
          height={300}
          onCrop={onCrop}
          src={profilePic || undefined}
          labelStyle={{
            color: "#133C55",
            fontWeight: "bold",
            fontSize: "25px",
            display: "block",
            height: "100%",
            width: "100%",
          }}
          borderStyle={{
            marginTop: "10px",
            border: "2px dashed #133C55",
            textAlign: "center",
            borderRadius: "5%",
          }}
        />
      </div>
      <div id="buttons">
        <button id="cancel" type="button" onClick={onClose}>
          Back
        </button>
        <button id="submit-2" type="button" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfilePicPage;
