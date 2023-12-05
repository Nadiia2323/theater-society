import { ChangeEvent, useState, useContext } from "react";
import NavBar from "../Components/NavBar";
import "./Profile.css";
// import News from "../Components/News";
import { AuthContext } from "../context/AuhContext";
interface ServerOkResponse extends UserImageType {
  message: string;
}
interface UserImageType {
  profilePhoto: string;
}
interface User {
  userName?: string;
  userEmail: string;
}

export default function Profile() {
  const {user}=useContext(AuthContext)
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [userPhoto, setUserPhoto] = useState<UserImageType | null>(null);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target :>> ", e);
    const file = e.target.files?.[0] || "";

    setSelectedFile(file);
    console.log("selectedFile :>> ", selectedFile);
  };

  const uploadPhoto = async (userId: string) => {
    const formdata = new FormData();
    formdata.append("profilePhoto", selectedFile);
    formdata.append("_id", userId);
    console.log("selectedFile :>> ", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/myApi/users/profilePhoto",
        requestOptions
      );
      const result = (await response.json()) as ServerOkResponse;
      

      console.log("result :>> ", result);

      setUserPhoto({ profilePhoto: result.profilePhoto });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
 

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="profile-container">
          <div className="BIO-container">
           
            {user && (
              <>
                <img
                  className="photo"
                  src={userPhoto?.profilePhoto || user.profilePhoto}
                  alt="your photo"
                />
                <p>BIO</p>
                <input type="file" onChange={handleInputChange} />
                <button onClick={() => uploadPhoto(user?.id )}>
                  upload photo
                </button>
              </>
            )}
          </div>
          <div className="followers-container">
            <p>followers:</p>
            <p>following:</p>
          </div>
        </div>
        <div className="news-container">
          <p>posts</p>
          <p>news</p>
          <p>likes</p>
        </div>
        {/* <News /> */}
      </div>
    </>
  );
}
