import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import SampleDashboard from './pages/SampleDashboard';
import Diabetes from './pages/Diabetes';
import Diet from './pages/Diet';
import PumpGuide from './pages/PumpGuide';
import Complications from './pages/Complications';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Faq from './pages/Faq';
import Support from './pages/Support';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-text)]">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sample-dashboard" element={<SampleDashboard />} />
        <Route path="/diabetes" element={<Diabetes />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/pump-guide" element={<PumpGuide />} />
        <Route path="/complications" element={<Complications />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </div>
  )
}

export default App;
