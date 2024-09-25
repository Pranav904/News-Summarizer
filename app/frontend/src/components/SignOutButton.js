import React from "react";
import { Button } from "@aws-amplify/ui-react";
// import "./SignOutButton.css"; // Optional: For custom styles

const SignOutButton = ({ onSignOut }) => {
  return (
    <Button onClick={onSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;