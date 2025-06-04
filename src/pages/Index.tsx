
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return <Login onLogin={handleLogin} />;
};

export default Index;
