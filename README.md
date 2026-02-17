# 💳 PayFlow — UPI Banking & Finance App

A modern fintech web application built with **React + Vite**, featuring UPI-style QR payment simulation, financial calculators, and expense tracking.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation & Run

```bash
# 1. Navigate to project folder
cd upi-banking-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📱 Features

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Account balance, recent transactions, quick actions |
| Scan & Pay | `/scan` | Simulated UPI QR scanner & payment flow |
| Loan Calculator | `/loan-calculator` | EMI calculator with amortization table |
| FD Calculator | `/fd-calculator` | Fixed deposit returns calculator |
| RD Calculator | `/rd-calculator` | Recurring deposit calculator |
| Expense Tracker | `/expenses` | Add/delete expenses with category chart |

---

## 🗂 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Sticky nav with active route highlighting
├── pages/
│   ├── Dashboard.jsx       # Main dashboard
│   ├── ScanQR.jsx          # QR scanner & payment flow
│   └── ExpenseTracker.jsx  # Expense management
├── calculators/
│   ├── LoanCalculator.jsx  # EMI calculator
│   ├── FDCalculator.jsx    # Fixed deposit calculator
│   └── RDCalculator.jsx    # Recurring deposit calculator
├── utils/
│   └── helpers.js          # Math formulas, formatters, localStorage utils
├── App.jsx                 # Router setup
├── main.jsx                # Entry point
└── index.css               # Global dark theme styles
```

---

## 🔢 Financial Formulas

- **EMI**: `P × R × (1+R)^N / ((1+R)^N - 1)` — P=Principal, R=Monthly Rate, N=Months
- **FD**: `A = P × (1 + r/n)^(n×t)` — Compound interest
- **RD**: `M = R × Σ(1+i)^n` — Monthly compound accumulation

---

## 💾 Data Persistence
- Expenses stored in **localStorage** (`payflow_expenses`)
- QR payment transactions stored in **localStorage** (`payflow_transactions`)

---

## 🎨 Tech Stack
- **React 18** + **Vite 5**
- **React Router DOM v6**
- **Bootstrap 5.3** (CDN)
- **Bootstrap Icons 1.11** (CDN)
- **Google Fonts**: Syne + DM Sans

---

## 🏗 Build for Production

```bash
npm run build
npm run preview
```

---

*Demo mode — No real payments are processed. All data is simulated.*
