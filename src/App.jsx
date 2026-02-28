import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";

/* ================= SIGNUP ================= */
function Signup({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");

  const handleSignup = () => {
    const { first, last, email, password, confirm } = form;

    if (!first || !last || !email || !password || !confirm)
      return setError("All fields required");

    if (!email.includes("@"))
      return setError("Invalid email");

    if (password.length < 6)
      return setError("Password must be 6+ chars");

    if (password !== confirm)
      return setError("Passwords do not match");

    localStorage.setItem("user", JSON.stringify(form));
    setUser(form);
    navigate("/");
  };

  return (
    <div className="auth">
      <div className="card">
        <h2>Create Account</h2>
        <input placeholder="First Name" onChange={e => setForm({...form, first: e.target.value})} />
        <input placeholder="Last Name" onChange={e => setForm({...form, last: e.target.value})} />
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <input type="password" placeholder="Confirm Password" onChange={e => setForm({...form, confirm: e.target.value})} />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
}

/* ================= SIGNIN ================= */

function Signin({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = () => {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (!saved) return setError("No account found");

    if (form.email === saved.email && form.password === saved.password) {
      setUser(saved);
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth">
      <div className="card">
        <h2>Sign In</h2>
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

/* ================= PROFILE ================= */

function Profile({ user }) {
  return (
    <div className="profile">
      <div className="card">
        <h2>Profile</h2>
        <p><strong>First Name:</strong> {user.first}</p>
        <p><strong>Last Name:</strong> {user.last}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
}

/* ================= APP ================= */
function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="navbar">
        <h2>DarkStore</h2>
        <div>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin">Sign In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            user ? <Home /> : <Navigate to="/signin" />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/signin" element={<Signin setUser={setUser} />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;