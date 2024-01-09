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
    quote: "",
    about: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [background, setBackground] = useState<File | string>("");
  // const [userPhoto, setUserPhoto] = useState<UserImageType | null>(null);
  const { user, theater } = useContext(AuthContext);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));

    const file = e.target.files?.[0];
    if (name === "profilePhoto") {
      setSelectedFile(file);
    } else if (name === "backgroundPhoto") {
      setBackground(file);
    }
  }


  const handleProfilePhotoUpload = async (type) => {
    console.log("type :>> ", type);

    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formdata = new FormData();
    let apiUrl;

    if (type === "user") {
      formdata.append("profilePhoto", selectedFile);
      apiUrl = "http://localhost:5000/myApi/users/profilePhoto";
    } else if (type === "theater") {
      formdata.append("photo", selectedFile);
      apiUrl = "http://localhost:5000/myApi/theaters/photo";
    } else {
      console.log("Invalid type");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const result = await response.json();
      console.log("result :>> ", result);
    } catch (error) {
      console.log("error :>> ", error);
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
      updatedData.quote = userData.quote;
    }
    if (userData.about) {
      updatedData.about = userData.about;
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
        if (updatedData.about) {
          urlencoded.append("about", updatedData.about);
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
        alert(result.message);
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
      {user && (
        <div className="form-container">
          <h2>Update Profile</h2>
          <div className="profilePhto-holder">
            <div>
              <img
                className="profilePhoto"
                src={user.profilePhoto || selectedFile}
                alt=""
              />{" "}
              Profile Photo
            </div>
            <div className="upload-button">
              <input type="file" onChange={handleInputChange} />
              <button onClick={() => handleProfilePhotoUpload("user")}>
                Upload Photo
              </button>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                placeholder={user.userName}
                value={userData.name}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Email:{" "}
              <input
                type="email"
                name="email"
                placeholder={user.email}
                value={userData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              {" "}
              Quote:{" "}
              <input
                type="text"
                name="quote"
                placeholder={user.quote}
                value={userData.quote}
                onChange={handleInputChange}
              />
            </label>
            <label>
              {" "}
              About:{" "}
              <input
                type="text"
                name="about"
                placeholder={user.about}
                value={userData.about}
                onChange={handleInputChange}
              />
            </label>
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
      )}

      {theater && (
        <div className="form-container">
          <h2>Update Profile</h2>
          <div className="profilePhto-holder">
            <div>
              <img
                className="profilePhoto"
                src={theater.profilePhoto || selectedFile}
                alt=""
              />{" "}
              Profile Photo
            </div>
            <div className="upload-button">
              <input
                type="file"
                onChange={handleInputChange}
                name="profilePhoto"
              />
              <button onClick={() => handleProfilePhotoUpload("theater")}>
                Upload Photo
              </button>
            </div>
            <div>
              <img
                className="profilePhoto"
                src={theater.backgroundPhoto || background}
                alt=""
              />{" "}
              Profile Photo
            </div>
            <div className="upload-button">
              <input
                type="file"
                onChange={handleInputChange}
                name="background"
              />
              <button>Upload Photo</button>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                placeholder={theater.theaterName}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Email:{" "}
              <input
                type="email"
                name="email"
                placeholder={theater.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Country:{" "}
              <input type="text" name="country" placeholder={theater.country} />
            </label>
            <label>
              {" "}
              City: <input type="text" name="city" placeholder={theater.city} />
            </label>
            <label>
              Director:{" "}
              <input
                type="text"
                name="director"
                placeholder={theater.director}
              />
            </label>
            <label>
              {" "}
              Quote:{" "}
              <input
                type="text"
                name="quote"
                placeholder={theater.quote}
                onChange={handleInputChange}
              />
            </label>
            <label>
              {" "}
              About:{" "}
              <input
                type="text"
                name="about"
                placeholder={theater.about}
                onChange={handleInputChange}
              />
            </label>

            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateProfile;
