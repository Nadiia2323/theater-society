import { ChangeEvent,  useContext, useRef, useState } from "react";
import { getToken } from "../utils/login";
import { AuthContext, AuthContextProps } from "../context/AuhContext";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';


import "./Posts.css";

import PostModal, { Post } from "./PostModal";
import { formatDate } from "../utils/formatDate";
import Profile from "../pages/Profile";

interface PostsProps {
  plusClicked: boolean;
 
}


export default function Posts({ plusClicked }:PostsProps) {
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showDropDown, setShowDropDown] = useState<string | null>(null);
  
   const [likes, setLikes] = useState({});

 
  

  const { user, theater } = useContext(AuthContext);
 
 

  const handleLike = async (postId: string) => {
  
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
    setLikes(prevLikes => ({
      ...prevLikes,
      [postId]: {
        count: result.updatedLikes,
        likedByCurrentUser: !prevLikes[postId]?.likedByCurrentUser
      }
    }));
  }

  } catch (error) {
    console.log('error :>> ', error);
  }


  
}
  console.log('likes :>> ', likes);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "caption") {
      setCaption(e.target.value);
    } else if (e.target.name === "fileInput") {
      const file = e.target.files && e.target.files[0];
      setSelectedFile(file || "");
    }
  };
    const userType = theater ? 'theater' : 'user';

  const handleCreatePostClick = () => {
    createPost(userType);
  };

  const createPost = async (userType:"theater" | "user") => {
  setShowModal(false);
  const token = getToken();
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();
  formdata.append("caption", caption);
  formdata.append("posts", selectedFile);

  
  const url = userType === 'theater'
    ? "http://localhost:5000/myApi/theaters/posts"
    : "http://localhost:5000/myApi/users/posts";

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
  };

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.text();
    console.log(result);
    alert(result.message)
  } catch (error) {
    console.log("error", error);
  }
};

  const cancel = () => {
    setShowModal(false);
  };

  const deletePost = async (postId:string) => {
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("_id", postId);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/myApi/users/deletePost",
        requestOptions
      );
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handlePostDelete = (postId: string) => {
    console.log('postId :>> ', postId);
    deletePost(postId);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    console.log('selectedPost :>> ', selectedPost);
    
    
  };
//   const isLikedByCurrentUser = (post) => {
//   return likes[post._id]?.likedByCurrentUser;
// };

// const isLikedByCurrentUser = (post: Post) => {
//   const userId = user ? user.id : theater ? theater.id : null;

  
//   return post.likes.some(like => like.user === userId);
// };
// const isLikedByCurrentUser = (post) => {
//     if (user) {
//       return user.favorites.includes(post._id);
//     } else if (theater) {
//       return theater.favorites.includes(post._id);
//     }
//     return false
//   };
const isLikedByCurrentUser = (post) => {
  return likes[post._id]?.likedByCurrentUser;
};

 const handleCloseModal = () => {
   setSelectedPost(null)
  }
  


  useEffect(() => {
   
  
      if (plusClicked) {

        setShowModal(true);
      }
    
  }, [plusClicked]);


  return (
    <div >
      {showModal && (<div className="newPost-overlay">
        <div className="newPost">
          <div>
            <img
              className="selectedImg"
              src={
                selectedFile instanceof File
                  ? URL.createObjectURL(selectedFile)
                  : ""
              }
              alt="Selected"
            />
            <label>
              <input name="fileInput" type="file" onChange={handleOnChange} />
            </label>
            <label>
              <input
                name="caption"
                type="text"
                placeholder="caption"
                onChange={handleOnChange}
              />
            </label>
          </div>
          <button onClick={handleCreatePostClick}>Create new post</button>
          <button onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

   <div className="post-container" >
  {theater &&
    theater.posts &&
    theater.posts.length > 0 &&
    theater.posts.map((post: Post, index: number) => (
      <div
        key={post._id}
        className="post"
      >
        <div className="image-container" >
          <div className="dropdown" onClick={(e) => e.stopPropagation()}>
            <ul
              className="dropbtn icons btn-right showLeft"
              
            >
              <li></li>
              <li></li>
              <li></li>
            </ul>
            
              <div id={`myDropdown-${post._id}`} className="dropdown-content">
               
                <a href="#contact" onClick={() => handlePostDelete(post._id)}>Delete</a>

              </div>
            
          </div>
          <div className="likes" onClick={() => {
  
  handleLike(post._id);
}}>
            <FontAwesomeIcon icon={isLikedByCurrentUser(post) ? fasHeart : farHeart } />
            <p>{post.likes?.length}</p>
            
</div>
         </div>
          <div> 
          <img className="image" src={post.imageUrl} alt="" onClick={() => handlePostClick(post)} />
          <p className="date">{formatDate(post.updatedAt)}</p>
          <div className="caption-overlay">
            <h3 className="caption">{post.caption}</h3>
          </div>
         
        </div>
      </div>
    ))}
        {selectedPost && (
  <div className="modal-container">
    
    <PostModal post={selectedPost} onClose={handleCloseModal} />
  </div>
)}
          {user &&
    user.posts &&
    user.posts.length > 0 &&
          user.posts.map((post: Post, index: number) => (
      
      <div
        key={post._id}
        className="post"
      >
       
        <div className="image-container" >
          <div className="dropdown" onClick={(e) => e.stopPropagation()}>
            <ul
              className="dropbtn icons btn-right showLeft"
              
            >
              <li></li>
              <li></li>
              <li></li>
            </ul>
            
              <div id={`myDropdown-${post._id}`} className="dropdown-content">
                {/* <a href="#about">Edit</a> */}
                <a href="#contact" onClick={() => handlePostDelete(post._id)}>Delete</a>

              </div>
            
          </div>
          <div className="likes" onClick={() => {
  
  handleLike(post._id);
}}>
            <FontAwesomeIcon icon={isLikedByCurrentUser(post) ? fasHeart : farHeart} />
            <p>{post.likes?.length }</p>
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
    ))}
        

</div>

    </div>
  );
}
