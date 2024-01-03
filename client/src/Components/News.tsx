import { useState, useEffect, useContext } from "react";
import "./News.css"
import { formatDate } from "../utils/formatDate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { getToken } from "../utils/login";
import { AuthContext } from "../context/AuhContext";
import PostModal from "./PostModal";

interface TheaterUser {
  city?: string;
  country?: string;
  email?: string;
  followers?: number;
  following?: number;
  password?: string;
  profilePhoto?: string;
  theaterName: string;
  _id: string;
}

interface TheaterUsers {
  number: number;
  theaterUsers: TheaterUser[];
}

export default function News() {
 
  //   const [allTheaters, setAllTheaters] = useState <TheaterUsers | null>(null);
  

  // const getAllTheaters = async () => {
  //   const requestOptions = {
  //     method: "GET",
     
  //   };
  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/myApi/theaters/all",
  //       requestOptions
  //     );
  //     const result = await response.json() as TheaterUsers
  //     console.log("result :>> ", result);
      
  //       setAllTheaters(result)
        
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //   };
   
  //   useEffect(() => {
  //  getAllTheaters()
  //   }, [])
    const {user} = useContext(AuthContext)
  const [allPosts, setAllPosts] = useState([])
  const [Likes, setLikes] = useState({});
  const [selectedPost,setSelectedPost] = useState(null)
  
  const getAllPosts = async () => {
  try {
    const requestOptions = {
  method: 'GET',
  
    };
    const response = await fetch("http://localhost:5000/myApi/users/allPosts", requestOptions)
    const result = await response.json()
    setAllPosts(result)
  } catch (error) {
    console.log('error :>> ', error);
  }
  
  
  }

  const handleLike = async (postId) => {
  
  const token= getToken()
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
  
   const isLikedByCurrentUser = (post) => {
     console.log('post :>> ', post);
     console.log('user.id :>> ', user?.id);
    
    return post.likes.includes(user?.id);
  };
    const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    console.log("selectedPost :>> ", selectedPost);
  };
  const handleCloseModal = () => {
    setSelectedPost(null);
  };
 
  console.log('allPosts :>> ', allPosts);
  useEffect(() => {
   getAllPosts()
  }, [])
  

  return (
    <>
      <div className="post-container" >
                {allPosts &&
                    allPosts.users &&
                    allPosts.users.length > 0 &&
                    allPosts.users.map((post: Post, index: number) => (
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
                                <img className="image" src={post.imageUrl} alt="" onClick={() => handlePostClick(post)} />
                                <p className="date">{formatDate(post.updatedAt)}</p>
                                <div className="caption-overlay">
                                    <h3 className="caption">{post.caption}</h3>
                                </div>
                                <div className="post-settings"></div>
                            </div>
                        </div>
                    ))}</div>
      {selectedPost && (
        <div className="modal-container">
          <div className="modal-close-button" onClick={handleCloseModal}>
            X
          </div>
          <PostModal post={selectedPost} />
        </div>
      )}
    <div>
      
      {/* <p>Number of Theaters: {allTheaters.number}</p>
      <div className="theaters-container" >
        {allTheaters && allTheaters.theaterUsers.map((theater, index) => (
          <div key={index} className="theaterCard">
            <h3>Theater: {theater.theaterName}</h3>
            <p>City: {theater.city}</p>
            <p>Country: {theater.country}</p>
            
          
              <div>
                <p>User Email: {theater.email}</p>
                <p>Followers: {theater.followers}</p>
                
              </div>
            
          </div>
        ))}
      </div> */}
      </div>
      </>
  );
}