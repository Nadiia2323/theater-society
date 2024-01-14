import { useContext, useState } from "react";
import { AuthContext } from "../context/AuhContext";
import "./TheaterProfile.css"
import Posts from "../Components/Posts";
import News from "../Components/News";
import Favorites from "../Components/Favorites";
import Cast from "../Components/Cast";
import { Post } from "../Components/PostModal";

export interface Theater {
  about: string;
  actors: string[];
  backgroundPhoto: string;
  city: string;
  country: string;
  director: string;
  email: string;
  favorites: string[];
  followers: string[];
  following: string[];
  id: string;
  posts: Post[]; 
  profilePhoto: string;
  quote: string;
  repertoire: string[]; 
  theaterName: string;
}





export default function TheaterProfile() {
    console.log("theater profile");
  const [showPosts, setShowPosts] = useState(true);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const [favorites, setFavorites] = useState(false);
  const [cast, setCast]= useState(false)

  const [plusClicked, setPlusClicked] = useState(false);
    const { theater } = useContext(AuthContext)
    console.log('theater :>> ', theater);
     const handlePostsClick = () => {
    setShowPosts(true);
    setShowPlusIcon(true);
    setPlusClicked(false);
       setFavorites(false)
       setCast(false)
    };
      const handlePlusIconClick = () => {
    setPlusClicked(true);
    };
     const handleNewsClick = () => {
    setShowPosts(false);
    setShowPlusIcon(false);
    setPlusClicked(false);
       setFavorites(false)
       setCast(false)
    };
     const handelClickFavorites = () => {
    setFavorites(true);
    setShowPosts(false);
    setShowPlusIcon(false);
       setPlusClicked(false);
       setCast(false)
  };
  const handelClickCast = () => {
    setCast(true)
    setFavorites(false)
    setShowPosts(false);
    setShowPlusIcon(false);
    setPlusClicked(false);
  }
    

    return (<div className="profileContainer">
        {theater && (
            <>
                <div className="backgroundPhoto-container">
                    <img className="backgroundPhoto" src={theater.backgroundPhoto || "https://asset.cloudinary.com/dqgvmwnpl/6efd73b8eaf42f2d25a79c25497150b1"} alt="" />
                
                
                    <img className="profileImage" src={theater.profilePhoto || "https://asset.cloudinary.com/dqgvmwnpl/41951ab3c05afd2f89c7a431fc592465"} alt="" />
                </div>
                <div className="theaterName">
            <h1 className="glowing-txt">{theater.theaterName}</h1></div>
          <div className="info-theater-container">
            <div className="director">
              <p> {theater.country } / {theater.city }</p>
              <p>
                {theater.director}<br/>
                DIRECTOR
              </p>
            </div>
                
               
            <div className="info-box">
              <div className="followers-box">
                <p>{theater.followers.length } <br/>followers</p>
              <p>{theater.following.length} <br/>following</p>
                </div>
                
              <p>{theater.about }</p>
            </div>
          </div>
           <blockquote className="styled-quote">
              <p>{theater.quote}</p>
              <cite>– {theater.theaterName }</cite>
          </blockquote>
          
                
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
            <p className="posts">perfomance</p>
            <p className="posts" onClick={handelClickCast}>cast</p>
            
                </div>
            {showPosts && !favorites && !cast && <Posts plusClicked={plusClicked} />}
        {!showPosts && !favorites && !cast && <News />}
        {favorites && <Favorites />}
          {cast && <Cast />}
          

            </>
        )}
  </div>)
}
