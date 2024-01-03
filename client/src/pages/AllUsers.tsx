import { useEffect, useState } from "react";
import Menu from "../Components/Menu";
import NavBar from "../Components/NavBar";
import "./AllUsers.css"
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/login";


export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [selectUser, setSelectUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState(''); 
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
    
const findUser = async () => {
        try {
            const token = getToken();
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };
            const response = await fetch(`http://localhost:5000/myApi/users/search?q=${searchQuery}`, requestOptions);
            const result = await response.json();
            console.log('result :>> ', result);
            setUsers(result); 
        } catch (error) {
            console.error('Error :>> ', error);
            setError('Failed to load users');
        }
    }

useEffect(() => {
    getUsers()
    

}, [])





   return (
        <div>
            <NavBar />
            <Menu />
            <div>
                <input 
                    type="text" 
                    placeholder="search..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button onClick={findUser}>Search</button> 
            </div>
           
       
            <div>
                {error && <p>Error: {error}</p>}
                {users && users.length > 0 ? (
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
