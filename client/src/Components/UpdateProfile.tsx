import { ChangeEvent, useState } from 'react';
import { AuthContext } from '../context/AuhContext';
import { useContext } from 'react';
import "./UpdateProfile.css";
import { getToken } from '../utils/login';
import Menu from './Menu';


const UpdateProfile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    
  });
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  // const [userPhoto, setUserPhoto] = useState<UserImageType | null>(null);
    const { user } = useContext(AuthContext)
  console.log('user :>> ', user);
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

//   const uploadPhoto = async () => {
//     const formdata = new FormData();
//     formdata.append("profilePhoto", selectedFile);
//     // formdata.append("_id", userId);
//     console.log("selectedFile :>> ", selectedFile);

//     const requestOptions = {
//       method: "POST",
//       body: formdata,
//     };
//     try {
//       const response = await fetch(
//         "http://localhost:5000/myApi/users/profilePhoto",
//         requestOptions
//       );
//       const result = (await response.json()) as ServerOkResponse;
      

//       console.log("result :>> ", result);

//       // setUserPhoto({ profilePhoto: result.profilePhoto });
//     } catch (error) {
//       console.log("error :>> ", error);
//     }
  //   };
  const handleProfilePhotoUpload = async () => {
    try {
       const token = getToken()
    const myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${token}`);
      
      const formdata = new FormData();
      formdata.append("profilePhoto", selectedFile);

      const requestOptions = {
        method: "POST",
        body: formdata,
      };

      const response = await fetch(
        "http://localhost:5000/myApi/users/profilePhoto",
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Profile photo uploaded successfully', result);
        // Optionally, update the user's profile photo in the UI
      } else {
        console.error('Failed to upload profile photo');
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('Error during profile photo upload:', error);
      // Handle any unexpected errors here
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

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: urlencoded,
      };

      const response = await fetch("http://localhost:5000/myApi/users/profileSettings", requestOptions);
      const result = await response.json();
      console.log('updated successfully');
    } catch (error) {
      console.error('error:', error);
    }
  } else {
    alert('Please fill in at least one field to update.');
  }
};


  return (
    <>
    <Menu/>
    <div className='form-container'>
      <h2>Update Profile</h2>
      <input type="file" onChange={handleInputChange} />
                <button onClick={(() => handleProfilePhotoUpload() )}>
                  upload photo
                </button>
      <form className='form' onSubmit={handleSubmit}>
              <label>
                  <label >
                  <img src={user.profilePhoto} alt="" /> Profile Photo
          </label>
          
          Name:{user.userName}
          <input type="text" name="name" value={userData.name} onClick={handleInputChange} />
              </label>
              
        <label>
                  Email: {user.email }
          <input type="email" name="email" value={userData.email} onClick={handleInputChange}  />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={userData.password} onClick={handleInputChange} />
        </label>
       
        <button type="submit">Update</button>
      </form>
      </div>
      </>
  );
};

export default UpdateProfile;
