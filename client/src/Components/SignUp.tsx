import "../Components/SignUp.css";
import { ChangeEvent, useState, useEffect, useContext } from "react";
import { isUserLoggedIn, getToken } from "../utils/login";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuhContext";
//boolean string, number, null
interface Theater {
  theaterName: string;
  email: string;
  password: string;
  repeatPass: string;
}
interface User {
  name: string;
  email: string;
  password: string;
  repeatPass: string;
}
interface Errors {
  emailError?: string;
  passwordError?: string;
}

const initialTheaterValues = {
  theaterName: "",
  email: "",
  password: "",
  repeatPass: "",
};
const initialUserValues = {
  name: "",
  email: "",
  password: "",
  repeatPass: "",
};
type loginCredentialsType = {
  email: string;
  password: string;
};
export default function SignUp() {
  // const [user, setUser]=useState(false)
  const [loginCredentials, setLoginCredentials] =
    useState<loginCredentialsType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors>();
  const [hasAccount, setHasAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [newTheater, setNewTheater] = useState<Theater>(initialTheaterValues);
  const [newUser, setNewUser] = useState<User>(initialUserValues);
  const { registration, login, user } = useContext(AuthContext);

  console.log("user :>> ", user ? user.email : "no user");
  const navigate = useNavigate();
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email: string) => {
    console.log("email :>> ", email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const IsPasswordsMatch = (password: string, repeatPass: string) => {
  //   return password === repeatPass;
  // };

  const handelRegisterOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTheater({ ...newTheater, [name]: value });
    setNewUser({ ...newUser, [name]: value });

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
        const passwordField =
          selectedCategory === "Theater"
            ? newTheater.password
            : newUser.password;
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
        console.log("newTheater :>> ", newTheater);
      } else {
        setNewUser({ ...newUser, [name]: value });
        console.log("newUser :>> ", newUser);
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

  // const registration = async (data: Theater | User, url: String) => {
  //   console.warn("newTheater :>> ", newTheater);

  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  //   const urlencoded = new URLSearchParams();
  //   if ("theaterName" in data) {
  //     // It's Theater type
  //     urlencoded.append("name", data.theaterName);
  //   } else {
  //     // It's User type
  //     urlencoded.append("name", data.name);
  //   }
  //   urlencoded.append("email", data.email);
  //   urlencoded.append("password", data.password);

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: urlencoded,
  //   };

  //   try {
  //     const response = await fetch(`http://localhost:5000/myApi/${url}`, requestOptions)
  //     const result = await response.json()
  //     console.log('result :>> ', result);
  //     // navigate('/profile')
  //   } catch (error) {
  //     console.log('error :>> ', error);
  //   }

  // };
  // const handleRegistration = async () => {
  //   const data = selectedCategory === "Theater" ? newTheater : newUser;
  //   const endpoint =
  //     selectedCategory === "Theater" ? "theaters/register" : "users/register";
  //   await registration(data, endpoint);
  //   const isUserLogged = isUserLoggedIn();
  //   if (isUserLogged) {
  //     navigate('/profile');
  //   } else {

  //   alert('try to login');
  // }

  // navigate('/profile')
  // };
  const handleRegistration = async () => {
    console.log("selectedCategory :>> ", selectedCategory);
    if (
      (selectedCategory === "Theater" &&
        newTheater.theaterName &&
        newTheater.email &&
        newTheater.password &&
        newTheater.repeatPass) ||
      (selectedCategory === "User" &&
        newUser.name &&
        newUser.email &&
        newUser.password &&
        newUser.repeatPass)
    ) {
      const data = selectedCategory === "Theater" ? newTheater : newUser;
      console.log("data :>> ", data);
      const endpoint =
        selectedCategory === "Theater" ? "theaters/register" : "users/register";
      const result = await registration(data, endpoint);
      console.log("result :>> ", result);
      if (result !== undefined) {
        alert("sign up successful. redirecting to login");
        setTimeout(() => {
          setHasAccount(true);
        }, 2000);
      }
      // const isUserLogged = isUserLoggedIn();
      // if (isUserLogged) {
      //   navigate('/profile');
      // } else {
      //   alert('try to login');
      // }
    }
    // else {
    //     alert('Please fill in all required fields.');
    //   }
  };

  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.value :>> ", e.target.value);
    const propetyName = e.target.name;
    const propetyValue = e.target.value;
    setLoginCredentials({ ...loginCredentials!, [propetyName]: propetyValue });
  };

  const handleLoginOnClick = async () => {
    if (loginCredentials?.email && loginCredentials?.password) {
      await login(loginCredentials);
      console.log('loginCredentials :>> ', loginCredentials);

      const isUserLogged = isUserLoggedIn();
      if (isUserLogged) {
        console.log(
          "user pre nav:>> ",
          user,
          "isUserLogged pre nav",
          isUserLogged
        );
        navigate('/profile');
      }
    } else {
      alert("Please provide both email and password.");
    }
  };

  useEffect(() => {
    // const isUserLogged = isUserLoggedIn();
    // if (isUserLogged && user !== undefined) {
    //   console.warn("user", user, "isUserLogged", isUserLogged);

    //   navigate("/profile");
    // } else {
    //   console.log("user is logged out");
    // }
  }, []);
  // }
  return (
    <div className="form-container">
      <h3>{heading}</h3>
      {!hasAccount ? (
        <div className="select-category">
          <p>Select your registration category</p>
          <div className="select-buttons">
            <div className="container">
              <div className="btn">
                <a href="#" onClick={() => handleSelect("Theater")}>
                  Theater
                </a>
              </div>

              <p>or</p>

              <div className="btn">
                <a href="#" onClick={() => handleSelect("User")}>
                  User
                </a>
              </div>
            </div>
          </div>
          {selectedCategory === "Theater" && (
            <>
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
                  <div className="theater-name">
                    <label htmlFor="theaterName">Theater Name</label>
                    <span className="theater-icon">🏛</span>
                    <input
                      // type="text"
                      type="input"
                      name="theaterName"
                      id="theaterName"
                      required
                      onChange={handelRegisterOnChange}
                    />
                  </div>
                  <div className="email">
                    <label htmlFor="email">Email</label>
                    <span className="icon-email">✉</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      onChange={handelRegisterOnChange}
                    />
                  </div>
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
                      required
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
                      required
                      onChange={handelRegisterOnChange}
                    />
                  </div>
                  <div>
                    {errorMessage && (
                      <p className="errorMessage">
                        {errorMessage.passwordError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="btn">
                  <a href="#" onClick={handleRegistration}>
                    {registerButton}
                  </a>
                </div>
              </div>
            </>
          )}
          {selectedCategory === "User" && (
            <>
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
                  <div className="user-name">
                    <label htmlFor="userName">User Name</label>
                    <span className="user-icon">👤</span>
                    <input
                      type="text"
                      id="userName"
                      name="name"
                      onChange={handelRegisterOnChange}
                    />
                  </div>
                  <div className="email">
                    <label htmlFor="emailUser">Email</label>
                    <span className="icon-email">✉</span>

                    <input
                      type="email"
                      id="emailUser"
                      name="email"
                      onChange={handelRegisterOnChange}
                    />
                  </div>
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
                      onChange={handelRegisterOnChange}
                    />
                  </div>
                  <div>
                    {errorMessage && (
                      <p className="errorMessage">
                        {errorMessage.passwordError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="btn">
                  <a href="#" onClick={handleRegistration}>
                    {registerButton}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="signin">
          <div className="email">
            <label htmlFor="email">Email</label>
            <span className="icon-email">✉</span>
            <input
              type="email"
              name="email"
              onChange={handleLoginInputChange}
            />
          </div>
          <div className="pass">
            <label htmlFor="password">Password</label>
            <span className="icon-pass" onClick={toggleVisibility}>
              &#128274;
            </span>
            <input
              type={showPassword ? "text" : "password"}
              onChange={handleLoginInputChange}
              name="password"
            />
          </div>
          <div className="container">
            <div className="btn">
              <a href="#" onClick={handleLoginOnClick}>
                Login
              </a>
            </div>
            {/* <button className="btn" onClick={handleLoginOnClick}>login</button> */}
          </div>
        </div>
      )}

      <div className="container">
        <div>
          <a href="#" onClick={toggleHasAccount}>
            {buttonLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
