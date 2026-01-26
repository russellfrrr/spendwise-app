# SpendWise - Personal Finance Manager

A full-stack web application for managing personal finances with real-time budget tracking, expense categorization, and financial analytics.

Live Demo: [spendwiseph.netlify.app](https://spendwiseph.netlify.app)

## Features

- Account Management - Create and manage multiple accounts (bank, credit card, cash, etc.)
- Transaction Tracking - Log income and expense transactions with categories
- Budget Planning - Set monthly budgets and track spending against them
- Financial Analytics - View charts and reports on income vs expenses
- Category Management - Create custom transaction categories
- Secure Authentication - User registration and JWT-based login
- Mobile Responsive - Works seamlessly on desktop, tablet, and mobile devices
- Archive Functionality - Archive old transactions and accounts for clean data

## Tech Stack

### Frontend
- React 19
- Vite
- React Router v7
- Material-UI (MUI)
- Tailwind CSS
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (cloud) or local MongoDB
- Git


## Usage

### Authentication
1. Visit the landing page
2. Sign up with email and password
3. Login with your credentials

### Managing Finances
- Dashboard: View your total balance, monthly income/expense, and budget overview
- Accounts: Create accounts and view their balances
- Transactions: Add income/expense transactions, filter by type or category
- Budgets: Set monthly budgets for each category and track spending
- Categories: Create and manage custom transaction categories

## Project Structure

```
spendwise/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── validators/
│   ├── database/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    └── spendwise-client/
        ├── src/
        │   ├── pages/
        │   ├── components/
        │   ├── api/
        │   ├── context/
        │   ├── layout/
        │   ├── App.jsx
        │   └── main.jsx
        ├── public/
        ├── package.json
        └── vite.config.js
```


## 🧪 Testing

### Frontend
```bash
cd frontend/spendwise-client
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
```Testing

### Frontend
```bash
cd frontend/spendwise-client
npm run dev
npm run build
npm run lint
```

### Backend
```bash
cd backend
npm run deve

### Smart Analytics
- Income vs Expense pie chart
- Mhly expense trends
- Category-based spending breakdown

### Data Organization
- Archive old transactions without deleting
- Filter by transaction type, category, account
- Search and sort capabilities

## Known Issues & Troubleshooting

**404 on page refresh:**
- Make sure `_redirects` file exists in `frontend/public/`
- If deployed on Netlify, no additional action needed

**API Connection Errors:**
- Verify backend URL in frontend `.env`
- Check CORS settings in backend
- Troubleshooting

404 on page refresh:
- Make sure _redirects file exists in frontend/public/
- If deployed on Netlify, the file will handle routing

API Connection Errors:
- Check CORS settings in backend
- Verify MongoDB connection
- `GET/POST /transactions` - Transaction management
- `GET/POST /budgets` - Budget management
- `GET /stats` - Financial statistics

## 💡 Future Enhancements

- [Future Enhancements

- Budget alerts and notifications
- Recurring transactions
- Multi-currency support
- Data export (CSV, PDF)
- Advanced analytics and report

Russell Gonzales Ferrero
Author


## Acknowledgments

- Uplift Code Camp mentors and community
- Material-UI documentation
- MongoDB Atlas documentation

