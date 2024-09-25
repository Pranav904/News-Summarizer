import React from "react";
import "./NextArticleButton.css";

const NextArticleButton = ({ onNext }) => {
  return (
    <button className="next-button" onClick={onNext}>
      Next Article
    </button>
  );
};

export default NextArticleButton;