import React, { useState } from 'react'
import { calculateFD, formatCurrency, formatINR } from '../utils/helpers'

const FDCalculator = () => {
  const [form, setForm] = useState({
    principal: '',
    rate: '',
    tenureValue: '',
    tenureUnit: 'years',
    compoundFreq: '4', // quarterly
  })
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})

  const compoundOptions = [
    { value: '1', label: 'Yearly' },
    { value: '2', label: 'Half-Yearly' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.principal || parseFloat(form.principal) <= 0) errs.principal = 'Enter a valid deposit amount'
    if (!form.rate || parseFloat(form.rate) <= 0) errs.rate = 'Enter a valid interest rate'
    if (!form.tenureValue || parseFloat(form.tenureValue) <= 0) errs.tenureValue = 'Enter valid tenure'
    return errs
  }

  const handleCalculate = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const tenureInYears = form.tenureUnit === 'months'
      ? parseFloat(form.tenureValue) / 12
      : parseFloat(form.tenureValue)

    const res = calculateFD(form.principal, form.rate, tenureInYears, form.compoundFreq)
    if (res) setResult({ ...res, principal: parseFloat(form.principal), tenureInYears })
  }

  const pctGrowth = result ? ((result.maturityAmount - result.principal) / result.principal) * 100 : 0

  return (
    <div>
      <div className="page-header">
        <div className="container-lg">
          <p className="page-subtitle"><i className="bi bi-bank2 me-2"></i>Investment Calculator</p>
          <h1 className="page-title">Fixed Deposit Calculator</h1>
          <p style={{ color: 'rgba(240,244,255,0.5)', marginTop: 6, fontSize: '0.88rem' }}>
            Calculate FD returns with compound interest (A = P × (1 + r/n)^(nt))
          </p>
        </div>
      </div>

      <div className="container-lg py-5">
        <div className="row g-4">
          {/* Input */}
          <div className="col-lg-5">
            <div className="glass-card-solid p-4 fade-in-up">
              <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 24 }}>
                FD Details
              </h5>

              <div className="mb-3">
                <label className="form-label-dark">Deposit Amount (₹)</label>
                <input type="number" name="principal" className="form-control-dark" placeholder="e.g. 100000" value={form.principal} onChange={handleChange} />
                {errors.principal && <small style={{ color: '#f87171' }}>{errors.principal}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label-dark">Annual Interest Rate (%)</label>
                <input type="number" name="rate" className="form-control-dark" placeholder="e.g. 7.1" value={form.rate} onChange={handleChange} step="0.1" />
                {errors.rate && <small style={{ color: '#f87171' }}>{errors.rate}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label-dark">Tenure</label>
                <div className="d-flex gap-2">
                  <input type="number" name="tenureValue" className="form-control-dark" placeholder="e.g. 3" value={form.tenureValue} onChange={handleChange} style={{ flex: 2 }} />
                  <select name="tenureUnit" className="form-control-dark" value={form.tenureUnit} onChange={handleChange} style={{ flex: 1 }}>
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                {errors.tenureValue && <small style={{ color: '#f87171' }}>{errors.tenureValue}</small>}
              </div>

              <div className="mb-4">
                <label className="form-label-dark">Compounding Frequency</label>
                <div className="d-flex gap-2 flex-wrap">
                  {compoundOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setForm(prev => ({ ...prev, compoundFreq: opt.value }))}
                      style={{
                        flex: '1 1 calc(50% - 4px)',
                        padding: '9px 8px',
                        background: form.compoundFreq === opt.value ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.compoundFreq === opt.value ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8,
                        color: form.compoundFreq === opt.value ? '#f59e0b' : 'rgba(240,244,255,0.6)',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: 'Syne',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-accent w-100" onClick={handleCalculate} style={{ padding: '13px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000' }}>
                <i className="bi bi-graph-up-arrow me-2"></i>Calculate Returns
              </button>

              <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10 }}>
                <p style={{ color: 'rgba(245,158,11,0.8)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4, fontFamily: 'Syne' }}>FD Formula</p>
                <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.72rem', marginBottom: 0, fontFamily: 'monospace' }}>
                  A = P × (1 + r/n)^(n×t)
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-lg-7">
            {!result ? (
              <div className="glass-card-solid p-5 text-center fade-in-up animate-delay-1" style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <i className="bi bi-bank2" style={{ fontSize: '4rem', color: 'rgba(240,244,255,0.1)', marginBottom: 16 }}></i>
                <p style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.9rem' }}>Fill in your FD details to see returns</p>
              </div>
            ) : (
              <div className="fade-in-up">
                {/* Maturity Value */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(10,36,99,0.5))',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 16, padding: 28, marginBottom: 16, textAlign: 'center',
                }}>
                  <p style={{ color: 'rgba(245,158,11,0.8)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Syne', marginBottom: 8 }}>
                    Maturity Value
                  </p>
                  <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.4rem', color: '#f59e0b', marginBottom: 4 }}>
                    {formatCurrency(result.maturityAmount)}
                  </p>
                  <span style={{
                    background: 'rgba(16,185,129,0.15)', color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 6, padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700,
                  }}>
                    +{pctGrowth.toFixed(2)}% Growth
                  </span>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne', marginBottom: 6 }}>Principal</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#7dd3fc', fontSize: '1.1rem', marginBottom: 0 }}>
                        ₹{formatINR(result.principal)}
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="glass-card-solid p-3 text-center">
                      <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne', marginBottom: 6 }}>Interest Earned</p>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#10b981', fontSize: '1.1rem', marginBottom: 0 }}>
                        ₹{formatINR(result.interestEarned)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Growth Visualization */}
                <div className="glass-card-solid p-4 mb-4">
                  <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>
                    Growth Over Time
                  </h6>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
                    {Array.from({ length: Math.min(Math.ceil(result.tenureInYears), 10) }, (_, i) => {
                      const yr = i + 1
                      const progress = yr / Math.max(result.tenureInYears, 1)
                      const val = result.principal * Math.pow(1 + parseFloat(form.rate) / 100 / parseInt(form.compoundFreq), parseInt(form.compoundFreq) * Math.min(yr, result.tenureInYears))
                      const pct = ((val - result.principal) / result.interestEarned) * 100
                      return (
                        <div key={yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{
                            width: '100%',
                            height: `${Math.max(5, Math.min(100, pct))}%`,
                            background: `linear-gradient(180deg, #f59e0b, rgba(245,158,11,0.3))`,
                            borderRadius: '4px 4px 0 0',
                          }} />
                          <span style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.65rem', fontFamily: 'Syne' }}>Y{yr}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="glass-card-solid p-4">
                  <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Summary</h6>
                  {[
                    { label: 'Deposit Amount', value: `₹${formatINR(result.principal)}`, color: '#f0f4ff' },
                    { label: 'Annual Rate', value: `${form.rate}%`, color: '#f59e0b' },
                    { label: 'Compounding', value: compoundOptions.find(o => o.value === form.compoundFreq)?.label, color: '#7dd3fc' },
                    { label: 'Tenure', value: `${form.tenureValue} ${form.tenureUnit}`, color: '#f0f4ff' },
                    { label: 'Interest Earned', value: formatCurrency(result.interestEarned), color: '#10b981' },
                    { label: 'Maturity Value', value: formatCurrency(result.maturityAmount), color: '#f59e0b', bold: true },
                  ].map(({ label, value, color, bold }) => (
                    <div key={label} className="stat-row">
                      <span style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.82rem' }}>{label}</span>
                      <span style={{ color, fontWeight: bold ? 700 : 500, fontFamily: bold ? 'Syne' : 'inherit', fontSize: bold ? '0.95rem' : '0.85rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FDCalculator
