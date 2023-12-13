import { ChangeEvent, MouseEventHandler, useContext, useState } from "react";
import { getToken } from "../utils/login";
import { AuthContext } from "../context/AuhContext";
import { useEffect } from "react";

import "./Posts.css";
import Comments from "./Comments";
interface PostsProps {
  plusClicked: boolean;
}

export default function Posts({ plusClicked }) {
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [showModal, setShowModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const[newComment,setNewComment]=useState("")
  const { user } = useContext(AuthContext);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "caption") {
      setCaption(e.target.value);
    } else if (e.target.name === "fileInput") {
      const file = e.target.files && e.target.files[0];
      setSelectedFile(file || "");
    }
  };

  const createPost = async () => {
    setShowModal(false);
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("posts", selectedFile);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/myApi/users/posts",
        requestOptions
      );
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.log("error", error);
    }
  };
  const cancel = (e: MouseEventHandler<HTMLButtonElement>) => {
    setShowModal(false);
  };

  const deletePost = async (postId) => {
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

  const handlePostDelete = (postId) => {
    deletePost(postId);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    console.log("post :>> ", selectedPost);
  };

  const handleOpenPost = () => {
    setPostModal(true);
  };

  const handleCommentOnChange = (e) => {
    console.log('e.target.value :>> ', e.target.value);
    const comment = e.target.value
    setNewComment(comment)
    console.log('NewComment :>> ', newComment);
  }
console.log('selectedPost :>> ', selectedPost);
  const postComment = async () => {
    const token = getToken()
    const postId = selectedPost?._id
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("text", newComment);
    urlencoded.append("postId", postId);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
  
    };
    try {
      const response = await fetch("http://localhost:5000/myApi/users/comments", requestOptions)
      const result = await response.json()
      console.log('comment result :>> ', result);
    } catch (error) {
      console.log('error :>> ', error);
    }

    
      
  }

  useEffect(() => {
    if (plusClicked) {
      setShowModal(true);
    }
  }, [plusClicked]);

  return (
    <div>
      {showModal && (
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
          <button onClick={createPost}>Create new post</button>
          <button onClick={cancel}>Cancel</button>
        </div>
      )}

      <div className="post-container">
        {user &&
          user.posts &&
          user.posts.length > 0 &&
          user.posts.map((post, index: number) => (
            <div
              key={post._id}
              onClick={() => handlePostClick(post)}
              className="post"
            >
              <div className="image-container" onClick={handleOpenPost}>
                <div className="likes">&#x2661;</div>

                <img className="image" src={post.imageUrl} alt="" />
                <h3 className="caption">{post.caption}</h3>
                <div className="post-settings">
                  <span>🪶</span>
                  <span>🗫</span>
                  <span onClick={() => handlePostDelete(post._id)}>🗑</span>
                  {postModal && (
                    <div className="clickedPost">
                      <img
                        className="clickedPost-img"
                        src={post.imageUrl}
                        alt=""
                      />
                      <h3 className="clickedPost-caption">{post.caption}</h3>
                      <div className="comments">
                        {post.comments.map((comment, index) => (
                          <Comments
                            comment={comment}
                            index={index}
                            key={index}
                          />
                        ))}
                      </div>

                      <form id="commentForm">
                        <input
                          type="text"
                          id="commentText"
                          
                          placeholder="Comment..."
                          onChange={handleCommentOnChange}
                        />
                        <button type="submit" onClick={postComment}>send</button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              <p>{post.updatedAt}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
