import "../Components/SignUp.css";
import { useState } from "react";
//boolean string, number, null

export default function SignUp() {
  const [hasAccount, setHasAccount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

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
  //   function handleInputChange(e:ChangeEvent<HTMLInputElement>) {
  //   console.log('e.target.value :>> ', e.target.value);
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
                community. Gain access to tools for managing and promoting your
                theater, announce upcoming productions, and engage with fellow
                theater enthusiasts.
              </p>
              </div>
              <div className="reg-form">
                <label htmlFor="theaterName">Theater Name</label>
              <input type="text" name="theaterName" />

              <label htmlFor="email">Email</label>
              <input type="email" name="email" />
              <label htmlFor="password">Password</label>
              <input type="password" name="password" />
              <label htmlFor="repeatPass">Repeat Password</label>
              <input type="password" id="repeatPass" />
              </div>
              
            </div>
          )}
          {selectedCategory === "User" && (
            <div className="theater-container">
              <div className="info-holder">
                <h2>User Registration</h2>
              <p>
                Join StageConnect and enjoy the benefits of being a part of our
                theater community. Access discussions, event announcements,
                opportunities for viewing, and sharing theatrical experiences.
              </p></div>
              <div className="reg-form">  <label htmlFor="email">Email</label>
              <input type="email" name="email" />
              <label htmlFor="password">Password</label>
              <input type="password" name="password" />
              <label htmlFor="repeatPass">Repeat Password</label>
              <input type="password" id="repeatPass" /></div>
            
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

      <button>{registerButton}</button>
      <button onClick={toggleHasAccount}>{buttonLabel}</button>
    </div>
  );
}


