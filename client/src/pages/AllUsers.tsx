import { useEffect, useState } from "react";
import Menu from "../Components/Menu";
import NavBar from "../Components/NavBar";
import "./AllUsers.css"
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/login";


export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [theater,setTheater]=useState([])
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
    const getTheater = async () => {
   
  try {
         const requestOptions = {
  method: 'GET',
  
};
const response = await fetch("http://localhost:5000/myApi/theaters/al", requestOptions)
      const result = await response.json()
      console.log('result :>> ', result);
      setTheater(result.theaterUsers)
  } catch (error) {
      console.log('error :>> ', error);
      setError('Failed to load theaters')
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
            setUsers(result.users); 
            setTheater(result.theaters)
        } catch (error) {
            console.error('Error :>> ', error);
            setError('Failed to load users');
        }
    }
    

useEffect(() => {
    getUsers()
    getTheater()
    

}, [])





   return (
    <div>
        <NavBar />
           <Menu />
           <h2>What are you looking for?</h2>
           <h2>Users | Theaters</h2>
        <div className="search-container">
            <input 
                type="text" 
                placeholder="search..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button onClick={findUser}>Search</button> 
        </div>
        
        <div className="content-container">
            <div className="users-container">
                <h2>Users</h2>
                {error && <p>Error: {error}</p>}
                {users && users.length > 0 ? (
                    <ul className="list">
                        {users.map(user => (
                            <li className="users-list" key={user._id} onClick={() => handleSelectUser(user)}>
                                <img className="Usersphoto" src={user.profilePhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} />
                                {user.name}
                            </li> 
                        ))}
                    </ul>
                ) : (
                    <p>No users found</p>
                )}
            </div>

            <div className="theaters-container">
                   <h2>Theaters</h2>
                   {error && <p>Error: {error}</p>}
                {theater && theater.length > 0 ? (
                    <ul className="list">
                        {theater.map(theater => (
                            <li className="theater-list" key={theater._id} onClick={() => handleSelectUser(theater)}>
                                
                                <img className="Usersphoto"  src={theater.profilePhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} />
                                   {theater.theaterName}
                                
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No theaters found</p>
                )}
            </div>
        </div>
    </div>
);
}
