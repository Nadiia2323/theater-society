import { ChangeEvent, useState, useContext } from "react";
import NavBar from "../Components/NavBar";
import "./Profile.css";
import Posts from "../Components/Posts";
// import News from "../Components/News";
import { AuthContext } from "../context/AuhContext";
import News from "../Components/News";
import Menu from "../Components/Menu";
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
  const { user } = useContext(AuthContext)
  const [showPosts, setShowPosts] = useState(true);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [userPhoto, setUserPhoto] = useState<UserImageType | null>(null);
  const [plusClicked, setPlusClicked] = useState(false);
  
  // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   console.log("e.target :>> ", e);
  //   const file = e.target.files?.[0] || "";

  //   setSelectedFile(file);
  //   console.log("selectedFile :>> ", selectedFile);
  // };

  // const uploadPhoto = async () => {
  //   const formdata = new FormData();
  //   formdata.append("profilePhoto", selectedFile);
  //   // formdata.append("_id", userId);
  //   console.log("selectedFile :>> ", selectedFile);

  //   const requestOptions = {
  //     method: "POST",
  //     body: formdata,
  //   };
  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/myApi/users/profilePhoto",
  //       requestOptions
  //     );
  //     const result = (await response.json()) as ServerOkResponse;
      

  //     console.log("result :>> ", result);

  //     setUserPhoto({ profilePhoto: result.profilePhoto });
  //   } catch (error) {
  //     console.log("error :>> ", error);
  //   }
  // };
  const handlePlusIconClick = () => {
  
  setPlusClicked(true)
 
};

const handlePostsClick = () => {
  setShowPosts(true); 
  setShowPlusIcon(true)
  setPlusClicked(false)
};

const handleNewsClick = () => {
  setShowPosts(false); 
  setShowPlusIcon(false)
  setPlusClicked(false)
};
 
 

  return (
    <>
      <NavBar />
      <Menu/>
      <div className="profile-section">
        <div className="profile-container">
          <div className="BIO-container">
           
            {user && (
              <>
                <img
                  className="photo"
                  src={ user.profilePhoto? user.profilePhoto:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt="your photo"
                />
                <p>BIO</p>
               
              </>
            )}
          </div>
          <div className="followers-container">
            <p>followers:</p>
            <p>following:</p>
          </div>
        </div>
        <div className="news-container">
          <div className="addPost">
            <p className="posts" onClick={handlePostsClick}>posts</p>
            {showPosts && (<span className="plus-icon" onClick={handlePlusIconClick}>+</span>)}
            
            </div>
          <p className="news" onClick={handleNewsClick}>news</p>
          <p>likes</p>
        </div>
       {showPosts ? <Posts plusClicked={plusClicked}/> : <News/>}
      </div>
    </>
  );
}
