import NavBar from "../Components/NavBar";
import BGvideo from "../theater/bg-black.mp4";
import "../pages/Home.css";
import SignUp from "../Components/SignUp";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuhContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  console.log("user :>> ", user ? user.email : "no user in context");

  const [showSignUp, setShowSignUp] = useState(false);
  function handelJoinClick() {
    setShowSignUp(true);
  }

  return (
    <>
      <NavBar />
      <div>
        <div className="bg-container">
          <video src={BGvideo} autoPlay muted loop></video>
        </div>
        {!showSignUp ? (
          <div className="info-container">
            <p className="partText">StageConnect</p>
            <p className="description">
              {" "}
              is your online hub for all things theatre! Join a vibrant
              community of passionate theatre enthusiasts, actors, directors,
              and fans. Share your favorite plays, discuss the latest
              productions, discover audition opportunities, and connect with
              fellow theatre buffs from around the world. Dive into the dramatic
              world of storytelling, performance, and the magic of the stage
              with StageConnect!
            </p>
            <div className="joinButton">
              <button onClick={handelJoinClick} className="glowing-btn">
                <span className="glowing-txt">
                  Join <span className="faulty-letter">the </span>Theatre
                  Society
                </span>
              </button>
            </div>
          </div>
        ) : (
          <SignUp />
        )}
      </div>
    </>
  );
}
