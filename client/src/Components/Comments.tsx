import "./Comments.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faComment } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from "../utils/formatDate";

export default function Comments(props) {
    const { comment, index } = props
    
  return (
      <div className="comments">
          <div className="comment">
              <p className="comment-text">{comment.text}</p>
              <p className="comment-date">{formatDate(comment.createdAt) }</p>
              <div className="comment-settinngs">
                 
                   <FontAwesomeIcon icon={faEdit} className="post-action-icon" />
         <FontAwesomeIcon icon={faTrash} className="post-action-icon" />
          </div>
          
              
          </div>
      </div>
  )
}
