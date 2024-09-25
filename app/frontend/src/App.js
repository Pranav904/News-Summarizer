import React, { useState, useEffect } from "react";
import ArticleCard from "./components/ArticleCard";
import "./App.css";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsconfig);

let fields = {
  signUp: {
    email: {
      label: "Email",
      placeholder: "Enter your email",
      isRequired: true,
      type: "email",
    },
    username: {
      label: "Username",
      placeholder: "Enter your username",
      isRequired: true,
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
      isRequired: true,
    },
    name: {
      label: "Name",
      placeholder: "Enter your name",
      isRequired: true,
    },
    gender: {
      label: "Gender",
      type: "select", // Dropdown
      options: ["Male", "Female", "Other"], // Gender options
      isRequired: true, // Make gender field required
      placeholder: "Select your gender",
    },
  },};

function App() {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/articles");
      const data = await response.json();
      setArticles(data.articles);
      setLoading(false);
    } catch (error) {
      setError("Error loading articles");
      setLoading(false);
    }
  };

  const handleNextArticle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  return (
    <div className="container">
      <div className="left-section">
        <h1 className="alex-brush-regular">Briefly</h1>
      </div>
      <Authenticator
        signUpAttributes={["email", "name", "gender"]}
        formFields={fields}

      >
        {({ signOut, user }) => (
          <div className="right-section">
            <Button onClick={signOut}>Sign Out</Button>
            {loading && (
              <div className="article-placeholder">
                <div className="placeholder shimmer"></div>
                <div className="placeholder shimmer"></div>
                <div className="placeholder shimmer"></div>
              </div>
            )}
            {!loading && !error && articles.length > 0 && (
              <ArticleCard article={articles[currentIndex]} />
            )}

            {!loading && articles.length > 1 && (
              <button className="next-button" onClick={handleNextArticle}>
                Next Article
              </button>
            )}

            {error && <div className="error">{error}</div>}
          </div>
        )}
      </Authenticator>

      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');
      </style>
    </div>
  );
}

export default App;
