import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { PageNotFound } from "./components/PageNotFound";
import { AuthProvider } from "./AuthContext";
function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<PageNotFound/> } />

        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
