import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuhContext";
import { getToken } from "../utils/login";
import "./News.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from "../utils/formatDate";

export default function Favorites() {
    const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([])
  const [Likes, setLikes] = useState({});

  const getFavorites = async () => {
    try {
      const token = getToken();
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      const response = await fetch(
        "http://localhost:5000/myApi/users/favorites",
        requestOptions
      );
      const result = await response.json();
        
        setFavorites(result.favorites) 
        
    } catch (error) {
      console.log("error :>> ", error);
    }
    };
    console.log('favorites :>> ', favorites);
    const isLikedByCurrentUser = (post) => {
     console.log('post :>> ', post);
     console.log('user.id :>> ', user?.id);
    
    return post.likes.includes(user?.id);
  };
  const handleLike = async (postId) => {
  
    const token = getToken()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`)

    const urlencoded = new URLSearchParams();
    urlencoded.append("postId", postId);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
  
    };
    try {
      const response = await fetch("http://localhost:5000/myApi/users/likes", requestOptions);
      const result = await response.json()
      console.log('result :>> ', result);
      if (response.ok) {
    
        const updatedLikes = result.updatedLikes;
        setLikes(prevLikes => ({
          ...prevLikes,
          [postId]: updatedLikes
        }));
      }

    } catch (error) {
      console.log('error :>> ', error);
    }
  }
    
    useEffect(() => {
     getFavorites()
    }, [])
    

    return (
     <div className="post-container" >
                {favorites &&
                    favorites.length > 0 &&
                   favorites.map((post: Post, index: number) => (
                        <div
                            key={post._id}
                            className="post"
                        >
                            <div className="image-container" >
         
                                <div className="likes" onClick={() => {
  
                                    handleLike(post._id);
                                }}>
                                    <FontAwesomeIcon icon={isLikedByCurrentUser(post) ? fasHeart : farHeart} />
                                    <p>{post.likes?.length}</p>
                                </div>
                            </div>
                            <div>
                                <img className="image" src={post.imageUrl} alt=""  />
                                <p className="date">{formatDate(post.updatedAt)}</p>
                                <div className="caption-overlay">
                                    <h3 className="caption">{post.caption}</h3>
                                </div>
                                <div className="post-settings"></div>
                            </div>
                        </div>
                    ))}</div>
    
  );
}
