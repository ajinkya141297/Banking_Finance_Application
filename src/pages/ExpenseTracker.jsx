import React, { useState, useEffect } from 'react'
import { saveToStorage, loadFromStorage, getTodayString, EXPENSE_CATEGORIES, getCategoryInfo } from '../utils/helpers'

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ description: '', amount: '', category: 'food', date: getTodayString() })
  const [errors, setErrors] = useState({})
  const [filterCat, setFilterCat] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage('payflow_expenses', [])
    setExpenses(stored)
  }, [])

  // Save to localStorage when expenses change
  useEffect(() => {
    saveToStorage('payflow_expenses', expenses)
  }, [expenses])

  const validate = () => {
    const errs = {}
    if (!form.description.trim()) errs.description = 'Enter a description'
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Enter a valid amount'
    if (!form.date) errs.date = 'Select a date'
    return errs
  }

  const handleAdd = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const newExpense = {
      id: Date.now().toString(),
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
    }

    setExpenses(prev => [newExpense, ...prev])
    setForm({ description: '', amount: '', category: 'food', date: getTodayString() })
    setErrors({})
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    setDeleteId(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Filter expenses
  const filtered = filterCat === 'all' ? expenses : expenses.filter(e => e.category === filterCat)

  // Total spending
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const filteredTotal = filtered.reduce((sum, e) => sum + e.amount, 0)

  // Category totals for chart
  const catTotals = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  const maxCatTotal = Math.max(...catTotals.map(c => c.total), 1)

  return (
    <div>
      <div className="page-header">
        <div className="container-lg">
          <p className="page-subtitle"><i className="bi bi-wallet2 me-2"></i>Financial Tracking</p>
          <h1 className="page-title">Expense Tracker</h1>
          <p style={{ color: 'rgba(240,244,255,0.5)', marginTop: 6, fontSize: '0.88rem' }}>
            Track, categorize and analyze your spending habits
          </p>
        </div>
      </div>

      <div className="container-lg py-4">
        {/* Stats Bar */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="glass-card-solid p-3 text-center">
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne', marginBottom: 6 }}>Total Spent</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, color: '#f87171', fontSize: '1.1rem', marginBottom: 0 }}>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-card-solid p-3 text-center">
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne', marginBottom: 6 }}>Transactions</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, color: '#00d4aa', fontSize: '1.1rem', marginBottom: 0 }}>{expenses.length}</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-card-solid p-3 text-center">
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne', marginBottom: 6 }}>Avg / Day</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, color: '#7dd3fc', fontSize: '1.1rem', marginBottom: 0 }}>
                ₹{expenses.length ? (total / Math.max(1, new Set(expenses.map(e => e.date)).size)).toFixed(0) : 0}
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-card-solid p-3 text-center">
              <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Syne', marginBottom: 6 }}>Categories</p>
              <p style={{ fontFamily: 'Syne', fontWeight: 800, color: '#c084fc', fontSize: '1.1rem', marginBottom: 0 }}>
                {new Set(expenses.map(e => e.category)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Left: Chart + Add */}
          <div className="col-lg-4">
            {/* Add Expense Button */}
            <button
              className="btn-accent w-100 mb-4"
              onClick={() => setShowForm(!showForm)}
              style={{ padding: '13px', fontSize: '0.95rem' }}
            >
              <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
              {showForm ? 'Cancel' : 'Add Expense'}
            </button>

            {/* Add Form */}
            {showForm && (
              <div className="glass-card-solid p-4 mb-4 fade-in-up">
                <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 20 }}>New Expense</h6>

                <div className="mb-3">
                  <label className="form-label-dark">Description</label>
                  <input type="text" name="description" className="form-control-dark" placeholder="e.g. Lunch at Cafe" value={form.description} onChange={handleChange} />
                  {errors.description && <small style={{ color: '#f87171' }}>{errors.description}</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label-dark">Amount (₹)</label>
                  <input type="number" name="amount" className="form-control-dark" placeholder="0.00" value={form.amount} onChange={handleChange} min="0" />
                  {errors.amount && <small style={{ color: '#f87171' }}>{errors.amount}</small>}
                </div>

                <div className="mb-3">
                  <label className="form-label-dark">Category</label>
                  <select name="category" className="form-control-dark" value={form.category} onChange={handleChange}>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label-dark">Date</label>
                  <input type="date" name="date" className="form-control-dark" value={form.date} onChange={handleChange} />
                  {errors.date && <small style={{ color: '#f87171' }}>{errors.date}</small>}
                </div>

                <button className="btn-accent w-100" onClick={handleAdd} style={{ padding: '12px' }}>
                  <i className="bi bi-check-lg me-2"></i>Add Expense
                </button>
              </div>
            )}

            {/* Category Chart */}
            {catTotals.length > 0 && (
              <div className="glass-card-solid p-4">
                <h6 style={{ fontFamily: 'Syne', fontWeight: 700, color: '#f0f4ff', marginBottom: 20 }}>By Category</h6>
                <div className="d-flex flex-column gap-3">
                  {catTotals.map(cat => (
                    <div key={cat.value}>
                      <div className="d-flex justify-content-between mb-1">
                        <span style={{ color: 'rgba(240,244,255,0.7)', fontSize: '0.82rem' }}>{cat.label}</span>
                        <span style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'Syne' }}>
                          ₹{cat.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div style={{
                          width: `${(cat.total / maxCatTotal) * 100}%`,
                          height: '100%', borderRadius: 4,
                          background: cat.value === 'food' ? '#fb923c'
                            : cat.value === 'transport' ? '#60a5fa'
                            : cat.value === 'shopping' ? '#c084fc'
                            : cat.value === 'health' ? '#f87171'
                            : cat.value === 'entertainment' ? '#f472b6'
                            : cat.value === 'utilities' ? '#2dd4bf'
                            : '#94a3b8',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                      <span style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.7rem' }}>
                        {((cat.total / Math.max(total, 1)) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bar Chart Visual */}
                <div className="mt-4">
                  <p style={{ color: 'rgba(240,244,255,0.4)', fontSize: '0.72rem', marginBottom: 8 }}>Visual Overview</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                    {catTotals.slice(0, 6).map(cat => {
                      const colors = { food: '#fb923c', transport: '#60a5fa', shopping: '#c084fc', health: '#f87171', entertainment: '#f472b6', utilities: '#2dd4bf', other: '#94a3b8' }
                      const color = colors[cat.value] || '#94a3b8'
                      return (
                        <div key={cat.value} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{
                            width: '100%',
                            height: `${(cat.total / maxCatTotal) * 100}%`,
                            minHeight: 4,
                            background: `linear-gradient(180deg, ${color}, ${color}60)`,
                            borderRadius: '4px 4px 0 0',
                          }} />
                          <span style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.55rem' }}>
                            {cat.label.split(' ')[0].replace(/[^a-zA-Z]/g, '')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Expense List */}
          <div className="col-lg-8">
            {/* Filter Tabs */}
            <div className="d-flex gap-2 mb-4 flex-wrap">
              <button
                onClick={() => setFilterCat('all')}
                style={{
                  padding: '7px 16px',
                  background: filterCat === 'all' ? 'rgba(0,212,170,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${filterCat === 'all' ? 'rgba(0,212,170,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 8, color: filterCat === 'all' ? '#00d4aa' : 'rgba(240,244,255,0.5)',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne', transition: 'all 0.2s',
                }}
              >
                All ({expenses.length})
              </button>
              {EXPENSE_CATEGORIES.map(cat => {
                const count = expenses.filter(e => e.category === cat.value).length
                if (!count) return null
                return (
                  <button
                    key={cat.value}
                    onClick={() => setFilterCat(cat.value)}
                    style={{
                      padding: '7px 12px',
                      background: filterCat === cat.value ? 'rgba(0,212,170,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${filterCat === cat.value ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 8, color: filterCat === cat.value ? '#00d4aa' : 'rgba(240,244,255,0.5)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Syne', transition: 'all 0.2s',
                    }}
                  >
                    {cat.label.split(' ')[0]} ({count})
                  </button>
                )
              })}
            </div>

            {/* Filtered Total */}
            {filterCat !== 'all' && (
              <div style={{ marginBottom: 16, padding: '10px 16px', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(240,244,255,0.5)', fontSize: '0.82rem' }}>Filtered total</span>
                <span style={{ color: '#00d4aa', fontWeight: 700, fontFamily: 'Syne' }}>₹{filteredTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            {/* Expense List */}
            <div className="d-flex flex-column gap-2">
              {filtered.length === 0 ? (
                <div className="glass-card-solid p-5 text-center">
                  <i className="bi bi-wallet2" style={{ fontSize: '3.5rem', color: 'rgba(240,244,255,0.1)', marginBottom: 12, display: 'block' }}></i>
                  <p style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.9rem' }}>
                    {expenses.length === 0 ? 'No expenses yet. Add your first expense!' : 'No expenses in this category.'}
                  </p>
                </div>
              ) : (
                filtered.map(expense => {
                  const catInfo = getCategoryInfo(expense.category)
                  const colorMap = { food: '#fb923c', transport: '#60a5fa', shopping: '#c084fc', health: '#f87171', entertainment: '#f472b6', utilities: '#2dd4bf', other: '#94a3b8' }
                  const color = colorMap[expense.category] || '#94a3b8'

                  return (
                    <div key={expense.id} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '14px 16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      transition: 'all 0.2s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                        background: `${color}20`,
                        border: `1px solid ${color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}>
                        {catInfo.label.split(' ')[0]}
                      </div>

                      {/* Info */}
                      <div className="flex-grow-1">
                        <p style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>
                          {expense.description}
                        </p>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{
                            background: `${color}15`, color,
                            border: `1px solid ${color}30`,
                            borderRadius: 5, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 600,
                          }}>
                            {catInfo.label.split(' ').slice(1).join(' ')}
                          </span>
                          <span style={{ color: 'rgba(240,244,255,0.3)', fontSize: '0.75rem' }}>
                            <i className="bi bi-calendar3 me-1"></i>
                            {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', color: '#f87171', marginBottom: 4 }}>
                          -₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: 6, padding: '3px 8px',
                            color: '#f87171', fontSize: '0.72rem', cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Total Footer */}
            {filtered.length > 0 && (
              <div style={{
                marginTop: 16, padding: '14px 20px',
                background: 'rgba(0,212,170,0.05)',
                border: '1px solid rgba(0,212,170,0.15)',
                borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ color: 'rgba(240,244,255,0.6)', fontFamily: 'Syne', fontWeight: 600 }}>
                  Total ({filtered.length} items)
                </span>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.1rem', color: '#00d4aa' }}>
                  ₹{filteredTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseTracker
