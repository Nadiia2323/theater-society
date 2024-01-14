import { useState, useContext, useEffect } from "react";
import NavBar from "../Components/NavBar";
import "./Profile.css";
import Posts from "../Components/Posts";

import { AuthContext, AuthContextProps } from "../context/AuhContext";
import News from "../Components/News";
import Menu from "../Components/Menu";
import Favorites from "../Components/Favorites";
import TheaterProfile from "./TheaterProfile";
// interface ServerOkResponse extends UserImageType {
//   message: string;
// }
interface UserImageType {
  profilePhoto: string;
}
export interface User {
  about?: string;
  email: string;
  favorites?: [];
  id: string;
  posts?: [];
  profilePhoto?: string;
  quote?: string;
  name?: string;
  followers?: [];
  following?:[]
}

export default function Profile() {
  const { user, theater, isLoading, getProfile }: AuthContextProps = useContext(AuthContext);

  const [showPosts, setShowPosts] = useState(true);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [favorites, setFavorites] = useState(false);

  const [plusClicked, setPlusClicked] = useState(false);

  const handlePlusIconClick = () => {
    setPlusClicked(true);
  };

  const handlePostsClick = () => {
    setShowPosts(true);
    setShowPlusIcon(true);
    setPlusClicked(false);
    setFavorites(false)
  };

  const handleNewsClick = () => {
    setShowPosts(false);
    setShowPlusIcon(false);
    setPlusClicked(false);
    setFavorites(false)
  };
  const handelClickFavorites = () => {
    setFavorites(true);
    setShowPosts(false);
    setShowPlusIcon(false);
    setPlusClicked(false);
  };

  useEffect(() => {
    
  }, []);

  if (isLoading) {
    return <h1>loading</h1>
  }

  return (
    <div>
      <NavBar />
      <Menu />
      {user && (
        <div className="profile-section">
          <div className="profile-container">
            <div className="photo-container">
              <img
                className="photo"
                src={
                  user.profilePhoto
                    ? user.profilePhoto
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="your photo"
              />
              <h3 className="name">{user.userName}</h3>
            </div>
            <div className="bio-container">
              <div className="followers-container">
                <p  >{user.followers?.length}<br/>followers
                </p>
                <p>{user.following?.length}
                <br/>following</p>
              </div>
              <p className="quote">"{user.quote}"</p>
              <p className="about">{user.about}</p>
            </div>
          </div>

          <div className="news-container">
            <div className="addPost">
              <p className="posts" onClick={handlePostsClick}>
                posts
              </p>
              {showPosts && (
                <span className="plus-icon" onClick={handlePlusIconClick}>
                  +
                </span>
              )}
            </div>
            <p className="posts" onClick={handleNewsClick}>
              news
            </p>
            <p className="posts" onClick={handelClickFavorites}>favorites </p>
            
          </div>
          {showPosts && !favorites && <Posts plusClicked={plusClicked} />}
          {!showPosts && !favorites && <News />}
          {favorites && <Favorites />}
        </div>
      )}
      {theater && <TheaterProfile /> }
    </div>
  );
}
