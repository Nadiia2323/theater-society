import { useContext } from "react";
import { AuthContext } from "../context/AuhContext";


export default function TheaterProfile() {
    console.log("theater profile");
    const { theater } = useContext(AuthContext)
    console.log('theater :>> ', theater);
    // const profilePhotoUrl = theater.profilePhoto || "https://asset.cloudinary.com/dqgvmwnpl/41951ab3c05afd2f89c7a431fc592465";

    return (<div>
        {theater && (
            <>
                <img src={theater.profilePhoto || "https://asset.cloudinary.com/dqgvmwnpl/41951ab3c05afd2f89c7a431fc592465"} alt="" />
             <h1>{theater.theaterName}</h1>
                <p>{theater.about}</p>
            </>
        )}
  </div>)
}
