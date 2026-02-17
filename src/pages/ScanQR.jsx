import React, { useState, useRef } from 'react'
import { generateTxnId, formatDate, getRandomMerchant, saveToStorage, loadFromStorage } from '../utils/helpers'

// Step constants
const STEPS = { HOME: 'home', SCANNING: 'scanning', PAYMENT: 'payment', SUCCESS: 'success' }

const ScanQR = () => {
  const [step, setStep] = useState(STEPS.HOME)
  const [merchant, setMerchant] = useState(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [txnResult, setTxnResult] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  // Simulate QR scan with mock data
  const handleScan = () => {
    setStep(STEPS.SCANNING)
    setTimeout(() => {
      setMerchant(getRandomMerchant())
      setStep(STEPS.PAYMENT)
    }, 2500)
  }

  // Handle file upload (simulate QR read)
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setStep(STEPS.SCANNING)
    setTimeout(() => {
      setMerchant(getRandomMerchant())
      setStep(STEPS.PAYMENT)
    }, 1500)
  }

  const handlePay = () => {
    setError('')
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    if (parseFloat(amount) > 500000) {
      setError('Amount exceeds daily limit of ₹5,00,000.')
      return
    }

    const txnId = generateTxnId()
    const result = {
      id: txnId,
      merchant: merchant.merchantName,
      upiId: merchant.upiId,
      amount: parseFloat(amount),
      note,
      status: 'SUCCESS',
      dateTime: formatDate(),
    }

    // Store transaction in localStorage
    const existing = loadFromStorage('payflow_transactions', [])
    saveToStorage('payflow_transactions', [result, ...existing].slice(0, 50))

    setTxnResult(result)
    setStep(STEPS.SUCCESS)
  }

  const handleReset = () => {
    setStep(STEPS.HOME)
    setMerchant(null)
    setAmount('')
    setNote('')
    setTxnResult(null)
    setError('')
  }

  const downloadReceipt = () => {
    if (!txnResult) return
    const receiptText = `
============================
     PAYFLOW RECEIPT
============================
Transaction ID: ${txnResult.id}
Date & Time:    ${txnResult.dateTime}
Status:         ✅ ${txnResult.status}
----------------------------
Merchant:       ${txnResult.merchant}
UPI ID:         ${txnResult.upiId}
Amount:         ₹${txnResult.amount.toLocaleString('en-IN')}
Note:           ${txnResult.note || 'N/A'}
============================
    Thank you for using PayFlow!
============================
    `.trim()

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PayFlow_Receipt_${txnResult.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ====== STEP: HOME ======
  if (step === STEPS.HOME) {
    return (
      <div>
        <div className="page-header">
          <div className="container-lg">
            <p className="page-subtitle"><i className="bi bi-qr-code-scan me-2"></i>UPI Payment</p>
            <h1 className="page-title">Scan & Pay</h1>
          </div>
        </div>

        <div className="container-lg py-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="glass-card-solid p-5 text-center fade-in-up">
                {/* QR Illustration */}
                <div style={{
                  width: 120, height: 120, margin: '0 auto 28px',
                  borderRadius: 24,
                  background: 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(10,36,99,0.5))',
                  border: '1px solid rgba(0,212,170,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <i className="bi bi-qr-code" style={{ fontSize: '3.5rem', color: '#00d4aa' }}></i>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, transparent, #00d4aa, transparent)',
                    boxShadow: '0 0 12px #00d4aa',
                    animation: 'scan-line 2.5s ease-in-out infinite',
                  }} />
                </div>

                <h4 style={{ fontFamily: 'Syne', fontWeight: 800, color: '#f0f4ff', marginBottom: 8 }}>
                  Ready to Pay?
                </h4>
                <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.88rem', marginBottom: 32 }}>
                  Scan any UPI QR code or upload one from your gallery to make a quick and secure payment.
                </p>

                {/* Scan Button */}
                <button className="btn-accent w-100 mb-3" onClick={handleScan} style={{ fontSize: '1rem', padding: '14px' }}>
                  <i className="bi bi-camera-fill me-2"></i>Scan QR Code
                </button>

                {/* Upload Button */}
                <button
                  className="btn-outline-accent w-100"
                  onClick={() => fileRef.current.click()}
                  style={{ padding: '13px' }}
                >
                  <i className="bi bi-upload me-2"></i>Upload QR Image
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

                <div style={{
                  marginTop: 28,
                  padding: '16px',
                  background: 'rgba(0,212,170,0.06)',
                  border: '1px solid rgba(0,212,170,0.15)',
                  borderRadius: 10,
                }}>
                  <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.78rem', marginBottom: 0 }}>
                    <i className="bi bi-shield-check me-2" style={{ color: '#00d4aa' }}></i>
                    256-bit encrypted • UPI 2.0 compliant • NPCI certified
                  </p>
                </div>
              </div>

              {/* Demo Note */}
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  color: '#f59e0b',
                  borderRadius: 8, padding: '6px 16px',
                  fontSize: '0.75rem', fontWeight: 600,
                }}>
                  <i className="bi bi-info-circle me-1"></i>Demo Mode — Uses simulated QR data
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ====== STEP: SCANNING ======
  if (step === STEPS.SCANNING) {
    return (
      <div className="container-lg py-5 text-center">
        <div className="glass-card-solid p-5 mx-auto" style={{ maxWidth: 400 }}>
          <div className="qr-viewport mb-4">
            <div className="qr-corner qr-corner-tl" />
            <div className="qr-corner qr-corner-tr" />
            <div className="qr-corner qr-corner-bl" />
            <div className="qr-corner qr-corner-br" />
            <div className="scan-line" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <i className="bi bi-qr-code" style={{ fontSize: '5rem', color: 'rgba(0,212,170,0.3)' }}></i>
              </div>
            </div>
          </div>
          <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 8 }}>
            Scanning QR Code...
          </h5>
          <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.85rem' }}>
            Please hold steady
          </p>
          <div className="d-flex justify-content-center gap-1 mt-3">
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#00d4aa',
                animation: `pulse-glow 1s ease-in-out ${i * 0.3}s infinite`,
              }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ====== STEP: PAYMENT ======
  if (step === STEPS.PAYMENT) {
    return (
      <div>
        <div className="page-header">
          <div className="container-lg">
            <p className="page-subtitle"><i className="bi bi-credit-card-fill me-2"></i>Payment</p>
            <h1 className="page-title">Enter Details</h1>
          </div>
        </div>

        <div className="container-lg py-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              {/* Merchant Info */}
              <div className="result-card mb-4 fade-in-up">
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: 'linear-gradient(135deg, #00d4aa, #0a2463)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', flexShrink: 0,
                  }}>
                    <i className="bi bi-shop-window" style={{ color: '#fff' }}></i>
                  </div>
                  <div>
                    <h5 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 2 }}>
                      {merchant?.merchantName}
                    </h5>
                    <p style={{ color: 'rgba(0,212,170,0.8)', fontSize: '0.82rem', marginBottom: 2 }}>
                      <i className="bi bi-upc me-1"></i>{merchant?.upiId}
                    </p>
                    <span style={{
                      background: 'rgba(0,212,170,0.1)', color: '#00d4aa',
                      border: '1px solid rgba(0,212,170,0.2)',
                      borderRadius: 5, padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600,
                    }}>
                      {merchant?.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="glass-card-solid p-4 fade-in-up animate-delay-1">
                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 10, padding: '12px 16px', marginBottom: 16,
                    color: '#f87171', fontSize: '0.85rem',
                  }}>
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label-dark">Amount (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                      color: '#00d4aa', fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem',
                    }}>₹</span>
                    <input
                      type="number"
                      className="form-control-dark"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      style={{ paddingLeft: 36, fontSize: '1.2rem', fontFamily: 'Syne', fontWeight: 700 }}
                      min="1"
                      max="500000"
                    />
                  </div>
                </div>

                {/* Quick amounts */}
                <div className="d-flex gap-2 mb-4">
                  {[100, 200, 500, 1000].map(v => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      style={{
                        flex: 1, padding: '8px 4px',
                        background: amount == v ? 'rgba(0,212,170,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${amount == v ? 'rgba(0,212,170,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 8,
                        color: amount == v ? '#00d4aa' : 'rgba(240,244,255,0.6)',
                        fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      ₹{v}
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="form-label-dark">Add Note (optional)</label>
                  <input
                    type="text"
                    className="form-control-dark"
                    placeholder="e.g. Grocery, Dinner, etc."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>

                <button className="btn-accent w-100" onClick={handlePay} style={{ fontSize: '1rem', padding: '14px' }}>
                  <i className="bi bi-lock-fill me-2"></i>Pay Securely
                </button>

                <button onClick={handleReset} style={{
                  width: '100%', marginTop: 12, padding: '10px',
                  background: 'transparent', border: 'none',
                  color: 'rgba(240,244,255,0.4)', fontSize: '0.85rem', cursor: 'pointer',
                }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ====== STEP: SUCCESS ======
  if (step === STEPS.SUCCESS) {
    return (
      <div className="container-lg py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="glass-card-solid p-5 text-center fade-in-up">
              <div className="success-circle mb-4">
                <i className="bi bi-check-lg" style={{ color: '#000', fontSize: '2.5rem', fontWeight: 900 }}></i>
              </div>

              <h3 style={{ fontFamily: 'Syne', fontWeight: 800, color: '#f0f4ff', marginBottom: 6 }}>
                Payment Successful!
              </h3>
              <p style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.88rem', marginBottom: 32 }}>
                Your payment was processed securely via UPI
              </p>

              {/* Amount */}
              <div style={{
                padding: '16px',
                background: 'rgba(0,212,170,0.06)',
                border: '1px solid rgba(0,212,170,0.15)',
                borderRadius: 12, marginBottom: 24,
              }}>
                <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.78rem', marginBottom: 4 }}>Amount Paid</p>
                <p style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.2rem', color: '#00d4aa', marginBottom: 0 }}>
                  ₹{Number(txnResult?.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Details */}
              <div style={{ textAlign: 'left' }}>
                {[
                  { label: 'Transaction ID', value: txnResult?.id },
                  { label: 'Merchant', value: txnResult?.merchant },
                  { label: 'UPI ID', value: txnResult?.upiId },
                  { label: 'Date & Time', value: txnResult?.dateTime },
                  { label: 'Note', value: txnResult?.note || 'N/A' },
                  { label: 'Status', value: '✅ SUCCESS', isStatus: true },
                ].map(({ label, value, isStatus }) => (
                  <div key={label} className="stat-row">
                    <span style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.82rem' }}>{label}</span>
                    <span style={{
                      color: isStatus ? '#10b981' : 'rgba(240,244,255,0.85)',
                      fontSize: '0.82rem', fontWeight: isStatus ? 700 : 500,
                      fontFamily: isStatus ? 'Syne' : 'inherit',
                      maxWidth: '55%', textAlign: 'right', wordBreak: 'break-all',
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-3 mt-4">
                <button className="btn-accent flex-1" onClick={downloadReceipt} style={{ flex: 1, padding: '12px 16px' }}>
                  <i className="bi bi-download me-2"></i>Receipt
                </button>
                <button className="btn-outline-accent flex-1" onClick={handleReset} style={{ flex: 1, padding: '12px 16px' }}>
                  <i className="bi bi-arrow-repeat me-2"></i>New Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ScanQR
