import NavBar from "../Components/NavBar";
import "./Profile.css";
export default function Profile() {


  return (
    <>
      <NavBar />
      <div className="container">
        <div className="profile-container">
          <div className="BIO-container">
            <img className="photo" src="" alt="your photo" />
            <p>BIO</p>
            <button>edit profile</button>
          </div>
          <div className="followers-container">
            <p>followers:</p>
            <p>following:</p>
          </div>
        </div>
        <div className="news-container">
          <p>posts</p>
          <p>news</p>
          <p>likes</p>
        </div>
      </div>
    </>
  );
}


// export default function ProfileLayout({userType}) {

//     if (userType === "theater") <TheaterProfile />
    
//   return (
//     <>
//       <NavBar />
//       <div className="container">
//         <div className="profile-container">
//           <div className="BIO-container">
//             <img className="photo" src="" alt="your photo" />
//             <p>BIO</p>
//             <button>edit profile</button>
//           </div>
//           <div className="followers-container">
//             <p>followers:</p>
//             <p>following:</p>
//           </div>
//         </div>
//         <div className="news-container">
//           <p>posts</p>
//           <p>news</p>
//           <p>likes</p>
//         </div>
//       </div>
//     </>
//   );
// }