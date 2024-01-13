import { useState } from "react";
import Comments from "./Comments"
import { getToken } from "../utils/login";
import "./Posts.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faComment } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


export interface Post {
  caption?: string;
  comments?: string[];
  createdAt?: string;
  imageUrl: string;
  likes?: string[];
  updatedAt: string;
  _id: string;
}

interface PostModalProps {
  post: Post;
  
}


export default function PostModal({ post, onClose }: PostModalProps) {
  console.log('post :>> ', post);
  const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();
  
  
  
    


     const handleCommentOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    const comment = e.target.value;
    setNewComment(comment);
    
  };
  console.log('new :>> ', newComment);
 
  const postComment = async (e) => {
    e.preventDefault()
    const token = getToken();
    const postId = post?._id;
    console.log('postId :>> ', postId);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("text", newComment);
    urlencoded.append("postId", postId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/myApi/users/comments",
        requestOptions
      );
      const result = await response.json();
      console.log("comment result :>> ", result);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
const handleAuthorClick = () => {
   if (post.user && post.user._id) {
        navigate(`/user/${post.user._id}`); 
    }
}
 
    return (
      <div className="clichedPost-container" >
        <div className="modal-close-button" onClick={onClose} >X</div>
        
        <div className="clickedPost" >
          
          
          
                      <img
                        className="clickedPost-img"
                        src={post.imageUrl}
                        alt=""
                      />
         
          <div className="clickedPost-caption">
            <h3>{post.caption}</h3> 
           
            <div className="post-actions">
              {post.user.name && (
                <p className="post-author" onClick={handleAuthorClick}>-{post.user.name }</p>
              )}
               
      {/* <FontAwesomeIcon icon={faEdit} className="post-action-icon"  /> */}
              {/* <FontAwesomeIcon icon={faTrash} className="post-action-icon"        /> */}
            </div>
            
    </div>
                      <div className="comments">
                        {post.comments?.map((comment, index) => (
                          <Comments
                            post = {post}
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
                        <button type="submit" onClick={postComment}>
                          send
                        </button>
                      </form>
                    </div>
                  
            </div>
             
  )
}
