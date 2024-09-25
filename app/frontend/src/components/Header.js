import React from "react";
import "./Header.css";

function toSentenceCase(str) {
  if (!str) return ''; // Return an empty string if input is falsy
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const Header = (user) => {
  return (
    <div className="left-section">
      {/* {console.log(user)} */}
      <h1 className="alex-brush-regular">Briefly</h1>
      <h3 className="alex-brudh-regular">Welcome Back, {toSentenceCase(user.user.username)} !</h3>
    </div>
  );
};

export default Header;