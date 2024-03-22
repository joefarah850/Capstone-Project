import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "../css/register.scss";
import "../css/userPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

interface ProfilePicPageProps {
  onClose: () => void;
  onProfilePicSubmit: (profilePic: string) => void;
  className?: string;
  id?: string;
}

const videoConstraints = {
  width: 300,
  height: 300,
  facingMode: "user",
};

const ProfilePicPage: React.FC<ProfilePicPageProps> = ({
  onClose,
  onProfilePicSubmit,
  className,
  id,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  library.add(faRotateRight);

  const activateWebcam = () => {
    setIsWebcamActive(true);
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setPreview(imageSrc as string);
    setIsWebcamActive(false); // Deactivate webcam after capturing the photo
  }, [webcamRef]);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("handleFileChange");
  //   const file = e.target.files ? e.target.files[0] : null;
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       setPreview(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const onSave = () => {
    if (preview) {
      onProfilePicSubmit(preview);
      setPreview(null);
      onClose();
    }
  };

  const close = () => {
    setPreview(null);
    setIsWebcamActive(false);
    onClose();
  };

  return (
    <div id={id} className={className}>
      <h2>Upload Profile Picture</h2>
      <div id="avatar-hover" className="avatar-hover">
        {preview ? (
          <div className="show">
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                height: "auto",
                transform: "translateX(0)",
                borderRadius: "50%",
              }}
            />
            <FontAwesomeIcon
              icon={["fas", "rotate-right"]}
              id="undo"
              onClick={() => {
                setIsWebcamActive(true);
                setPreview(null);
              }}
            />
          </div>
        ) : isWebcamActive ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{
              width: "100%",
              height: "275px",
            }}
          />
        ) : (
          <button type="button" id="webcam-activate" onClick={activateWebcam}>
            Click Here!
          </button>
        )}
        <div id="webcam">
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ zIndex: 1000, position: "relative", opacity: 1 }}
          /> */}
        </div>
      </div>
      {isWebcamActive ? (
        <div id="buttons">
          <button
            id="cancel"
            onClick={() => setIsWebcamActive(false)}
            type="button"
          >
            Cancel
          </button>
          <button id="submit-2" onClick={capture} type="button">
            Take Photo
          </button>
        </div>
      ) : (
        <div id="buttons">
          <button id="cancel" type="button" onClick={close}>
            Back
          </button>
          <button id="submit-2" type="button" onClick={onSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePicPage;
