import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage    from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard    from './pages/Dashboard.jsx';
import NewEntry     from './pages/NewEntry.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage    />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<Dashboard    />} />
        <Route path="/new"      element={<NewEntry     />} />
      </Routes>
    </BrowserRouter>
  );
}