// AuthForm.js
"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "./AuthLayout";
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('./LoginForm'), { ssr: false });
const SignupForm = dynamic(() => import('./SignupForm'), { ssr: false });

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Login form submitted" : "Sign Up form submitted");
  };

  const switchToLogin = () => setIsLogin(true);
  const switchToSignUp = () => setIsLogin(false);

  return (
    <AuthLayout
      isLogin={isLogin}
      switchToLogin={switchToLogin}
      switchToSignUp={switchToSignUp}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLogin ? (
            <LoginForm handleSubmit={handleSubmit} />
          ) : (
            <SignupForm handleSubmit={handleSubmit} />
          )}
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
}