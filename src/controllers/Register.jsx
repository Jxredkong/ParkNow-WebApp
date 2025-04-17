import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase.js";
import RegisterUI from "../views/pages/RegisterUI.jsx";
import '../App.css';
import Loading from "../views/components/Loading.jsx"; // Reuse the Loading component

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Add state for email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUppercase = /[A-Z]/;
    const hasDigit = /\d/;

    if (!minLength.test(password)) {
      alert("Password must be at least 8 characters long.");
      return false;
    }
    if (!hasUppercase.test(password)) {
      alert("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!hasDigit.test(password)) {
      alert("Password must contain at least one digit.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) { // Validate email format
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email, // Use the provided email
        password: password,
        options: {
          data: {
            username: username, // Store username in user metadata
          },
        },
      });

      if (authError || !authData?.user) {
        alert(`Registration failed: ${authError?.message || "Unknown error"}`);
        return;
      }

      alert("Registration successful!");
      setEmail(""); // Reset email field
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading /> // Reuse the Loading component
      ) : (
        <RegisterUI
          email={email} // Pass email to RegisterUI
          setEmail={setEmail} // Pass setEmail to RegisterUI
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleRegister={handleRegister}
        />
      )}
    </div>
  );
};

export default Register;