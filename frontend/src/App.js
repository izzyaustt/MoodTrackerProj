import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LogInPage from "./pages/LogInPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/login" element={<LogInPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="*" element={<Navigate to="/" />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;