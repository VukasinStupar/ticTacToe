import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { loginUser } from "../services/userService"; 
import '../style/login.css';

const Login = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);

      if (response?.data) {
        const { token } = response.data;
        
        localStorage.setItem("token", token);

        navigate("/singleMultiP");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">🔑 Login</h1>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${
            message.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 transition-all py-3 rounded-lg font-semibold shadow-md hover:shadow-green-500/50"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
//