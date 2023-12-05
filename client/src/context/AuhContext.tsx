// create context

import {  useState, createContext, useEffect } from "react";


export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  console.log("children :>> ", children);
    const [user, setUser] = useState({ name: "test" });
    
    

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("register first!");
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
      } catch (error) {
        console.log("error :>> ", error);
      }
    }
  };
  const registration = async (data, url) => {
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
      console.warn("result :>> ", result);
      // Handle result or update user state 
      setUser(result.savedUser);
    
    } catch (error) {
      console.log("error :>> ", error);
    }
    };
    
    const login = async (loginCredentials) => {
  
        console.log('loginCredentials :>> ', loginCredentials);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("email", loginCredentials!.email);
        urlencoded.append("password", loginCredentials!.password);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
  
        };
        try {
            const response = await fetch("http://localhost:5000/myApi/users/login", requestOptions)
            if (response.ok) {
                const result = await response.json();
                
                if (result.token) {
                    localStorage.setItem('token', result.token)
                    setUser(result.user)
                    
                }
            }
            if (!response.ok) {
                const result = await response.json()
                console.log('result is not ok');
                alert(result.message)
            }
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, registration,login }}>
      {children}
    </AuthContext.Provider>
  );
};
