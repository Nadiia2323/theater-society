import { ChangeEvent, useState } from "react";
import { AuthContext } from "../context/AuhContext";
import { useContext } from "react";
import "./UpdateProfile.css";
import { getToken } from "../utils/login";
import Menu from "./Menu";

const UpdateProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    quote:""
  });
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  // const [userPhoto, setUserPhoto] = useState<UserImageType | null>(null);
  const { user } = useContext(AuthContext);
  console.log("user :>> ", user);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));

    const file = e.target.files?.[0] || "";

    setSelectedFile(file);
    console.log("selectedFile :>> ", selectedFile);
  };

  const handleProfilePhotoUpload = async () => {
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formdata = new FormData();
    formdata.append("profilePhoto",  selectedFile);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      
    };
    try {
      const response = await fetch("http://localhost:5000/myApi/users/profilePhoto", requestOptions)
      const result = await response.json()
      console.log('result :>> ', result);
    } catch (error) {
      console.log('error :>> ', error);
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};

    if (userData.name) {
      updatedData.name = userData.name;
    }

    if (userData.email) {
      updatedData.email = userData.email;
    }

    if (userData.password) {
      updatedData.password = userData.password;
    }
    if (userData.quote) {
      updatedData.quote = userData.quote
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        const token = getToken();
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const urlencoded = new URLSearchParams();
        if (updatedData.name) {
          urlencoded.append("name", updatedData.name);
        }
        if (updatedData.email) {
          urlencoded.append("email", updatedData.email);
        }
        if (updatedData.password) {
          urlencoded.append("password", updatedData.password);
        }
        if (updatedData.quote) {
          urlencoded.append("quote", updatedData.quote);
        }

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: urlencoded,
        };

        const response = await fetch(
          "http://localhost:5000/myApi/users/profileSettings",
          requestOptions
        );
        const result = await response.json();
        alert(result.message)
      } catch (error) {
        console.error("error:", error);
      }
    } else {
      alert("Please fill in at least one field to update.");
    }
  };

  return (
    <>
      <Menu />
      <div className="form-container">

        <h2>Update Profile</h2>
        <div className="profilePhto-holder">
        <div>
          
              <img className="profilePhoto" src={user.profilePhoto || selectedFile} alt="" /> Profile Photo
            
        </div>
        <div className="upload-button">
          <input type="file" onChange={handleInputChange} />
        <button onChange={handleProfilePhotoUpload}>upload photo</button>
          </div>
          </div>
        
        <form className="form" onSubmit={handleSubmit}>
          <label>
            
            Name:
            <input
              type="text"
              name="name"
              placeholder={user.userName }
              value={userData.name}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Email: <input
              type="email"
              name="email"
              placeholder={user.email}
              value={userData.email }
              onChange={handleInputChange}
            />
          </label>
          <label > Quote: <input type="text" name="quote" placeholder={user.quote} value={userData.quote} onChange={handleInputChange}/></label>
          <label > About: <input type="text" placeholder={user.bio} /></label>
          {/* <label>
            Password:
            <input
              type="password"
              name="password"
              value={userData.password}
              onClick={handleInputChange}
            />
          </label> */}



          <button type="submit">Update</button>
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
