import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Check if user is in admins table
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (!admin) {
      setError("Not authorized to access this system.");
      await supabase.auth.signOut();
      return;
    }

    // Save email locally if "Remember Me" is checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    const lastRoute = localStorage.getItem("lastRoute") || "/";
    navigate(lastRoute);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg2.jpeg')" }} //background image
    >
      <form
        onSubmit={handleLogin}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-96 space-y-6"
      >
        <div className="flex items-center justify-center gap-2">
          <Building2 className="h-8 w-8" style={{ color: "#008B8B" }} />
          <h2 className="text-2xl font-bold" style={{ color: "#008B8B" }}>
            Welcome to Jodama System
          </h2>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-10 py-2 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-10 py-2 focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-indigo-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="text-sm text-gray-600">Remember me</span>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg font-semibold transition"
          style={{ backgroundColor: "#008B8B", color: "white" }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
