import { useContext } from "react";
import { AuthContext } from "../context/AuhContext";
import "./TheaterProfile.css"


export default function TheaterProfile() {
    console.log("theater profile");
    const { theater } = useContext(AuthContext)
    console.log('theater :>> ', theater);
    

    return (<div className="profileContainer">
        {theater && (
            <>
                <div className="backgroundPhoto-container">
                    <img className="backgroundPhoto" src={theater.backgroundPhoto || "https://asset.cloudinary.com/dqgvmwnpl/6efd73b8eaf42f2d25a79c25497150b1"} alt="" />
                
                
                    <img className="profileImage" src={theater.profilePhoto || "https://asset.cloudinary.com/dqgvmwnpl/41951ab3c05afd2f89c7a431fc592465"} alt="" />
                </div>
                <div className="theaterName">
             <h1 className="glowing-txt">{theater.theaterName}</h1></div>
                <p>county</p>
                <p>city</p>
                <p>director</p>
                <p>quote</p>
                <p>about</p>
                <p>followers</p>
                <p>following</p>
                <button>follow</button>
                <button>send message</button>

            </>
        )}
  </div>)
}
