import { useContext, useState } from "react";
import { AuthContext } from "../context/AuhContext";
import "./TheaterProfile.css"
import Posts from "../Components/Posts";
import News from "../Components/News";
import Favorites from "../Components/Favorites";


export default function TheaterProfile() {
    console.log("theater profile");
  const [showPosts, setShowPosts] = useState(true);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [favorites, setFavorites] = useState(false);

  const [plusClicked, setPlusClicked] = useState(false);
    const { theater } = useContext(AuthContext)
    console.log('theater :>> ', theater);
     const handlePostsClick = () => {
    setShowPosts(true);
    setShowPlusIcon(true);
    setPlusClicked(false);
    setFavorites(false)
    };
      const handlePlusIconClick = () => {
    setPlusClicked(true);
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
    

    return (<div className="profileContainer">
        {theater && (
            <>
                <div className="backgroundPhoto-container">
                    <img className="backgroundPhoto" src={theater.backgroundPhoto || "https://asset.cloudinary.com/dqgvmwnpl/6efd73b8eaf42f2d25a79c25497150b1"} alt="" />
                
                
                    <img className="profileImage" src={theater.profilePhoto || "https://asset.cloudinary.com/dqgvmwnpl/41951ab3c05afd2f89c7a431fc592465"} alt="" />
                </div>
                <div className="theaterName">
             <h1 className="glowing-txt">{theater.theaterName}</h1></div>
                <p>county: {theater.country }</p>
                <p>city: {theater.city }</p>
                <p>director:{theater.director }</p>
                <p>"{theater.quote}"</p>
                <p>{theater.about }</p>
                <p>followers:{theater.followers.length }</p>
                <p>following:{ theater.following.length}</p>
                <button>follow</button>
                <button>send message</button>
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
            <p className="news" onClick={handleNewsClick}>
              news
            </p>
            <p onClick={handelClickFavorites}>favorites </p>
            
                </div>
                {showPosts && !favorites && <Posts plusClicked={plusClicked} />}
          {!showPosts && !favorites && <News />}
          {favorites && <Favorites />}

            </>
        )}
  </div>)
}
