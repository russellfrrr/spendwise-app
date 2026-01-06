import Budget from '../models/Budget.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';

/*
  ENDPOINTS (services):
  GET /budgets
  GET /budgets/archived
  GET /budgets/:id
  POST /budgets
  PATCH /budgets/:id
  PATCH /budgets/:id/archive
  PATCH /budgets/:id/restore
  DELETE /budgets/:id
*/

// GET /budgets
const getBudgetsService = async (userId, type) => {
  const filter = { user: userId, isDeleted: false };
  const budgets = await Budget.find(filter).populate('category');

  if (type) {
    return budgets.filter(b => b.category && b.category.type === type);
  }

  return budgets;
};

// GET /monthly/expense
const getMonthlyExpenseBudgetsService = async (userId) => {
  const budgets = await Budget.find({
    user: userId,
    isDeleted: false,
    period: 'monthly',
  }).populate('category');

  return budgets.filter(b => b.category && b.category.type === 'expense');
};

// GET /monthly/summary
const getMonthlyBudgetSummaryService = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Get all active monthly expense budgets
  const budgets = await Budget.find({
    user: userId,
    isDeleted: false,
    period: 'monthly',
  }).populate('category');

  // For each budget, calculate used amount
  const results = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: userId,
            isDeleted: false,
            type: 'expense',
            category: budget.category._id,
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);

      const used = spent.length ? spent[0].total : 0;

      return {
        _id: budget._id,
        category: budget.category,
        amount: budget.amount,
        used,
        remaining: budget.amount - used,
      };
    })
  );

  return results;
};

// GET /budgets/archived
const getArchivedBudgetsService = async (userId, type) => {
  const filter = { user: userId, isDeleted: true };
  const budgets = await Budget.find(filter).populate('category');

  if (type) {
    return budgets.filter(b => b.category && b.category.type === type);
  }

  return budgets;
};

// GET /budgets/:id
const getBudgetByIdService = async (budgetId, userId) => {
  const filter = { _id: budgetId, user: userId };
  const budget = await Budget.findOne(filter).populate('category');

  return budget;
};

// POST /budgets
const createBudgetService = async (userId, data) => {
  const { category, amount, period, startDate } = data;

  const categoryFilter = { _id: category, user: userId, isDeleted: false };
  const foundCategory = await Category.findOne(categoryFilter);
  if (!foundCategory) {
    throw new Error('Invalid or unauthorized category!');
  }

  const newBudget = { user: userId, category, amount, period, startDate };

  const budget = await Budget.create(newBudget);
  
  return budget;
};

// PATCH /budgets/:id
const updateBudgetService = async (budgetId, userId, data) => {
  const filter = { _id: budgetId, user: userId, isDeleted: false };

  const existing = await Budget.findOne(filter);
  if (!existing) {
    return null;
  }

  // if category is being updated, validate ownership and type
  if (data.category) {
    const categoryFilter = { _id: data.category, user: userId, isDeleted: false };
    const foundCategory = await Category.findOne(categoryFilter);
    if (!foundCategory) {
      throw new Error('Invalid or unauthorized category!');
    }
  }

  const budget = await Budget.findOneAndUpdate(filter, data, { new: true }).populate('category');
  
  return budget;
};

// PATCH /budgets/:id/archive 
const archiveBudgetService = async (budgetId, userId) => {
  const filter = { _id: budgetId, user: userId };
  const budget = await Budget.findOneAndUpdate(filter, { isDeleted: true }, { new: true });

  return budget;
};

// PATCH /budgets/:id/restore
const restoreBudgetService = async (budgetId, userId) => {
  const filter = { _id: budgetId, user: userId, isDeleted: true };
  const budget = await Budget.findOneAndUpdate(filter, { isDeleted: false }, { new: true });

  return budget;
};

// DELETE /budgets/:id 
const deleteBudgetService = async (budgetId, userId) => {
  const filter = { _id: budgetId, user: userId };
  const budget = await Budget.findOneAndDelete(filter);

  return budget;
};

export {
  getBudgetsService,
  getMonthlyExpenseBudgetsService,
  getMonthlyBudgetSummaryService,
  getArchivedBudgetsService,
  getBudgetByIdService,
  createBudgetService,
  updateBudgetService,
  archiveBudgetService,
  restoreBudgetService,
  deleteBudgetService,
};