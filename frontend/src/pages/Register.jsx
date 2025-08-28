import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import '../style/register.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setMessage({ type: "success", text: response.message });
      setFormData({ username: "", email: "", password: "" });

      navigate("/login");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">📝 Register</h1>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
