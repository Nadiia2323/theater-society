import { useEffect, useState } from "react";
import Menu from "../Components/Menu";
import NavBar from "../Components/NavBar";
import "./AllUsers.css"
import { useNavigate } from "react-router-dom";


export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [selectUser, setSelectUser] = useState(null)
    const navigate = useNavigate();
    
    

    const handleSelectUser = (user) => {
        setSelectUser(user)
        navigate(`/user/${user._id}`);
    }


    const getUsers = async () => {
      try {
       const requestOptions = {
  method: 'GET',
 
          }; 
          const response = await fetch("http://localhost:5000/myApi/users/all", requestOptions)
          const result = await response.json()
          setUsers(result.users)
          
      } catch (error) {
          console.log('error :>> ', error);
          setError('Failed to load users')
      }
    }
    console.log('users :>> ', users);
useEffect(() => {
    getUsers()
    

}, [])





   return (
        <div>
            <NavBar />
            <Menu />
            <div>
                <input type="text" placeholder="search..." />
            </div>
            <div>
                {error && <p>Error: {error}</p>}
                {users.length > 0 ? (
                    <ul className="list">
                        {users.map(user => (
                            <li className="users-list" key={user._id} onClick={() => handleSelectUser(user)}>
                                <img className="Usersphoto" src={user.profilePhoto} alt={`Profile of ${user.name}`} />
                                {user.name}
                            </li> 
                        ))}
                    </ul>
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </div>
    );
}
