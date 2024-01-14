import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Menu from "../Components/Menu";
import { getToken } from "../utils/login";
import { formatDate } from "../utils/formatDate";
import PostModal, { Post } from "../Components/PostModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuhContext";
import { User } from "./Profile";
import { Theater } from "./TheaterProfile";
import Cast from "../Components/Cast";

export default function UserPage() {
   const [showPosts, setShowPosts] = useState(true);
  
  const [cast, setCast]= useState(false)
  const [usersPage, setUsersPage] = useState<User>();
  const [theaterPage,setTheaterPage] = useState<Theater>()
  const [likes, setLikes] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUserInCast, setIsUserInCast] = useState(false);

  const { userId } = useParams();
  const { user, theater } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log('user in page :>> ', user);

  // const getUser = async () => {
  //   try {
  //     const requestOptions = { method: "GET" };
  //     const response = await fetch(
  //       `http://localhost:5000/myApi/users/${userId}`,
  //       requestOptions
  //     );
  //     const result = await response.json();
  //     if (result.theaterName) {
  //       setTheaterPage(result)
  //     } 
  //     if (result.name) {
  //       setUsersPage(result)
  //     }
     
      
  //     const currentUserId = user?.id ||theater?.id 
     
  //       console.log('currentUserId :>> ', currentUserId);
  //     const isCurrentUserFollowing = result.followers.includes(currentUserId);
  //     console.log('isCurrentUserFollowing :>> ', isCurrentUserFollowing);
      
  //     setIsFollowing(isCurrentUserFollowing);
  //     const userInTroupe = theater?.actors.includes(userId);
  //     if (userInTroupe) {
  //       setIsUserInCast(userInTroupe);
  //     }
    
  //     //  const isCurrentUserInCast = currentUserId === userId
  //     // setIsUserInCast(isCurrentUserInCast)
  //     // console.log('isCurrentUserInCast :>> ', isCurrentUserInCast);
  //   } catch (error) {
  //     console.error("Error :>> ", error);
  //   }
  // };
  const getUser = async () => {
  try {
    const requestOptions = { method: "GET" };
    const response = await fetch(`http://localhost:5000/myApi/users/${userId}`, requestOptions);
    const result = await response.json();

    const currentUserId = user?.id || theater?.id;

    // Check if the response is for a theater
    if (result.theaterName) {
      setTheaterPage(result);
      const userInTroupe = theater?.actors.includes(userId);
      setIsUserInCast(userInTroupe);
    } 
    // Check if the response is for a user
    else if (result.name) {
      setUsersPage(result);
      const isCurrentUserFollowing = result.followers.includes(currentUserId);
      setIsFollowing(isCurrentUserFollowing);
    }

  } catch (error) {
    console.error("Error :>> ", error);
  }
};

 
const isLikedByCurrentUser = (post: Post) => {
  const currentUser = user || theater
  return post?.likes.includes(currentUser?.id);
};


  const handleLike = async (postId:string) => {
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("postId", postId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/myApi/users/likes",
        requestOptions
      );
      const result = await response.json();
      console.log("result :>> ", result);
      if (response.ok) {
        const updatedLikes = result.updatedLikes;
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: updatedLikes,
        }));
      }
       setUsersPage(prevState => {
        const newPosts = prevState.posts.map(post => {
          if (post._id === postId) {
            const hasLiked = post.likes.includes(user?.id);
            return {
              ...post,
              likes: hasLiked
                ? post.likes.filter(id => id !== user?.id)
                : [...post.likes, user?.id],
            };
          }
          return post;
        });
        return { ...prevState, posts: newPosts };
      });
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    console.log("selectedPost :>> ", selectedPost);
  };
  const handleCloseModal = () => {
    setSelectedPost(null);
  };
 
   
  const followOrUnfollow = async () => {
    try {
      const token = getToken();
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const urlencoded = new URLSearchParams();
      urlencoded.append("targetUserId", userId);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };
      const response = await fetch(
        "http://localhost:5000/myApi/users/following",
        requestOptions
      );
      const result = await response.json();
        console.log("result :>> ", result);
        setIsFollowing((prevIsFollowing) => !prevIsFollowing); 
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const addActorsToCast = async () => {
    const token = getToken()
    try {
      
      const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", `Bearer ${token}`)

const urlencoded = new URLSearchParams();
urlencoded.append("userId", userId);

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  
};
      const response = await fetch("http://localhost:5000/myApi/theaters/actors", requestOptions)
      const result = await response.json()
    console.log('result :>> ', result);

  
    } catch (error) {
      console.log('error :>> ', error);
    }
  } 
   const handelClickCast = () => {
    setCast(true)
   
    setShowPosts(false);
    
  }
  const handlePost = () => {
     setCast(false)
   
    setShowPosts(true);
  }
  //  const handleActorClick = (actor) => () => {
  //   console.log('actor :>> ', actor);
  //   navigate(`/user/${actor._id}`);
  // };
  console.log('isUserInCast :>> ', isUserInCast);
  console.log('isFollowing :>> ', isFollowing);
  console.log('theaterPage :>> ', theaterPage);
  console.log('userPage :>> ', usersPage);
  
  useEffect(() => {
    getUser();
   
  }, []);
  

  return (
    <>
     
      <Menu />
      
      {usersPage && (<> <NavBar />
        <div className="profile-section">
          <div className="profile-container">
            <div className="photo-container">
              <img
                className="photo"
                src={
                  usersPage.profilePhoto ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
              />
              <h3 className="name">{usersPage.name}</h3>
            </div>
            <div className="bio-container">
              <div className="followers-container">
                <p>{usersPage.followers.length}
                <br/>followers</p>
                <p>{usersPage.following.length}<br/>following</p>
              </div>
              <p className="quote">"{usersPage.quote}"</p>
              <p className="about">{usersPage.about}</p>
            </div>
          </div>
          <div className="buttons">
          <button onClick={followOrUnfollow}>
  {isFollowing ? 'Unfollow' : 'Follow'}
</button>
            
            {theater && (<button onClick={addActorsToCast}> {isUserInCast ? 'Remove from Cast' : 'Add to Cast'}</button>)}
            
          </div>
        </div></>
      )}
        {selectedPost && usersPage && (
        <div className="modal-container">
          
          <PostModal post={selectedPost} onClose={handleCloseModal} />
        </div>
      )}
      {
  usersPage && (
    <div className="post-container">
      {usersPage.posts && usersPage.posts.length > 0 ? (
        usersPage.posts.map((post: Post, index: number) => (
          <div key={post._id} className="post">
            <div className="image-container">
              <div
                className="likes"
                onClick={() => {
                  handleLike(post._id);
                }}
              >
                <FontAwesomeIcon
                  icon={isLikedByCurrentUser(post) ? fasHeart : farHeart}
                />
                <p>{post.likes?.length}</p>
              </div>
            </div>
            <div>
              <img
                className="image"
                src={post.imageUrl}
                alt=""
                onClick={() => handlePostClick(post)}
              />
              <p className="date">{formatDate(post.updatedAt)}</p>
              <div className="caption-overlay">
                <h3 className="caption">{post.caption}</h3>
              </div>
              <div className="post-settings"></div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts found</p>
      )}
    </div>
  )
}

      {theaterPage && ( <> <div className="backgroundPhoto-container">
                    <img className="backgroundPhoto" src={theaterPage.backgroundPhoto || "https://asset.cloudinary.com/dqgvmwnpl/6efd73b8eaf42f2d25a79c25497150b1"} alt="" />
                
                
                    <img className="profileImage" src={theaterPage.profilePhoto || "https://asset.cloudinary.com/dqgvmwnpl/41951ab3c05afd2f89c7a431fc592465"} alt="" />
                </div>
                <div className="theaterName">
            <h1 className="glowing-txt">{theaterPage.theaterName}</h1></div>
          <div className="info-theater-container">
            <div className="director">
              <p> {theaterPage.country } / {theaterPage.city }</p>
              <p>
                {theaterPage.director}<br/>
                DIRECTOR
              </p>
            </div>
                
               
            <div className="info-box">
              <div className="followers-box">
                <p>{theaterPage.followers.length } <br/>followers</p>
              <p>{theaterPage.following.length} <br/>following</p>
                </div>
                
              <p>{theaterPage.about }</p>
            </div>
          </div>
           <blockquote className="styled-quote">
              <p>{theaterPage.quote}</p>
              <cite>– {theaterPage.theaterName }</cite>
        </blockquote>
        <div className="buttons">
          <button onClick={followOrUnfollow}>
  {isFollowing ? 'Unfollow' : 'Follow'}
</button></div>
        <div className="news-container">
            <div className="addPost">
              <p className="posts" onClick={handlePost} >
                posts
              </p>
             
            </div>
            
            
            <p className="posts">perfomance</p>
          <p className="posts"onClick={handelClickCast} >cast</p>
          </div>
      </>)}
        {selectedPost && theaterPage && (
        <div className="modal-container">
         
          <PostModal post={selectedPost} onClose={handleCloseModal} />
        </div>
      )}
        {showPosts && (<div className="post-container">
        {theaterPage &&
          theaterPage.posts &&
          theaterPage.posts.length > 0 &&
          theaterPage.posts.map((post: Post, index: number) => (
            <div key={post._id} className="post">
              <div className="image-container">
                <div
                  className="likes"
                  onClick={() => {
                    handleLike(post._id);
                  }}
                >
                  <FontAwesomeIcon
                    icon={isLikedByCurrentUser(post) ? fasHeart : farHeart}
                  />
                  <p>{post.likes?.length}</p>
                </div>
              </div>
              <div>
                <img
                  className="image"
                  src={post.imageUrl}
                  alt=""
                  onClick={() => handlePostClick(post)}
                />
                <p className="date">{formatDate(post.updatedAt)}</p>
                <div className="caption-overlay">
                  <h3 className="caption">{post.caption}</h3>
                </div>
                <div className="post-settings"></div>
              </div>
            </div>
          ))}
      </div>)} 
    {cast && (<div className="cast-container">
      {theaterPage?.actors.map(actor => (
        <div key={actor._id} className="actor" >
          <img src={actor.profilePhoto} alt={actor.name} />
          <h3>{actor.name}</h3>
        </div>
      ))}
    </div>)}
    </>
  );
}
