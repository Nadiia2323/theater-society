import { ChangeEvent,  useState } from "react";
import NavBar from "../Components/NavBar";
import "./Profile.css";
import News from "../Components/News";
interface ServerOkResponse extends UserImageType {
  message: string;
}
interface UserImageType {
  profilePhoto: string;
}
interface User {
  userName?: string,
  userEmail:string,
}

export default function Profile() {
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [userPhoto, setUserPhoto] = useState<UserImageType | null>(null);
  const [user, setUser] = useState<User | null>(null)
  const getProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('register first!')
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
  
      };
      try {
        const response = await fetch("http://localhost:5000/myApi/users/profile", requestOptions)
        const result = await response.json()
        console.log('result UserProfile :>> ', result);
       
      } catch (error) {
        console.log('error :>> ', error);
      }
    }
 

 
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target :>> ", e);
    const file = e.target.files?.[0] || "";

    setSelectedFile(file);
    console.log("selectedFile :>> ", selectedFile);
  };

  const uploadPhoto = async () => {
    const formdata = new FormData();
    formdata.append("profilePhoto", selectedFile);
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
      // const result = (await response.json())
      // const userPicture:UserImageType = result.profilePhoto

      console.log("result :>> ", result);
     
      
      setUserPhoto({ profilePhoto: result.profilePhoto });
      
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  // console.log('userPhoto :>> ', userPhoto);

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="profile-container">
          <div className="BIO-container">
            <button onClick={getProfile}>get Profile</button>
           
            <img className="photo" src={userPhoto?.profilePhoto} alt="your photo" />
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
        <News />
      </div>
    
      
    </>
  )
}
