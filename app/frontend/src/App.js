import React from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
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
  return (
    <div className="container">
      <Header />
      <Authenticator signUpAttributes={["email", "name", "gender"]} formFields={fields}>
        {({ signOut }) => (
          <div className="right-section">
            <Button onClick={signOut}>Sign Out</Button>
            <ArticleList />
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