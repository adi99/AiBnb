import { AddRental, Home, Rentals, Dashboard, AiVocation, SocialApp, Marketplace, MyBooking } from './pages'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
 

function App() {
    return (
      <Router>
        <div className="app-container">
          <div className="page-content">
            <Routes>
                    <Route path="/" element={<AiVocation />} />
                    <Route path="/rentals" element={<Rentals />} />
                    <Route path="/add-rental" element={<AddRental />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/mybooking" element={<MyBooking />} />
                    <Route path="/Social" element={<SocialApp />} />
            </Routes>        
          </div>
        </div>
      </Router>
    );
  }

export default App;
