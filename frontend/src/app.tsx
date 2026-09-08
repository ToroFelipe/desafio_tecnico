import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ScorePage } from './pages/ScorePage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/consulta" element={<ScorePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/consulta" replace />} />
    </Routes>
  );
}