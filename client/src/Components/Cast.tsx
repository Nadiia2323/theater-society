import { useEffect, useState } from "react";
import { getToken } from "../utils/login";
import { useNavigate } from 'react-router-dom'; 
import './Cast.css';

export default function Cast() {
  const [cast, setCast] = useState([]);
  const [actor, setActor] = useState(null);
  const navigate = useNavigate();

  const getAllActors = async () => {
    const token = getToken();
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      const response = await fetch(
        "http://localhost:5000/myApi/theaters/cast",
        requestOptions
      );
      const result = await response.json();
      console.log("result :>> ", result);
      setCast(result.cast);
    } catch (error) {
      console.error("error :>> ", error);
    }
  };

  const handleActorClick = (actor) => () => {
    setActor(actor);
    navigate(`/user/${actor._id}`);
  };

  useEffect(() => {
    getAllActors();
  }, []);

  return (
    <div className="cast-container">
      {cast.map(actor => (
        <div key={actor._id} className="actor" onClick={handleActorClick(actor)}>
          <img src={actor.profilePhoto} alt={actor.name} />
          <h3>{actor.name}</h3>
        </div>
      ))}
    </div>
  );
}

