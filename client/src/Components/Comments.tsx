import "./Comments.css"


export default function Comments(props) {
    const { comment, index } = props
    console.log('comment :>> ', comment);
  return (
      <div>
          <div className="comment">
              <p className="comment-text">{comment.text}</p>
              <span>🗑</span>
          </div>
          
      </div>
  )
}
