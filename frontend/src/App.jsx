import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Splash from './pages/Splash';
import VehicleListing from './pages/VehicleListing';
import VehicleDetail from './pages/VehicleDetail';
import ListVehicle from './pages/ListVehicle';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import WhyUs from './pages/WhyUs';

function AppContent() {
  return (
    <div className="app-container">
      {/* Global Background Aesthetics */}
      <div className="global-bg-overlay">
        <div className="grid-pattern"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <Navbar />

      <style>{`
        .app-container {
          position: relative;
          min-height: 100vh;
        }

        .global-bg-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: -10;
          overflow: hidden;
          background-color: #FFFFFF;
        }

        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(#eef2f6 1px, transparent 1px),
            linear-gradient(90deg, #eef2f6 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.8;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.35;
          animation: globalBlobFloat 25s infinite alternate ease-in-out;
        }

        .blob-1 {
          width: 600px;
          height: 600px;
          background: #7C3AED;
          top: -150px;
          right: -100px;
        }

        .blob-2 {
          width: 500px;
          height: 500px;
          background: #06B6D4;
          bottom: -100px;
          left: -100px;
          animation-delay: -7s;
        }

        .blob-3 {
          width: 400px;
          height: 400px;
          background: #EC4899;
          top: 30%;
          right: 15%;
          animation-delay: -12s;
          opacity: 0.25;
        }

        @keyframes globalBlobFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 120px) scale(1.15); }
        }

        main {
          position: relative;
          z-index: 1;
        }
      `}</style>
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/vehicles" element={<VehicleListing />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/list-my-car" element={<ListVehicle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/splash" element={<Splash />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
