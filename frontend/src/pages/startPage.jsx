import React from "react";
import { useNavigate } from "react-router-dom"; 
import '../style/startPage.css';


const StartPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register"); 
  };

  const handleLoginClick = () => {
    navigate("/login"); 
  };

  // Vidim da si koristio tailwind (mada koliko vidim nije zapravo setup-ovan u projektu) a u isto vreme koristis i .css fajlvoe
  // Oba su skroz validna i cesto koriscena, bilo bi dobro odluciti se za jednu opciju i drzati se nje kroz ceo projekat
  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleRegisterClick}
          className="bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold shadow-md"
        >
          Register
        </button>

        <button
          onClick={handleLoginClick}
          className="bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold shadow-md"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default StartPage;
