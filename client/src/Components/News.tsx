import { useState, useEffect, useContext } from "react";
import "./News.css"
import { formatDate } from "../utils/formatDate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { getToken } from "../utils/login";
import { AuthContext } from "../context/AuhContext";
import PostModal, { Post } from "./PostModal";

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
 

    const {user} = useContext(AuthContext)
  const [allPosts, setAllPosts] = useState <Post[]>([])
  const [Likes, setLikes] = useState({});
  const [selectedPost,setSelectedPost] = useState(null)
  
  const getAllPosts = async () => {
  try {
    const requestOptions = {
  method: 'GET',
  
    };
    const response = await fetch("http://localhost:5000/myApi/users/allPosts", requestOptions)
    const result = await response.json()
    console.log('result inside :>> ', result);
    setAllPosts(result.users)
  } catch (error) {
    console.log('error :>> ', error);
  }
  
  
  }

  const handleLike = async (postId: string) => {
  const token = getToken();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("postId", postId);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const response = await fetch("http://localhost:5000/myApi/users/likes", requestOptions);
    const result = await response.json();
    
    if (response.ok) {
      setAllPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          const hasLiked = post.likes.some(like => like.user === user?.id);
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter(like => like.user !== user?.id)
              : [...post.likes, { user: user?.id }],
          };
        }
        return post;
      }));
    }
  } catch (error) {
    console.log('error :>> ', error);
  }
};

   const isLikedByCurrentUser = (post: Post) => {
     console.log('post :>> ', post);
     console.log('user.id :>> ', user?.id);
    
     return post.likes.some(like => like.user === user?.id);
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
         {selectedPost && (
        <div className="modal-container">
        
          <PostModal post={selectedPost} onClose={handleCloseModal} />
        </div>
      )}
                {allPosts &&
                    allPosts &&
                    allPosts.length > 0 &&
                    allPosts.map((post: Post, index: number) => (
                        <div
                            key={post._id}
                        className="post"
                        
                        >
                            <div className="image-container" >
         
                                <div className="likes" onClick={() => {
  
                                    handleLike(post._id);
                                }}>
                                    <FontAwesomeIcon icon={isLikedByCurrentUser(post) ? fasHeart : farHeart}  />
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
     
      </>
  );
}