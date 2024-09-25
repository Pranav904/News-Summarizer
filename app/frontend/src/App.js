import React, { useState, useEffect } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth"; // Use getCurrentUser in v6
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

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const user = await getCurrentUser(); // Use getCurrentUser in Amplify v6
      setUser(user);
    } catch (error) {
      console.log("User not authenticated");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await amplifySignOut(); // Use Amplify v6 signOut
      setUser(null); // Clear user state on sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header user={user} />
      {!user ? (
        <Authenticator
          signUpAttributes={["email", "name", "gender"]}
          formFields={fields}
        >
          {({ user }) => {
            setUser(user); // Set user state when signed in
            return (
              <div className="right-section">
                <ArticleList onSignOut={handleSignOut} />
              </div>
            );
          }}
        </Authenticator>
      ) : (
        <div className="right-section">
          <ArticleList onSignOut={handleSignOut} />
        </div>
      )}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');
      </style>
    </div>
  );
}

export default App;