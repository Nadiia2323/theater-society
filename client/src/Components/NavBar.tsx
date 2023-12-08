import logonav from "../theater/nav-logo.jpg"

import "../Components/NavBar.css"
import { useNavigate } from "react-router-dom"



export default function NavBar() {
  
//   const  navigate = useNavigate();


// const logout = () => {
//   localStorage.removeItem('token')
//   navigate('/')
//   console.log("logged out");
// }

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        
        <img className="logo-img" src={logonav} alt="" />
          <p className="logo-name">StageConnect</p>
          
      </div>
      

      
      <div className="navbar-signin-up">
     
         
          
        {/* <button onClick={logout} className="logout-button">logout</button> */}
      </div>
      
      </div>
      )
      
}
