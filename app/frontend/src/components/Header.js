import React from "react";
import "./Header.css";

function toSentenceCase(str) {
  if (!str) return ""; // Return an empty string if input is falsy
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const Header = ({ user, onLoginClick }) => {
  return (
    <div className="left-section">
      <h1 className="alex-brush-regular">Briefly</h1>
      {user ? (
        <h4>
          Welcome Back, {toSentenceCase(user.username)} !
        </h4>
      ) : (
        <>
          <h4>Welcome !</h4>
          <button className="login-signup button" onClick={onLoginClick}>Login / Sign Up</button>
        </>
      )}
    </div>
  );
};

export default Header;