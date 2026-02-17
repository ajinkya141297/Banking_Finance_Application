import React, { useState } from 'react'
import { calculateRD, formatCurrency, formatINR } from '../utils/helpers'

const RDCalculator = () => {
  const [form, setForm] = useState({ monthly: '', rate: '', tenureValue: '', tenureUnit: 'months' })
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.monthly || parseFloat(form.monthly) <= 0) errs.monthly = 'Enter monthly deposit amount'
    if (!form.rate || parseFloat(form.rate) <= 0) errs.rate = 'Enter valid interest rate'
    if (!form.tenureValue || parseInt(form.tenureValue) <= 0) errs.tenureValue = 'Enter valid tenure'
    return errs
  }

  const handleCalculate = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const months = form.tenureUnit === 'years'
      ? parseInt(form.tenureValue) * 12
      : parseInt(form.tenureValue)

    const res = calculateRD(form.monthly, form.rate, months)
    if (res) setResult({ ...res, months, monthlyDeposit: parseFloat(form.monthly) })
  }

  // Monthly growth table
  const getMonthlyGrowth = () => {
    if (!result) return []
    const R = result.monthlyDeposit
    const annualR = parseFloat(form.rate) / 100
    const monthlyRate = annualR / 12
    const rows = []
    let total = 0

    for (let i = 1; i <= result.months; i++) {
      total += R * Math.pow(1 + monthlyRate, result.months - i + 1)
      const invested = R * i
      rows.push({ month: i, invested, maturity: total })
    }

    // Return quarterly snapshots
    const snapshots = []
    for (let i = 2; i < rows.length; i += Math.max(1, Math.floor(rows.length / 5))) {
      snapshots.push(rows[i])
    }
    snapshots.push(rows[rows.length - 1])
    return snapshots.slice(0, 6)
  }

  return (
    <div>
      <div className="page-header">
        <div className="container-lg">
          <p className="page-subtitle"><i className="bi bi-piggy-bank-fill me-2"></i>Investment Calculator</p>
          <h1 className="page-title">Recurring Deposit Calculator</h1>
          <p style={{ color: 'rgba(240,244,255,0.5)', marginTop: 6, fontSize: '0.88rem' }}>
            Plan your monthly savings and watch your wealth grow
          </p>
        </div>
      </div>

      <div className="container-lg py-5">
        <div className="row g-4">
          {/* Input */}
          <div className="col-lg-5">
            <div className="glass-card-solid p-4 fade-in-up">
              <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 24 }}>
                RD Details
              </h5>

              <div className="mb-3">
                <label className="form-label-dark">Monthly Investment (₹)</label>
                <input type="number" name="monthly" className="form-control-dark" placeholder="e.g. 5000" value={form.monthly} onChange={handleChange} />
                {errors.monthly && <small style={{ color: '#f87171' }}>{errors.monthly}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label-dark">Annual Interest Rate (%)</label>
                <input type="number" name="rate" className="form-control-dark" placeholder="e.g. 6.5" value={form.rate} onChange={handleChange} step="0.1" />
                {errors.rate && <small style={{ color: '#f87171' }}>{errors.rate}</small>}
              </div>

              <div className="mb-4">
                <label className="form-label-dark">Time Period</label>
                <div className="d-flex gap-2">
                  <input type="number" name="tenureValue" className="form-control-dark" placeholder="e.g. 24" value={form.tenureValue} onChange={handleChange} style={{ flex: 2 }} />
                  <select name="tenureUnit" className="form-control-dark" value={form.tenureUnit} onChange={handleChange} style={{ flex: 1 }}>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
                {errors.tenureValue && <small style={{ color: '#f87171' }}>{errors.tenureValue}</small>}
              </div>

              <button className="btn-accent w-100" onClick={handleCalculate} style={{ padding: '13px', background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff' }}>
                <i className="bi bi-piggy-bank me-2"></i>Calculate Maturity
              </button>

              <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 10 }}>
                <p style={{ color: 'rgba(168,85,247,0.9)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, fontFamily: 'Syne' }}>RD Formula (Compound Interest)</p>
                <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.72rem', marginBottom: 0, fontFamily: 'monospace' }}>
                  M = R × Σ (1 + i)^n, i = r/12
                </p>
              </div>

              {/* Quick Monthly Options */}
              <div className="mt-3">
                <p style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.72rem', marginBottom: 8 }}>Quick monthly amounts:</p>
                <div className="d-flex gap-2 flex-wrap">
                  {[1000, 2000, 5000, 10000].map(v => (
                    <button key={v} onClick={() => setForm(p => ({ ...p, monthly: v }))} style={{
                      flex: '1 1 calc(50% - 4px)',
                      padding: '7px 4px', background: form.monthly == v ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.monthly == v ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 7, color: form.monthly == v ? '#c084fc' : 'rgba(240,244,255,0.5)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      ₹{v.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-7">
            {!result ? (
              <div className="glass-card-solid p-5 text-center fade-in-up animate-delay-1" style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <i className="bi bi-piggy-bank" style={{ fontSize: '4rem', color: 'rgba(240,244,255,0.1)', marginBottom: 16 }}></i>
                <p style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.9rem' }}>Enter your RD details to see maturity value</p>
              </div>
            ) : (
              <div className="fade-in-up">
                {/* Main Result */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(10,36,99,0.5))',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: 16, padding: 28, marginBottom: 16, textAlign: 'center',
                }}>
                  <p style={{ color: 'rgba(192,132,252,0.8)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Syne', marginBottom: 8 }}>
                    Maturity Amount
                  </p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.4rem', color: '#c084fc', marginBottom: 8 }}>
                    {formatCurrency(result.maturityAmount)}
                  </p>
                  <span style={{
                    background: 'rgba(16,185,129,0.15)', color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 6, padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700,
                  }}>
                    {((result.interestEarned / result.totalInvested) * 100).toFixed(2)}% Returns on Investment
                  </span>
                </div>

                {/* Stats Row */}
                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Syne', marginBottom: 6 }}>Monthly</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#7dd3fc', fontSize: '1rem', marginBottom: 0 }}>₹{formatINR(result.monthlyDeposit)}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Syne', marginBottom: 6 }}>Invested</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', fontSize: '1rem', marginBottom: 0 }}>₹{formatINR(result.totalInvested)}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Syne', marginBottom: 6 }}>Interest</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#10b981', fontSize: '1rem', marginBottom: 0 }}>₹{formatINR(result.interestEarned)}</p>
                    </div>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="glass-card-solid p-4 mb-4">
                  <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Investment Breakdown</h6>
                  <div style={{ borderRadius: 8, overflow: 'hidden', height: 14, display: 'flex' }}>
                    <div style={{
                      width: `${(result.totalInvested / result.maturityAmount) * 100}%`,
                      background: 'linear-gradient(90deg, #7dd3fc, #0ea5e9)',
                    }} />
                    <div style={{
                      width: `${(result.interestEarned / result.maturityAmount) * 100}%`,
                      background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
                    }} />
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: '#7dd3fc' }} />
                      <span style={{ color: 'rgba(240,244,255,0.6)', fontSize: '0.78rem' }}>
                        Invested ({((result.totalInvested / result.maturityAmount) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: '#a855f7' }} />
                      <span style={{ color: 'rgba(240,244,255,0.6)', fontSize: '0.78rem' }}>
                        Earnings ({((result.interestEarned / result.maturityAmount) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Growth Table */}
                <div className="glass-card-solid p-4">
                  <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>
                    Growth Milestones
                  </h6>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr>
                          {['Month', 'Invested', 'Maturity Value', 'Interest So Far'].map(h => (
                            <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Month' ? 'left' : 'right', color: 'rgba(240,244,255,0.4)', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getMonthlyGrowth().map((row, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '10px 10px', color: 'rgba(240,244,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{row.month}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', color: '#7dd3fc', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>₹{formatINR(row.invested)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', color: '#c084fc', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>₹{formatINR(row.maturity)}</td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', color: '#10b981', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>₹{formatINR(row.maturity - row.invested)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RDCalculator
