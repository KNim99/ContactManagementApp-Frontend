import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

// Lazy load components for better performance
const ContactList = lazy(() => import("./pages/ContactList"));
const ContactForm = lazy(() => import("./pages/ContactForm"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center p-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        <div className="app-container">
          <h2 className="text-center mb-4">Contact Management</h2>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<ContactList />} />
              <Route path="/add" element={<ContactForm />} />
              <Route path="/edit/:id" element={<ContactForm />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
};

export default App;
