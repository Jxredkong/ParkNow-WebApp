import React from "react";
import "../../styles/login.css"; // Reuse the same CSS as LoginUI
import userIcon from "../../assets/user-icon.png";
import passwordIcon from "../../assets/password-icon.png";

const RegisterUI = ({ email, setEmail, username, setUsername, password, setPassword, confirmPassword, setConfirmPassword, handleRegister }) => {
  return (
    <div className="login-background">
      {/* Header */}
      <h1 className="park-now">ParkNow</h1>

      {/* Register Form */}
      <form onSubmit={handleRegister} className="login-form">
        <h2 className="form-title">Register</h2>

        {/* Email Input */}
        <div className="input-container">
          <img src={userIcon} alt="Email Icon" className="user-icon" />
          <input
            className="input-text"
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            aria-label="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Username Input */}
        <div className="input-container">
          <img src={userIcon} alt="User Icon" className="user-icon" />
          <input
            className="input-text"
            type="text"
            id="username"
            value={username}
            placeholder="Username"
            aria-label="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="input-container">
          <img src={passwordIcon} alt="Password Icon" className="password-icon" />
          <input
            className="input-text"
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            aria-label="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="input-container">
          <img src={passwordIcon} alt="Password Icon" className="password-icon" />
          <input
            className="input-text"
            type="password"
            id="confirm-password"
            value={confirmPassword}
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Register Button */}
        <button className="login-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterUI;
