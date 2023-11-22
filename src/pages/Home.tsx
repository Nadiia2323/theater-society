import NavBar from "../Components/NavBar";
import BGvideo from "../theater/bg-black.mp4"
import "../pages/Home.css"
import SignUp from "../Components/SignUp";
import  { useState } from 'react';




export default function Home() {

  const [showSignUp, setShowSignUp] = useState<Boolean>(false)
  function handelJoinClick() {
     setShowSignUp(true)
   }



  return (
    <div>
      <NavBar />
      <div className="bg-container">
        <video src={BGvideo}autoPlay muted loop></video>
      </div>
      {!showSignUp ? ( <div className="info-container">
        <p className="description">StageConnect is your online hub for all things theatre! Join a vibrant community of passionate theatre enthusiasts, actors, directors, and fans. Share your favorite plays, discuss the latest productions, discover audition opportunities, and connect with fellow theatre buffs from around the world. Dive into the dramatic world of storytelling, performance, and the magic of the stage with StageConnect!</p>
     <button onClick={handelJoinClick} className="buttonJoin">Join the Theatre Society</button>
      </div>) : (
      <SignUp/>
      )}
      
     
    </div>
    
  )
}

