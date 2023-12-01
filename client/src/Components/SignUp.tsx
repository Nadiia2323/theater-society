import "../Components/SignUp.css";
import { ChangeEvent, useState,useEffect } from "react";
//boolean string, number, null
interface Theater {
  theaterName: string;
  email: string;
  password: string;
  //  repeatPass: string
}
interface User {
  name: string;
  email: string;
  password: string;
}
interface Errors {
  emailError?: string;
  passwordError?: string;
}

const initialTheaterValues = {
  theaterName: "",
  email: "",
  password: "",
  // repeatPass: ""
};
type loginCredentialsType = {
  email: string,
  password:string
}
export default function SignUp() {
  const [loginCredentials, setLoginCredentials] = useState<loginCredentialsType | null> (null)
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>();
  const [hasAccount, setHasAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newTheater, setNewTheater] = useState<Theater>(initialTheaterValues);
  const [newUser, setNewUser] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email: string) => {
    console.log("email :>> ", email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
const IsPasswordsMatch = (password: string, repeatPass: string) => {
  return password === repeatPass;
};

const handelRegisterOnChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setNewTheater({ ...newTheater, [name]: value });

  if (selectedCategory === "Theater" && name === "email") {
    if (!isValidEmail(value)) {
      console.log("Invalid email format!");
      setErrorMessage({ emailError: "Invalid email format!" });
    } else {
      setErrorMessage({});
    }
    setNewTheater({ ...newTheater, [name]: value });
  } else if (selectedCategory === "User" && name === "email") {
    if (!isValidEmail(value)) {
      setErrorMessage({ emailError: "Invalid email format" });
    } else {
      setErrorMessage({});
    }
    setNewUser({ ...newUser, [name]: value });
  } else if (
    (selectedCategory === "Theater" || selectedCategory === "User") &&
    (name === "password" || name === "repeatPass")
  ) {
    if (name === "repeatPass") {
      const passwordField = selectedCategory === "Theater" ? newTheater.password : newUser.password;
      if (value !== passwordField) {
        console.log("Passwords do NOT match");
        setErrorMessage({ passwordError: "Passwords do not match!" });
      } else {
        console.log("Passwords MATCH");
        setErrorMessage({});
      }
    }

    if (selectedCategory === "Theater") {
      setNewTheater({ ...newTheater, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  }
};

  


  const heading = !hasAccount ? "SignUp" : "SignIn";
  const buttonLabel: string = !hasAccount
    ? "already got an account? sign in instead"
    : "No account? sign up";
  const registerButton: string = !hasAccount ? "Register" : "Login";

  function toggleHasAccount() {
    setHasAccount(!hasAccount);
  }
  function handleSelect(category: string) {
    setSelectedCategory(category);
  }

  const registration = async (data: Theater | User, url: String) => {
    console.warn("newTheater :>> ", newTheater);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if ("theaterName" in data) {
      // It's Theater type
      urlencoded.append("name", data.theaterName);
    } else {
      // It's User type
      urlencoded.append("name", data.name);
    }
    urlencoded.append("email", data.email);
    urlencoded.append("password", data.password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    fetch(`http://localhost:5000/myApi/${url}`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    
  };
  const handleRegistration = async () => {
    const data = selectedCategory === "Theater" ? newTheater : newUser;
    const endpoint =
      selectedCategory === "Theater" ? "theaters/register" : "users/register";
    await registration(data, endpoint);
    
    
  };
  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.value :>> ', e.target.value);
    const propetyName = e.target.name;
    const propetyValue = e.target.value;
    setLoginCredentials({ ...loginCredentials!, [propetyName]: propetyValue });
  }
const login = async() => {
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
      console.log('result :>> ', result);
      if (result.token) {
        localStorage.setItem('token',result.token)
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
  const getToken = () => {
  const token = localStorage.getItem('token');
  return token
}
const isUserLoggedIn = () => {
  const token = getToken()
  return token ? true 
  : false;
  }
  useEffect(() => {
    const isUserLogged = isUserLoggedIn()
    if (isUserLogged) {
      console.log("user is logged in", "color:green");
    } else {
      console.log("user is logged out", "color:red" );
    }
  }, [])
  // }
  return (
    <div className="form-container">
      <h3>{heading}</h3>
      {!hasAccount ? (
        <div className="select-category">
          <p>Select your registration category</p>
          <div className="select-buttons">
            <button onClick={() => handleSelect("Theater")}>Theater</button>
            <p>or</p>
            <button onClick={() => handleSelect("User")}>User</button>
          </div>
          {selectedCategory === "Theater" && (
            <div className="theater-container">
              <div className="info-holder">
                <h2>Theater Registration</h2>
                <p>
                  Register your theater and become part of our vibrant theater
                  community. Gain access to tools for managing and promoting
                  your theater, announce upcoming productions, and engage with
                  fellow theater enthusiasts.
                </p>
              </div>
              <div className="reg-form">
                <label htmlFor="theaterName">Theater Name</label>
                <input
                  // type="text"
                  type="input"
                  name="theaterName"
                  id="theaterName"
                  onChange={handelRegisterOnChange}
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handelRegisterOnChange}
                />
                {errorMessage && (
                  <p className="errorMessage">{errorMessage.emailError}</p>
                )}
                <div className="pass">
                  <label htmlFor="password">Password</label>
                  <span className="icon-pass" onClick={toggleVisibility}>
                    &#128274;
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={handelRegisterOnChange}
                  />
                </div>
                <div className="pass">
                  <label htmlFor="repeatPass">Repeat Password</label>
                  <span className="icon-pass" onClick={toggleVisibility}>
                    &#128274;
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="repeatPass"
                    id="repeatPass"
                    onChange={handelRegisterOnChange}
                  />
                  {errorMessage && (
                    <p className="errorMessage">{errorMessage.passwordError}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {selectedCategory === "User" && (
            <div className="theater-container">
              <div className="info-holder">
                <h2>User Registration</h2>
                <p>
                  Join StageConnect and enjoy the benefits of being a part of
                  our theater community. Access discussions, event
                  announcements, opportunities for viewing, and sharing
                  theatrical experiences.
                </p>
              </div>
              <div className="reg-form">
                <label htmlFor="userName">User Name</label>
                <input
                  type="text"
                  id="userName"
                  name="name"
                  onChange={handelRegisterOnChange}
                />
                <label htmlFor="emailUser">Email</label>

                <input
                  type="email"
                  id="emailUser"
                  name="email"
                  onChange={handelRegisterOnChange}
                />
                {errorMessage && (
                  <p className="errorMessage">{errorMessage.emailError}</p>
                )}
                <div className="pass">
                  <label htmlFor="passwordUser">Password</label>
                  <span className="icon-pass" onClick={toggleVisibility}>
                    &#128274;
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwordUser"
                    name="password"
                    onChange={handelRegisterOnChange}
                  />
                </div>
                <div className="pass">
                  <label htmlFor="Pass">Repeat Password</label>
                  <span className="icon-pass" onClick={toggleVisibility}>
                    &#128274;
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="Pass"
                    name="repeatPass"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="signin">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" onChange={handleLoginInputChange}/>
          <label htmlFor="password" >Password</label>
          <input type="password" onChange={handleLoginInputChange} name="password" />
        </div>
      )}

      <button onClick={handleRegistration}>{registerButton}</button>
      {/* <button onClick={}>new test button</button> */}
      <button onClick={toggleHasAccount}>{buttonLabel}</button>
      <button onClick={login}>hey</button>
    </div>
  );
}
