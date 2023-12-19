import { useContext, useState } from "react"
import "./NavBar.css"
import { useNavigate } from "react-router-dom"
import { getToken } from "../utils/login";
import { AuthContext } from "../context/AuhContext";

export default function Menu() {
  const { user } = useContext(AuthContext);
  // console.log('user in menu :>> ', user);

  const [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false)
  const pathData = "M 300,-1.9235101 C 304.63084,565.59088 299.51618,538.96021 301.42857,1052.3622";
  const  navigate = useNavigate();


const logout = () => {
  localStorage.removeItem('token')
  navigate('/')
  console.log("logged out");
}

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }
   
  const openDeleteModal = () => {
    setDeleteModal(true)
  }
  const cancelDelete = () => {
    setDeleteModal(false)
  }
  const settingPage = () => {
    navigate('/profileSettings')
  }
  const profilePage = () => {
    navigate('/profile')
  }

  const deleteAccount = async () => {
    const token = getToken()
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", `Bearer ${token}`);

const urlencoded = new URLSearchParams();
urlencoded.append("email", user.email);
// urlencoded.append("password", user.password);

const requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  body: urlencoded,
  
    };
    try {
      const response = await fetch("http://localhost:5000/myApi/users/deleteAccount", requestOptions)
      const result = await response.json()
      alert(result)
      
    } catch (error) {
      console.log('error :>> ', error);
    }


 
  }
  const searchUser = () => {
    navigate('/allUsers')
  }

  return (
    <>
      <div>
            <nav className={isOpen ? 'nav nav--open' : 'nav'}>
      <button className="nav-toggle" onClick={handleToggle}><span>Menu</span></button>

      <ul className="nav-menu">
        <li className="li" onClick={profilePage}>Home</li>
          <li className="li">Favorites</li>
            <li className="li">Theaters</li>
            <li className="li" onClick={searchUser}>Users</li>
          <li className="li">News</li>
          <li className="li" onClick={settingPage}>Settings</li>
          <li className="li" onClick={logout}>logout</li>
          <li className="li" onClick={openDeleteModal}>Delete Account</li>
      </ul>

      <div className="nav-morph">
        <svg width="100%" height="100%" viewBox="0 0 600 800" preserveAspectRatio="none">
          <path fill="none" d={pathData} />
        </svg>
      </div>
    </nav>
      </div>
      {deleteModal && (<div className="delete-modal">
        <h3>DELETE ACCOUNT</h3>
        <p>Do you want to delete the account?</p>
        <div>
          <button onClick={deleteAccount}>DELETE</button>
          <button onClick={cancelDelete}>CANCEL</button>
        </div>

      </div>)}
      
      </>
  )
}
