// ====== Formatting Utilities ======

/**
 * Format number as Indian Rupee currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with Indian number system (lakhs, crores)
 */
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN').format(Math.round(amount))
}

/**
 * Generate a unique transaction ID
 */
export const generateTxnId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'TXN'
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

/**
 * Format date as readable string
 */
export const formatDate = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

/**
 * Get date string for inputs (YYYY-MM-DD)
 */
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0]
}

// ====== LocalStorage Utilities ======

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Storage save failed:', e)
  }
}

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.error('Storage load failed:', e)
    return defaultValue
  }
}

// ====== Financial Calculation Utilities ======

/**
 * EMI = P × R × (1+R)^N / ((1+R)^N - 1)
 * P = Principal, R = Monthly rate, N = Months
 */
export const calculateEMI = (principal, annualRate, months) => {
  const P = parseFloat(principal)
  const annualR = parseFloat(annualRate)
  const N = parseInt(months)

  if (!P || !annualR || !N) return null

  const R = annualR / 12 / 100 // Monthly interest rate

  if (R === 0) {
    return { emi: P / N, totalPayment: P, totalInterest: 0 }
  }

  const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)
  const totalPayment = emi * N
  const totalInterest = totalPayment - P

  return { emi, totalPayment, totalInterest }
}

/**
 * FD Maturity: A = P × (1 + r/n)^(n×t)
 * n = compounding frequency per year
 */
export const calculateFD = (principal, annualRate, years, compoundFreq) => {
  const P = parseFloat(principal)
  const r = parseFloat(annualRate) / 100
  const t = parseFloat(years)
  const n = parseInt(compoundFreq)

  if (!P || !r || !t || !n) return null

  const maturityAmount = P * Math.pow(1 + r / n, n * t)
  const interestEarned = maturityAmount - P

  return { maturityAmount, interestEarned }
}

/**
 * RD Maturity using compound interest formula
 * M = R × [(1 + i)^n - 1] / (1 - (1 + i)^(-1/3))
 * Simplified: monthly compounding
 */
export const calculateRD = (monthlyAmount, annualRate, months) => {
  const R = parseFloat(monthlyAmount)
  const annualR = parseFloat(annualRate) / 100
  const N = parseInt(months)

  if (!R || !annualR || !N) return null

  const monthlyRate = annualR / 12
  let maturityAmount = 0

  // Each monthly deposit compounds for remaining months
  for (let i = 1; i <= N; i++) {
    maturityAmount += R * Math.pow(1 + monthlyRate, N - i + 1)
  }

  const totalInvested = R * N
  const interestEarned = maturityAmount - totalInvested

  return { maturityAmount, totalInvested, interestEarned }
}

// ====== Expense Categories ======
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: '🍔 Food & Dining', cssClass: 'cat-food' },
  { value: 'transport', label: '🚗 Transport', cssClass: 'cat-transport' },
  { value: 'shopping', label: '🛍️ Shopping', cssClass: 'cat-shopping' },
  { value: 'health', label: '🏥 Health', cssClass: 'cat-health' },
  { value: 'entertainment', label: '🎮 Entertainment', cssClass: 'cat-entertainment' },
  { value: 'utilities', label: '💡 Utilities', cssClass: 'cat-utilities' },
  { value: 'other', label: '📦 Other', cssClass: 'cat-other' },
]

export const getCategoryInfo = (value) =>
  EXPENSE_CATEGORIES.find(c => c.value === value) || EXPENSE_CATEGORIES[6]

// ====== Mock QR Data ======
export const MOCK_QR_MERCHANTS = [
  { merchantName: 'Sharma Kirana Store', upiId: 'sharma.store@okaxis', category: 'Grocery' },
  { merchantName: 'Café Mocha', upiId: 'cafemocha@paytm', category: 'Food & Beverages' },
  { merchantName: 'TechZone Electronics', upiId: 'techzone@ybl', category: 'Electronics' },
  { merchantName: 'Metro Pharmacy', upiId: 'metropharma@okicici', category: 'Health' },
  { merchantName: 'FashionHub', upiId: 'fashionhub@upi', category: 'Fashion' },
  { merchantName: 'AutoFix Garage', upiId: 'autofix@okhdfcbank', category: 'Automobile' },
]

export const getRandomMerchant = () => {
  return MOCK_QR_MERCHANTS[Math.floor(Math.random() * MOCK_QR_MERCHANTS.length)]
}

// ====== Demo Transactions ======
export const DEMO_TRANSACTIONS = [
  { id: 'TXN001', merchant: 'Zomato', type: 'debit', amount: 340, category: 'food', date: '15 Feb 2026', icon: 'bi-bag-fill', color: '#fb923c' },
  { id: 'TXN002', merchant: 'Salary Credit', type: 'credit', amount: 65000, category: 'income', date: '01 Feb 2026', icon: 'bi-briefcase-fill', color: '#10b981' },
  { id: 'TXN003', merchant: 'Amazon', type: 'debit', amount: 1299, category: 'shopping', date: '14 Feb 2026', icon: 'bi-cart-fill', color: '#c084fc' },
  { id: 'TXN004', merchant: 'Ola Cabs', type: 'debit', amount: 180, category: 'transport', date: '13 Feb 2026', icon: 'bi-car-front-fill', color: '#60a5fa' },
  { id: 'TXN005', merchant: 'Netflix', type: 'debit', amount: 649, category: 'entertainment', date: '10 Feb 2026', icon: 'bi-play-circle-fill', color: '#f472b6' },
]
