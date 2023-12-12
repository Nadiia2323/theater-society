import {  useState, useContext, useEffect } from "react";
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
// interface User {
//   userName?: string;
//   userEmail: string;
  
// }

export default function Profile() {
  const { user, getProfile } = useContext(AuthContext)
  const [showPosts, setShowPosts] = useState(true);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [userPhoto, setUserPhoto] = useState<UserImageType | null>(null);
  const [plusClicked, setPlusClicked] = useState(false);

 
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

useEffect(() => {
getProfile()
  }, [])
  
 
 

  return (
    <>
      <NavBar />
      <Menu />
      {user && ( <div className="profile-section">
        <div className="profile-container">
          <div className="BIO-container">
           
            {user && (
              <>
                <img
                  className="photo"
                  src={ user.profilePhoto?  user.profilePhoto:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt="your photo"
                />
                <p>BIO</p>
               
              </>
            )}
          </div>
          
          <div className="followers-container">
<p>"{user.quote }"</p>
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
      </div>)}
  
    </>
  );
}
