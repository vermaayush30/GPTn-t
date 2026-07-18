import "./Auth.css";
import { useContext, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { API_URL } from "./config.js";

function Auth() {
    const { login } = useContext(MyContext);
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = mode === "login" ? "login" : "signup";
        const body = mode === "login"
            ? { email, password }
            : { username, email, password };

        try {
            const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if(!response.ok) {
                setError(data.error || "Something went wrong");
                setLoading(false);
                return;
            }

            login(data.token, data.user);
        } catch(err) {
            console.log(err);
            setError("Could not reach the server. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="authWrapper">
            <div className="authCard">
                <div className="belt">
                    <span className="beltDot"></span>
                    <span className="beltDot"></span>
                    <span className="beltDot"></span>
                </div>
                <h1 className="authTitle">GPTn't</h1>
                <p className="authSubtitle">
                    {mode === "login" ? "Log in to continue" : "Create your account"}
                </p>

                <form onSubmit={handleSubmit} className="authForm">
                    {
                        mode === "signup" &&
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    }
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="authError">{error}</p>}

                    <button type="submit" className="authSubmit" disabled={loading}>
                        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
                    </button>
                </form>

                <p className="authToggle">
                    {mode === "login" ? "New here?" : "Already have an account?"}{" "}
                    <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
                        {mode === "login" ? "Create an account" : "Log in"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;