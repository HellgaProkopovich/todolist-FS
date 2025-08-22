import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodosPage from "./pages/TodosPage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <div className="m-auto flex flex-col items-center min-h-screen overflow-hidden bg-gray-50">
      <header></header>
      <main className="w-full max-w-3xl flex flex-col items-center justify-start pt-12 px-4 text-center">
        <Routes>
          {/* дефолтный редирект на /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodosPage />
              </ProtectedRoute>
            } 
          />

          {/* на всякий случай: 404 → на /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <footer></footer>
    </div>
  );
};