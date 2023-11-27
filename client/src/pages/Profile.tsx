import { ChangeEvent, ChangeEventHandler, useState } from "react";
import NavBar from "../Components/NavBar";
import "./Profile.css";
export default function Profile() {

  const [selectedFile, setSelectedFile] = useState<File | string>('')
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || "";

    setSelectedFile(file);
  }
  
    const uploadPhoto = async () => {
      const formdata = new FormData();
      formdata.append("profilePhoto", selectedFile);

      const requestOptions = {
        method: 'POST',
        body: formdata,
  
      };
      try {
        const response = await fetch('http://localhost:5000/myApi/users/profilePhoto', requestOptions)
        const result = await response.json()
      } catch (error) {
        console.log('error :>> ', error);
      }

    }

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="profile-container">
          <div className="BIO-container">
            <img className="photo" src="" alt="your photo" />
            <p>BIO</p>
            <input type="file" onChange={handleInputChange} />
            <button onClick={uploadPhoto}>upload photo</button>
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
      </div>
    </>
  );
}


