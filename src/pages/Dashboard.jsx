import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, DEMO_TRANSACTIONS, loadFromStorage } from '../utils/helpers'

const Dashboard = () => {
  const [balance] = useState(247832.50)
  const [transactions, setTransactions] = useState([])
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    // Load stored QR transactions
    const storedTxns = loadFromStorage('payflow_transactions', [])
    setTransactions([...storedTxns.slice(0, 3), ...DEMO_TRANSACTIONS].slice(0, 6))
    // Load expenses
    const storedExp = loadFromStorage('payflow_expenses', [])
    setExpenses(storedExp)
  }, [])

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)

  const quickActions = [
    { to: '/scan', icon: 'bi-qr-code-scan', label: 'Scan & Pay', color: '#00d4aa' },
    { to: '/loan-calculator', icon: 'bi-calculator-fill', label: 'Loan Calc', color: '#7dd3fc' },
    { to: '/fd-calculator', icon: 'bi-bank2', label: 'FD Calc', color: '#f59e0b' },
    { to: '/rd-calculator', icon: 'bi-piggy-bank-fill', label: 'RD Calc', color: '#c084fc' },
    { to: '/expenses', icon: 'bi-graph-up-arrow', label: 'Expenses', color: '#fb923c' },
  ]

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2463 0%, #1e3a8a 50%, #060d1f 100%)',
        padding: '40px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(125,211,252,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="container-lg">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <p style={{ color: 'rgba(0,212,170,0.8)', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                Good Day, ___ User 👋
              </p>
              <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.2rem', color: '#f0f4ff', marginBottom: 4 }}>
                 Dashboard / Home
              </h1>
              <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.9rem' }}>
                Manage all your finances in one place
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lg" style={{ marginTop: 40 }}>
        <div className="row g-4">
          {/* Balance Card */}
          <div className="col-lg-4">
            <div className="glass-card-solid p-4 fade-in-up" style={{
              background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(10,36,99,0.8))',
              border: '1px solid rgba(0,212,170,0.25)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 120, height: 120, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,212,170,0.2), transparent)',
              }} />
              <p style={{ color: 'rgba(0,212,170,0.8)', fontFamily: 'Syne', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                <i className="bi bi-wallet2 me-2"></i>Total Balance
              </p>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#f0f4ff', marginBottom: 4 }}>
                ₹2,47,832<span style={{ fontSize: '1rem', color: 'rgba(240,244,255,0.6)' }}>.50</span>
              </h2>
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.78rem', marginBottom: 0 }}>
                HDFC Bank ••••4821
              </p>
              <div className="d-flex gap-3 mt-3">
                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                  <i className="bi bi-arrow-up me-1"></i>+2.4%
                </span>
                <span style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.75rem', alignSelf: 'center' }}>vs last month</span>
              </div>
            </div>
          </div>

          {/* Spend This Month */}
          <div className="col-lg-4">
            <div className="glass-card-solid p-4 fade-in-up animate-delay-1">
              <p style={{ color: 'rgba(240,244,255,0.5)', fontFamily: 'Syne', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                <i className="bi bi-graph-down-arrow me-2" style={{ color: '#f87171' }}></i>Spent This Month
              </p>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#f87171', marginBottom: 4 }}>
                {formatCurrency(totalExpenses || 2468)}
              </h2>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 6, marginTop: 16 }}>
                <div style={{
                  width: '42%', height: '100%', borderRadius: 6,
                  background: 'linear-gradient(90deg, #f87171, #fb923c)',
                }} />
              </div>
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.75rem', marginTop: 8, marginBottom: 0 }}>
                42% of monthly budget
              </p>
            </div>
          </div>

          {/* Savings */}
          <div className="col-lg-4">
            <div className="glass-card-solid p-4 fade-in-up animate-delay-2">
              <p style={{ color: 'rgba(240,244,255,0.5)', fontFamily: 'Syne', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                <i className="bi bi-piggy-bank me-2" style={{ color: '#c084fc' }}></i>Total Savings
              </p>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#c084fc', marginBottom: 4 }}>
                ₹1,12,500
              </h2>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 6, marginTop: 16 }}>
                <div style={{
                  width: '68%', height: '100%', borderRadius: 6,
                  background: 'linear-gradient(90deg, #a855f7, #7dd3fc)',
                }} />
              </div>
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.75rem', marginTop: 8, marginBottom: 0 }}>
                FD + RD + Savings account
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 fade-in-up animate-delay-2">
          <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>
            Quick Actions
          </h5>
          <div className="row g-3">
            {quickActions.map(({ to, icon, label, color }) => (
              <div key={to} className="col-6 col-md-4 col-lg-2-4">
                <Link to={to} className="quick-btn">
                  <i className={`bi ${icon}`} style={{ color, fontSize: '1.6rem' }}></i>
                  <span style={{ color: 'rgba(240,244,255,0.8)' }}>{label}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="row g-4 mt-2">
          <div className="col-lg-7">
            <div className="glass-card-solid p-4 fade-in-up animate-delay-3">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 0 }}>
                  Recent Transactions
                </h5>
                <span className="badge-accent">Live</span>
              </div>
              <div className="d-flex flex-column gap-2">
                {transactions.map((txn, idx) => (
                  <div key={txn.id || idx} className="txn-item">
                    <div className="txn-icon" style={{
                      background: txn.type === 'credit'
                        ? 'rgba(16,185,129,0.15)'
                        : `rgba(${txn.color ? txn.color.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',') : '255,255,255'},0.1)`,
                      border: `1px solid ${txn.color ? txn.color + '40' : 'rgba(255,255,255,0.1)'}`,
                    }}>
                      <i className={`bi ${txn.icon || 'bi-arrow-left-right'}`} style={{ color: txn.type === 'credit' ? '#10b981' : (txn.color || '#fff') }}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>
                        {txn.merchant}
                      </p>
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.75rem', marginBottom: 0 }}>
                        {txn.date} • {txn.id}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{
                        color: txn.type === 'credit' ? '#10b981' : '#f87171',
                        fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', marginBottom: 0,
                      }}>
                        {txn.type === 'credit' ? '+' : '-'}₹{Number(txn.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spending Chart */}
          <div className="col-lg-5">
            <div className="glass-card-solid p-4 fade-in-up animate-delay-4">
              <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>
                Monthly Spending
              </h5>
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.78rem', marginBottom: 24 }}>
                Feb 2026 overview
              </p>
              {/* Simple bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, marginBottom: 12 }}>
                {[
                  { label: 'Sep', h: '40%', color: '#00d4aa' },
                  { label: 'Oct', h: '65%', color: '#00d4aa' },
                  { label: 'Nov', h: '50%', color: '#00d4aa' },
                  { label: 'Dec', h: '90%', color: '#f59e0b' },
                  { label: 'Jan', h: '55%', color: '#00d4aa' },
                  { label: 'Feb', h: '42%', color: '#7dd3fc' },
                ].map(bar => (
                  <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      height: bar.h,
                      background: `linear-gradient(180deg, ${bar.color}, ${bar.color}40)`,
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.6s ease',
                    }} />
                    <span style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', fontFamily: 'Syne' }}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="stat-row">
                <span style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.82rem' }}>Avg Monthly</span>
                <span style={{ color: '#00d4aa', fontWeight: 700, fontFamily: 'Syne' }}>₹22,450</span>
              </div>
              <div className="stat-row">
                <span style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.82rem' }}>Highest Month</span>
                <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'Syne' }}>₹38,200 (Dec)</span>
              </div>

              {/* Category breakdown */}
              <div className="mt-3">
                <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.78rem', marginBottom: 10 }}>Top Categories</p>
                {[
                  { label: 'Food', pct: 35, color: '#fb923c' },
                  { label: 'Shopping', pct: 28, color: '#c084fc' },
                  { label: 'Transport', pct: 18, color: '#60a5fa' },
                ].map(cat => (
                  <div key={cat.label} className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ color: 'rgba(240,244,255,0.6)', fontSize: '0.78rem' }}>{cat.label}</span>
                      <span style={{ color: cat.color, fontSize: '0.78rem', fontWeight: 600 }}>{cat.pct}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4 }}>
                      <div style={{ width: `${cat.pct}%`, height: '100%', borderRadius: 4, background: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Cards */}
        <div className="mt-4 mb-2 fade-in-up animate-delay-4">
          <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>
            Financial Tools
          </h5>
          <div className="row g-3">
            {[
              { to: '/loan-calculator', icon: 'bi-calculator-fill', title: 'Loan EMI Calculator', desc: 'Plan your loan repayments with amortization schedule', color: '#7dd3fc' },
              { to: '/fd-calculator', icon: 'bi-bank2', title: 'Fixed Deposit', desc: 'Calculate FD maturity with compound interest', color: '#f59e0b' },
              { to: '/rd-calculator', icon: 'bi-piggy-bank-fill', title: 'Recurring Deposit', desc: 'Plan your monthly savings and RD returns', color: '#c084fc' },
              { to: '/expenses', icon: 'bi-wallet2', title: 'Expense Tracker', desc: 'Track, categorize, and analyze your spending', color: '#fb923c' },
            ].map(({ to, icon, title, desc, color }) => (
              <div key={to} className="col-md-6 col-lg-3">
                <Link to={to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    padding: 20,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${color}10`
                      e.currentTarget.style.borderColor = `${color}40`
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 12,
                    }}>
                      <i className={`bi ${icon}`} style={{ color, fontSize: '1.2rem' }}></i>
                    </div>
                    <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 6, fontSize: '0.9rem' }}>
                      {title}
                    </h6>
                    <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.78rem', marginBottom: 0 }}>
                      {desc}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
