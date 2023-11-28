import { useState, useEffect } from "react";
import "./News.css"

interface TheaterUser {
  city?: string;
  country?: string;
  email?: string;
  followers?: number;
  following?: number;
  password?: string;
  profilePhoto?: string;
  theaterName: string;
  _id: string;
}

interface TheaterUsers {
  number: number;
  theaterUsers: TheaterUser[];
}

export default function News() {
  // const [allTheaters, setAllTheaters] = useState<TheaterUsers>({ number: 0, theaterUsers: [] });
    const [allTheaters, setAllTheaters] = useState <TheaterUsers | null>(null);
  

  const getAllTheaters = async () => {
    const requestOptions = {
      method: "GET",
     
    };
    try {
      const response = await fetch(
        "http://localhost:5000/myApi/theaters/all",
        requestOptions
      );
      const result = await response.json() as TheaterUsers
      console.log("result :>> ", result);
      
        setAllTheaters(result)
        
    } catch (error) {
      console.log("error", error);
    }
    };
   
    useEffect(() => {
   getAllTheaters()
    }, [])
    
    
    return (
    <div>
      
      {/* <p>Number of Theaters: {allTheaters.number}</p> */}
      <div className="theaters-container" >
        {allTheaters && allTheaters.theaterUsers.map((theater, index) => (
          <div key={index} className="theaterCard">
            <h3>Theater: {theater.theaterName}</h3>
            <p>City: {theater.city}</p>
            <p>Country: {theater.country}</p>
            
          
              <div>
                <p>User Email: {theater.email}</p>
                <p>Followers: {theater.followers}</p>
                
              </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}