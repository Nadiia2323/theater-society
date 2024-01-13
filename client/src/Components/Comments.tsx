import "./Comments.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faComment } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../utils/formatDate";
import { getToken } from "../utils/login";
import { useContext } from "react";
import { AuthContext } from "../context/AuhContext";
import { useNavigate } from "react-router-dom";

export default function Comments(props) {
  const { comment, post } = props;
  const { user, theater } = useContext(AuthContext)
  console.log('user :>> ', user);
    console.log('comment :>> ', comment);
  console.log('post in comments :>> ', post);
  const navigate = useNavigate();

    const deleteComment = async () => {
        const postId = post._id
        const commentId = comment._id
  try {
    const token = getToken();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("postId", postId);
    urlencoded.append("commentId", commentId);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: urlencoded,
    };

    const response = await fetch(
      "http://localhost:5000/myApi/users/deleteComment",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('result :>> ', result);
  } catch (error) {
    console.error("Error :>> ", error);
  }
  };
  const handleAuthorCkick = (userId) => {
    if (comment.user ) {
        navigate(`/user/${comment.user}`); 
    }
  }


  return (
    <div className="comments">
      <div className="comment">
        <div className="comment-author" onClick={handleAuthorCkick}>{comment.userName}</div> 
        <p className="comment-text">{comment.text}</p>
        <p className="comment-date">{formatDate(comment.createdAt)}</p>
        <div className="comment-settinngs">
          {/* <FontAwesomeIcon icon={faEdit} className="post-action-icon" /> */}
          {/* <FontAwesomeIcon
            icon={faTrash}
            className="post-action-icon"
            onClick={deleteComment}
          /> */}
          {user?.id === comment.user && (
            <FontAwesomeIcon
              icon={faTrash}
              className="post-action-icon"
              onClick={deleteComment}
            />)}
        </div>
      </div>
    </div>
  );
}
