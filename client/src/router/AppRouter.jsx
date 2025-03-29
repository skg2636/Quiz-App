import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import QuizQuestion from "../pages/QuizQuestion";
import AdminQuizCreate from "../pages/GenerateQuiz";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />

      {/* disbaling the routes for now wil be implemented inc oming update */}
      {/* <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} /> */}

      {/* Protected Routes (Requires Auth) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz-start"
        element={
          <ProtectedRoute>
            <AppLayout>
              <QuizQuestion/>
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="generate-quiz"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AdminQuizCreate/>
            </AppLayout>
          </ProtectedRoute>
        }
      />


      {/* Catch-all Route for 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
      
    </Routes>
  );
};

export default AppRouter;
