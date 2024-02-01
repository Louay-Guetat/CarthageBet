import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Paiement from './pages/paiement';
import ModePaiement from './pages/ModePaiement';
import DashboardAgent from './pages/DashboardAgent';
import Login from './pages/Login';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/modePaiement' element={<ModePaiement />} />
          <Route path='/Paiement' element={<Paiement />} />
          <Route path='/Dashboard' element={<DashboardAgent />} />
          <Route path='/LoginDashboard' element={<Login />} />
          <Route path='/Contact' element={<Contact />} />
        </Routes>
      </Router>
  );
}

export default App;
