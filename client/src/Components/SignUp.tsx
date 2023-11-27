import "../Components/SignUp.css";
import { ChangeEvent, useState } from "react";
//boolean string, number, null
interface Theater {
  theaterName: string;
  email: string;
  password: string;
}
interface User {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [hasAccount, setHasAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newTheater, setNewTheater] = useState<Theater>({
    theaterName: "",

    email: "",
    password: "",
  });
  const [newUser, setNewUser] = useState<User>({
    name: "",
    email: "",
    password: "",
  });
  // const handelRegisterOnChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setNewTheater({ ...newTheater, [e.target.name]: e.target.value });
  //   setNewUser({ ...newUser, [e.target.name]: e.target.value });
  // };
  const handelRegisterOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (selectedCategory === "Theater") {
      setNewTheater({ ...newTheater, [name]: value });
      setNewUser({  name: "",
    email: "",
    password: "",})
    } else if (selectedCategory === "User") {
      setNewUser({ ...newUser, [name]: value });
      setNewTheater({theaterName: "",

    email: "",
    password: "",})
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
    console.log('newTheater :>> ', newTheater);
   
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
     if ('theaterName' in data) {
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
  const data = selectedCategory === 'Theater' ? newTheater : newUser;
  const endpoint = selectedCategory === 'Theater' ? 'theaters/register' : 'users/register';
    await registration(data, endpoint);

};

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
                  type="text"
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
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handelRegisterOnChange}
                />
                <label htmlFor="repeatPass">Repeat Password</label>
                <input
                  type="password"
                  name="repeatPass"
                  id="repeatPass"
                  onChange={handelRegisterOnChange}
                />
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
                <input type="text" id="userName" name="name" onChange={handelRegisterOnChange}/>
                <label htmlFor="emailUser">Email</label>

                <input
                  type="email"
                  id="emailUser"
                  name="email"
                  onChange={handelRegisterOnChange}
                />
                <label htmlFor="passwordUser">Password</label>
                <input
                  type="password"
                  id="passwordUser"
                    name="password"
                  onChange={handelRegisterOnChange}
                />
                <label htmlFor="Pass">Repeat Password</label>
                <input type="password" id="Pass" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="signin">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
        </div>
      )}

      <button onClick={handleRegistration} >{registerButton}</button>
      <button onClick={toggleHasAccount}>{buttonLabel}</button>
    </div>
  );
}
