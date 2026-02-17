import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation() 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
    { to: '/scan', icon: 'bi-qr-code-scan', label: 'Scan & Pay' },
    { to: '/loan-calculator', icon: 'bi-calculator-fill', label: 'Loan' },
    { to: '/fd-calculator', icon: 'bi-bank2', label: 'FD' },
    { to: '/rd-calculator', icon: 'bi-piggy-bank-fill', label: 'RD' },
    { to: '/expenses', icon: 'bi-graph-up-arrow', label: 'Expenses' },
  ]

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: scrolled
          ? 'rgba(6, 13, 31, 0.95)'
          : 'rgba(6, 13, 31, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.3s ease',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '12px 0',
      }}
    >
      <div className="container-lg">
        {/* Brand */}
        <NavLink to="/dashboard" className="navbar-brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #00d4aa, #0a2463)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="bi bi-lightning-charge-fill" style={{ color: '#fff', fontSize: '1rem' }}></i>
          </div>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '1.3rem',
            background: 'linear-gradient(135deg, #00d4aa, #7dd3fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Finance and Banking
          </span>
        </NavLink>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8 }}
        >
          <i className="bi bi-list" style={{ color: '#00d4aa', fontSize: '1.4rem' }}></i>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto d-flex align-items-lg-center gap-lg-1">
            {navLinks.map(({ to, icon, label }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${isActive ? 'active-nav' : ''}`
                  }
                  style={({ isActive }) => ({
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    letterSpacing: '0.03em',
                    color: isActive ? '#00d4aa' : 'rgba(240,244,255,0.7)',
                    background: isActive ? 'rgba(0,212,170,0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
                    transition: 'all 0.25s ease',
                    textDecoration: 'none',
                  })}
                  onMouseEnter={e => {
                    if (!e.currentTarget.classList.contains('active-nav')) {
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!e.currentTarget.classList.contains('active-nav')) {
                      e.currentTarget.style.color = 'rgba(240,244,255,0.7)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <i className={`bi ${icon}`} style={{ fontSize: '0.95rem' }}></i>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Avatar */}
          <div className="ms-lg-3 mt-2 mt-lg-0">
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0a2463, #00d4aa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '2px solid rgba(0,212,170,0.3)',
            }}>
              <i className="bi bi-person-fill" style={{ color: '#fff', fontSize: '1rem' }}></i>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
