// create context

import { useState, createContext, useEffect,  } from "react";
import { User } from "../pages/Profile";
// import { useNavigate } from "react-router-dom";
export const AuthContext = createContext({});
// export interface User {
  
//   id: number;
//   name: string;
//   email: string;
//   profilePhoto:string
// }

 export interface AuthContextProps {
  user: User | null;
  userChecked?: boolean;
  isLoading?: boolean;
  registration?: (data: any, url: string) => Promise<any>;
  login?: (loginCredentials: { email: string; password: string }) => Promise<void>;
  getProfile?: () => Promise<void>;
}

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<User|null>(null);
  const [userChecked, setUserChecked] = useState(false)
  const [isLoading, setIsLoading] = useState (false)

  const getProfile = async () => {
    setIsLoading(true)
    const token = localStorage.getItem("token");
    if (!token) {
      // alert("register first!");
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      try {
        const response = await fetch(
          "http://localhost:5000/myApi/users/profile",
          requestOptions
        );
        const result = await response.json();
        console.log("%c result UserProfile :>> ", "color:red", result);
        setUser(result.user);
        setUserChecked(true)
      } catch (error) {
        console.log("error :>> ", error);
      } finally {
        setIsLoading(false)
      }
    }
  };
  const registration = async (data:any, url:string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if ("theaterName" in data) {
      urlencoded.append("name", data.theaterName);
    } else {
      urlencoded.append("name", data.name);
    }
    urlencoded.append("email", data.email);
    urlencoded.append("password", data.password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/myApi/${url}`,
        requestOptions
      );
      const result = await response.json();
      return result
      // console.warn("result :>> ", result);
      // Handle result or update user state
      setUser(result.savedUser);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const login = async(loginCredentials: { email: string; password: string }) => {
    // setIsLoading(true)

    console.log("loginCredentials :>> ", loginCredentials);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", loginCredentials!.email);
    urlencoded.append("password", loginCredentials!.password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/myApi/users/login",
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();

        if (result.token) {
          localStorage.setItem("token", result.token);
          setUser(result.user);
          // const navigate = useNavigate();

          // navigate("/profile");
        }
      }
      if (!response.ok) {
        const result = await response.json();
        console.log("result is not ok");
        alert(result.message);
      }
    } catch (error) {
      console.log("error :>> ", error);
      // } finally {
      //   setIsLoading(false)
      // }
    }
  };

  useEffect(() => {
    getProfile();
    setUserChecked(false)
  }, []);
    const contextValue: AuthContextProps = {
    user,
    userChecked,
    isLoading,
    registration,
    login,
    getProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
