import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ScanQR from './pages/ScanQR'
import LoanCalculator from './calculators/LoanCalculator'
import RDCalculator from './calculators/RDCalculator'
import FDCalculator from './calculators/FDCalculator'
import ExpenseTracker from './pages/ExpenseTracker'

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ paddingBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan" element={<ScanQR />} />
            <Route path="/loan-calculator" element={<LoanCalculator />} />
            <Route path="/rd-calculator" element={<RDCalculator />} />
            <Route path="/fd-calculator" element={<FDCalculator />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
