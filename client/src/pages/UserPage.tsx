import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Menu from "../Components/Menu";
import { getToken } from "../utils/login";
import { formatDate } from "../utils/formatDate";
import PostModal from "../Components/PostModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuhContext";

export default function UserPage() {
  const [usersPage, setUsersPage] = useState(null);
  const [likes, setLikes] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
  const { userId } = useParams();
  const { user,theater } = useContext(AuthContext);

  const getUser = async () => {
    try {
      const requestOptions = { method: "GET" };
      const response = await fetch(
        `http://localhost:5000/myApi/users/${userId}`,
        requestOptions
      );
      const result = await response.json();
        setUsersPage(result);
        const currentUserId = user?.id; 
        console.log('currentUserId :>> ', currentUserId);
    const isCurrentUserFollowing = result.followers.includes(currentUserId);
    setIsFollowing(isCurrentUserFollowing);
    } catch (error) {
      console.error("Error :>> ", error);
    }
  };
  const isLikedByCurrentUser = (post) => {
    return post.likes.includes(user?.id);
  };

  const handleLike = async (postId) => {
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
  useEffect(() => {
    getUser();
  }, [userId]);
  console.log("usersPage :>> ", usersPage);
  console.log("selectedPost :>> ", selectedPost);

  return (
    <>
      <NavBar />
      <Menu />
      {usersPage && (
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
              <h3 className="name">{usersPage.userName}</h3>
            </div>
            <div className="bio-container">
              <div className="followers-container">
                <p>followers:{usersPage.followers.length}</p>
                <p>following{usersPage.following.length}:</p>
              </div>
              <p className="quote">"{usersPage.quote}"</p>
              <p className="about">{usersPage.about}</p>
            </div>
          </div>
          <div>
          <button onClick={followOrUnfollow}>
  {isFollowing ? 'Unfollow' : 'Follow'}
</button>
            <button>send message</button>
            {theater && (<button onClick={addActorsToCast}>Add to Cast</button>)}
          </div>
        </div>
      )}
      <div className="post-container">
        {usersPage &&
          usersPage.posts &&
          usersPage.posts.length > 0 &&
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
          ))}
      </div>
      {selectedPost && (
        <div className="modal-container">
          <div className="modal-close-button" onClick={handleCloseModal}>
            X
          </div>
          <PostModal post={selectedPost} />
        </div>
      )}
    </>
  );
}
