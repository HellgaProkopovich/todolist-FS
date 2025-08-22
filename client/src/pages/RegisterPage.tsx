import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../services/api";

export default function RegisterPage() {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [submitted, setSubmitted] = useState(false);

   const [register, { isLoading, error }] = useRegisterMutation();
   const navigate = useNavigate();

   const uEmpty = submitted && !username.trim();
   const pEmpty = submitted && !password.trim();

   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (!username.trim() || !password.trim()) return;

      try {
         await register({ username, password }).unwrap();
         navigate("/login");
      } catch (err) {
         console.error("registration failed", err);
      };
   };

   return (
      <div className="max-w-sm mx-auto mt-8">
         <h1 className="text-6xl font-bold mb-10">Registration</h1>

         <form onSubmit={onSubmit} className="grid gap-2">
            <input
               className={`border rounded px-3 py-2 ${uEmpty ? "border-red-500" : ""}`}
               placeholder="username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               aria-invalid={uEmpty}
            />
            {uEmpty && <div className="text-red-600 text-sm">Username is required</div>}

            <input
               className={`border rounded px-3 py-2 ${pEmpty ? "border-red-500" : ""}`}
               type="password"
               placeholder="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               aria-invalid={pEmpty}
            />
            {pEmpty && <div className="text-red-600 text-sm">Password is required</div>}

            <button
               className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 disabled:opacity-50"
               disabled={isLoading}
            >
               {isLoading ? "..." : "Create account"}
            </button>
         </form>

         {error ? <div className="text-red-600 text-sm">Registration failed</div> : null}

         <div className="mt-2">
            Already have account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
               Login
            </Link>
         </div>
      </div>
   );
};