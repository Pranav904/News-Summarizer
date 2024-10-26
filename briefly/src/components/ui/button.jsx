// src/components/ui/Button.jsx

import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ children, onClick, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-2 text-white bg-black dark:bg-white dark:text-black 
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

// Defining prop types for better error handling and clarity
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: '',
};

export default Button;