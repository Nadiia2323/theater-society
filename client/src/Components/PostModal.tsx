import { useState } from "react";
import Comments from "./Comments"
import { getToken } from "../utils/login";
import "./Posts.css"

import { useNavigate } from "react-router-dom";
import { User } from "../pages/Profile";


export interface Post {
  _id: string;
  caption: string;
  imageUrl: string;
 user: User; 
  likes: Array<{ user: string }> 
  comments: Comment[]; 
  createdAt: string; 
  updatedAt: string;
  __v: number; 
}

export interface Comment {
  
  _id: string;
  text: string;
  user: string; 
  createdAt: string;
  
}


interface PostModalProps {
  post: Post;
  onClose: (event: React.MouseEvent<HTMLDivElement>) => void;
}


export default function PostModal({ post, onClose }: PostModalProps) {
  console.log('post :>> ', post);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

    const navigate = useNavigate();
  

     const handleCommentOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    const comment = e.target.value;
    setNewComment(comment);
    
  };
  console.log('new :>> ', newComment);
 
  const postComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      if (response.ok) {
      
        setComments(prevComments => [...prevComments, result.comment]);
        setNewComment("");
    }
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
  {post.user && post.user.name && (
    <p className="post-author" onClick={() => handleAuthorClick(post.user._id)}>
      - {post.user.name}
    </p>
  )}
</div>
            
    </div>
                      <div className="comments">
                        {comments.map((comment, index) => (
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
              value={newComment}
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
