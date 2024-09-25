import React, { useState, useEffect } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth";
import Header from "./components/Header";
import ArticleList from "./components/ArticleList";

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
      type: "select",
      options: ["Male", "Female", "Other"],
      isRequired: true,
      placeholder: "Select your gender",
    },
  },
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.log("User not authenticated");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header user={user} onLoginClick={handleLoginClick} />
      <div className="right-section">
        <ArticleList onSignOut={handleSignOut} user={user}/>
      </div>
      {showModal && (
        <div className="modal">
          <button onClick={handleCloseModal} className="close-modal">X</button>
          <Authenticator
            signUpAttributes={["email", "name", "gender"]}
            formFields={fields}
          >
            {({ user }) => {
              setUser(user);
              setShowModal(false);
              return null;
            }}
          </Authenticator>
        </div>
      )}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');
      </style>
    </div>
  );
}

export default App;