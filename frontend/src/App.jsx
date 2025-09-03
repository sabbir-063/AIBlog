import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth, AuthProvider } from "./contexts/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import PostDetails from "./components/PostDetails";
import NotFound from "./components/NotFound";
import LoginNavbar from "./components/LoginNavbar";
import Footer from "./components/Footer";
import CreatePost from "./components/CreatePost";
import Navbar from "./components/NavBar";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import AISettings from "./components/AISettings";

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      {user ? <LoginNavbar /> : <Navbar />}
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/create-post" element={user ? <CreatePost /> : <Navigate to="/login" />} />
          <Route path="/edit-post/:id" element={user ? <EditPost /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/ai-settings" element={user ? <AISettings /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

function App() {


  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
