import React, { useState } from 'react'
import { calculateEMI, formatCurrency, formatINR } from '../utils/helpers'

const LoanCalculator = () => {
  const [form, setForm] = useState({ principal: '', rate: '', tenureValue: '', tenureUnit: 'years' })
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.principal || parseFloat(form.principal) <= 0) errs.principal = 'Enter a valid loan amount'
    if (!form.rate || parseFloat(form.rate) <= 0 || parseFloat(form.rate) > 50) errs.rate = 'Rate must be 0-50%'
    if (!form.tenureValue || parseInt(form.tenureValue) <= 0) errs.tenureValue = 'Enter valid tenure'
    return errs
  }

  const handleCalculate = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Convert tenure to months
    const months = form.tenureUnit === 'years' ? parseInt(form.tenureValue) * 12 : parseInt(form.tenureValue)
    const res = calculateEMI(form.principal, form.rate, months)
    if (res) setResult({ ...res, months, principal: parseFloat(form.principal) })
  }

  // Build amortization table (first 6 months + last month)
  const getAmortizationRows = () => {
    if (!result) return []
    const P = result.principal
    const annualR = parseFloat(form.rate)
    const R = annualR / 12 / 100
    const EMI = result.emi

    const rows = []
    let balance = P

    for (let i = 1; i <= result.months; i++) {
      const interestForMonth = balance * R
      const principalForMonth = EMI - interestForMonth
      balance = Math.max(0, balance - principalForMonth)
      rows.push({
        month: i,
        emi: EMI,
        principal: principalForMonth,
        interest: interestForMonth,
        balance,
      })
    }
    // Return first 5 and last row
    const preview = rows.slice(0, 5)
    if (rows.length > 5) preview.push({ ...rows[rows.length - 1], isLast: true })
    return preview
  }

  const pctPrincipal = result ? (result.principal / result.totalPayment) * 100 : 0
  const pctInterest = result ? (result.totalInterest / result.totalPayment) * 100 : 0

  return (
    <div>
      <div className="page-header">
        <div className="container-lg">
          <p className="page-subtitle"><i className="bi bi-calculator-fill me-2"></i>Financial Tools</p>
          <h1 className="page-title">Loan EMI Calculator</h1>
          <p style={{ color: 'rgba(240,244,255,0.5)', marginTop: 6, fontSize: '0.88rem' }}>
            Calculate your monthly EMI with full amortization breakdown
          </p>
        </div>
      </div>

      <div className="container-lg py-5">
        <div className="row g-4">
          {/* Input Form */}
          <div className="col-lg-5">
            <div className="glass-card-solid p-4 fade-in-up">
              <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 24 }}>
                Loan Details
              </h5>

              <div className="mb-3">
                <label className="form-label-dark">Loan Amount (₹)</label>
                <input style={{marginLeft:'15px'}}
                  type="number"
                  name="principal"
                  className="form-control-dark"
                  placeholder="e.g. 500000 ₹"
                  value={form.principal}
                  onChange={handleChange}
                />
                {errors.principal && <small style={{ color: '#f87171' }}>{errors.principal}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label-dark">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  name="rate"
                  className="form-control-dark"
                  placeholder="e.g. 8.5 %"
                  value={form.rate}
                  onChange={handleChange}
                  step="0.1"
                />
                {errors.rate && <small style={{ color: '#f87171' }}>{errors.rate}</small>}
              </div>

              <div className="mb-4">
                <label className="form-label-dark">Loan Tenure</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    name="tenureValue"
                    className="form-control-dark"
                    placeholder="e.g. 5 years"
                    value={form.tenureValue}
                    onChange={handleChange}
                    style={{ flex: 2 }}
                  />
                  <select
                    name="tenureUnit"
                    className="form-control-dark"
                    value={form.tenureUnit}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                {errors.tenureValue && <small style={{ color: '#f87171' }}>{errors.tenureValue}</small>}
              </div>

              <button className="btn-accent w-100" onClick={handleCalculate} style={{ padding: '13px' }}>
                <i className="bi bi-calculator me-2"></i>Calculate EMI
              </button>

              {/* EMI Formula Info */}
              <div style={{
                marginTop: 20, padding: '14px',
                background: 'rgba(125,211,252,0.06)',
                border: '1px solid rgba(125,211,252,0.15)',
                borderRadius: 10,
              }}>
                <p style={{ color: 'rgba(125,211,252,0.9)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, fontFamily: 'Syne' }}>
                  EMI Formula
                </p>
                <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.75rem', marginBottom: 0, fontFamily: 'monospace' }}>
                  EMI = P × R × (1+R)^N / ((1+R)^N - 1)
                </p>
                <p style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.7rem', marginBottom: 0, marginTop: 4 }}>
                  P = Principal Loan Amount, <br></br> 
                  R = Monthly Interest Rate, <br></br> 
                  N = Number of Monthly/years Installments
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-7">
            {!result ? (
              <div className="glass-card-solid p-5 text-center fade-in-up animate-delay-1" style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <i className="bi bi-calculator" style={{ fontSize: '4rem', color: 'rgba(240,244,255,0.1)', marginBottom: 16 }}></i>
                <p style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.9rem' }}>Enter loan details and click Calculate</p>
              </div>
            ) : (
              <div className="fade-in-up">
                {/* Main Result */}
                <div className="result-card mb-4">
                  <div className="row g-3 text-center">
                    <div className="col-12">
                      <p className="result-label">Monthly EMI</p>
                      <p className="result-value">{formatCurrency(result.emi)}</p>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne', marginBottom: 6 }}>Principal</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#7dd3fc', fontSize: '1rem', marginBottom: 0 }}>₹{formatINR(result.principal)}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne', marginBottom: 6 }}>Interest</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f87171', fontSize: '1rem', marginBottom: 0 }}>₹{formatINR(result.totalInterest)}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne', marginBottom: 6 }}>Total</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#00d4aa', fontSize: '1rem', marginBottom: 0 }}>₹{formatINR(result.totalPayment)}</p>
                    </div>
                  </div>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="glass-card-solid p-4 mb-4">
                  <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Payment Breakdown</h6>
                  <div style={{ borderRadius: 8, overflow: 'hidden', height: 14, display: 'flex' }}>
                    <div style={{ width: `${pctPrincipal}%`, background: 'linear-gradient(90deg, #7dd3fc, #0ea5e9)', transition: 'width 0.8s ease' }} />
                    <div style={{ width: `${pctInterest}%`, background: 'linear-gradient(90deg, #f87171, #ef4444)', transition: 'width 0.8s ease' }} />
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: '#7dd3fc' }} />
                      <span style={{ color: 'rgba(240,244,255,0.6)', fontSize: '0.78rem' }}>
                        Principal ({pctPrincipal.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: '#f87171' }} />
                      <span style={{ color: 'rgba(240,244,255,0.6)', fontSize: '0.78rem' }}>
                        Interest ({pctInterest.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amortization Table */}
                <div className="glass-card-solid p-4">
                  <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>
                    Amortization Schedule <span style={{ color: 'rgba(240,244,255,0.3)', fontWeight: 400, fontSize: '0.78rem' }}>(First 5 months)</span>
                  </h6>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr>
                          {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                            <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Month' ? 'left' : 'right', color: 'rgba(240,244,255,0.4)', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getAmortizationRows().map((row, idx) => (
                          <React.Fragment key={idx}>
                            {row.isLast && (
                              <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '8px', color: 'rgba(240,244,255,0.2)', fontSize: '0.75rem' }}>
                                  ···
                                </td>
                              </tr>
                            )}
                            <tr style={{ background: row.isLast ? 'rgba(0,212,170,0.05)' : 'transparent' }}>
                              <td style={{ padding: '10px 10px', color: 'rgba(240,244,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                {row.isLast ? result.months : row.month}
                              </td>
                              <td style={{ padding: '10px 10px', textAlign: 'right', color: '#f0f4ff', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                ₹{formatINR(row.emi)}
                              </td>
                              <td style={{ padding: '10px 10px', textAlign: 'right', color: '#7dd3fc', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                ₹{formatINR(row.principal)}
                              </td>
                              <td style={{ padding: '10px 10px', textAlign: 'right', color: '#f87171', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                ₹{formatINR(row.interest)}
                              </td>
                              <td style={{ padding: '10px 10px', textAlign: 'right', color: 'rgba(240,244,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                ₹{formatINR(row.balance)}
                              </td>
                            </tr>
                          </React.Fragment>
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

export default LoanCalculator
