import React from 'react';
import '../styles/Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = '',
  full = false,
  disabled = false,
  onClick,
  type = 'button',
  style,
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size ? `btn-${size}` : '',
    full ? 'btn-full' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;