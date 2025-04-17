import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase.js";
import LoginUI from "../views/pages/LoginUI.jsx";
import '../App.css';
import Loading from "../views/components/Loading.jsx";

const Authenticator = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(), // Normalize email to lowercase
        password: password,
      });

      if (!authError && authData?.user) {
        navigate("/home");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <LoginUI
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default Authenticator;