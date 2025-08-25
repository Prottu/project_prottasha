import React from "react";
import { Link } from "react-router-dom";
import carImage from "../assets/car.jpg"; // ✅ This path is important!
import "./css/Home.css"; // ✅ This links your CSS file

const Home = () => {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${carImage})` }}
    >
      <div className="overlay">
        <h1>Find Your Perfect Ride</h1>
        <p>Unleash Your Adventure</p>
        <div className="buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/signup" className="btn">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;