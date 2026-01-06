import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import Category from '../models/Category.js';

/*
  ENDPOINTS:
  GET /transactions
  GET /transactions/archived
  GET /transactions/:id
  POST /transactions
  PATCH /transactions/:id
  PATCH /transactions/archive
  PATCH /transactions/restore
  DELETE /transactions
*/

// Helper function for account updates from transaction
const applyAccountBalanceChange = async ({ accountId, amount, type, mode = 'apply'}) => {
  const sign = type === 'income' ? 1 : -1;
  const multiplier = mode === 'apply' ? 1 : -1;

  await Account.findByIdAndUpdate(accountId, {
    $inc: {
      balance: sign * multiplier * amount
    }
  })
}

// GET /transactions
const getTransactionsService = async (userId, type) => {
  let txFilter = { user: userId, isDeleted: false };

  if (type) {
    txFilter.type = type;
  }
  
  const tx = await Transaction.find(txFilter).populate('account').populate('category');

  return tx;
}

// GET /transactions/archived
const getArchivedTransactionsService = async (userId, type) => {
  let txFilter = { user: userId, isDeleted: true };

  if (type) {
    txFilter.type = type;
  }

  const tx = await Transaction.find(txFilter).populate('account').populate('category');

  return tx;
}

// GET /transactions/:id
const getTransactionByIdService = async (txId, userId) => {
  const txFilter = { _id: txId, user: userId };
  const tx = await Transaction.findOne(txFilter);

  return tx;
}

// POST /transactions
const createTransactionService = async (userId, data) => {
  const { account, category, type, amount } = data;
  const accOwnershipFilter = { _id: account, user: userId, isDeleted: false };
  const catOwnershipFilter = { _id: category, user: userId, isDeleted: false };

  const acc = await Account.findOne(accOwnershipFilter);
  if (!acc) {
    throw new Error('Invalid or unauthorized account!');
  }

  const cat = await Category.findOne(catOwnershipFilter);
  if (!cat) {
    throw new Error('Invalid or unauthorized category!');
  }

  if (cat.type !== type) {
    throw new Error(`Type mismatch! Category type is "${cat.type}" but Transaction type is "${type}".`);
  }

  const newTx = { user: userId, ...data };
  const tx = await Transaction.create(newTx);

  await applyAccountBalanceChange({
    accountId: account,
    amount, 
    type,
    mode: 'apply',
  })

  return tx;
}

// PATCH /transactions/:id
const updateTransactionByIdService = async (txId, userId, data) => {
  const txFilter = { _id: txId, user: userId, isDeleted: false };

  const oldTx = await Transaction.findOne(txFilter).populate('category');
  if (!oldTx) {
    return null;
  }

  // Validate new account if changed
  if (data.account && data.account !== String(oldTx.account)) {
    const acc = await Account.findOne({ _id: data.account, user: userId,  isDeleted: false });
    if (!acc) {
      throw new Error('Invalid or unauthorized account!');
    }
  }

  // Validate new category if changed
  let newCategory = null;
  if (data.category) {
    newCategory = await Category.findOne({ _id: data.category, user: userId, isDeleted: false });
    if (!newCategory) {
      throw new Error('Invalid or unauthorized category!');
    }
  }

  // if user updates category ONLY
  if (data.category && !data.type) {
    if (newCategory.type !== oldTx.type) {
      throw new Error(`Type mismatch: Transaction type "${oldTx.type}" does not match Category type "${newCategory.type}".`);
    }
  }

  // if user updates type ONLY
  if (!data.category && data.type) {
    if (data.type !== oldTx.category.type) {
      throw new Error(`Type mismatch: Category type "${oldTx.category.type}" does not match new Transaction type "${data.type}".`);
    }
  }

  // if user updates BOTH
  if (data.category && data.type){
    if (newCategory.type !== data.type) {
      throw new Error(`Type mismatch: Category type "${newCategory.type}" does not match Transaction type "${data.type}".`);
    }
  }

  // Revert old tx effect
  await applyAccountBalanceChange({
    accountId: oldTx.account,
    amount: oldTx.amount,
    type: oldTx.type,
    mode: 'revert',
  })

  // Apply new tx effect
  await applyAccountBalanceChange({
    accountId: data.account || oldTx.account,
    amount: data.amount ?? oldTx.amount,
    type: data.type || oldTx.type,
    mode: 'apply',
  })

  const updatedTx = await Transaction.findOneAndUpdate(txFilter, data, { new: true });

  
  return updatedTx;
}

// PATCH /transactions/:id/archive
const archiveTransactionService = async (txId, userId) => {
  const txFilter = { _id: txId, user: userId };

  const tx = await Transaction.findOne(txFilter);
  if (!tx) {
    return null;
  }

  await applyAccountBalanceChange({
    accountId: tx.account,
    amount: tx.amount,
    type: tx.type,
    mode: 'revert'
  })

  tx.isDeleted = true;
  await tx.save();

  return tx;
}

// PATCH /transactions/:id/restore
const restoreTransactionService = async (txId, userId) => {
  const txFilter = { _id: txId, user: userId };

  const tx = await Transaction.findOne(txFilter);
  if (!tx) {
    return null;
  }

  await applyAccountBalanceChange({
    accountId: tx.account,
    amount: tx.amount,
    type: tx.type,
    mode: 'apply'
  })

  tx.isDeleted = false;
  await tx.save();

  return tx;
}

// DELETE /transactions/:id
const deleteTransactionService = async (txId, userId) => {
  const txFilter = { _id: txId, user: userId};

  const tx = await Transaction.findOne(txFilter);
  if (!tx) {
    return null;
  }

  await applyAccountBalanceChange({
    accountId: tx.account,
    amount: tx.amount,
    type: tx.type,
    mode: 'revert'
  })

  await Transaction.findOneAndDelete(txFilter);

  return tx;
}

export {
  getTransactionsService,
  getArchivedTransactionsService,
  getTransactionByIdService,
  createTransactionService, 
  updateTransactionByIdService,
  archiveTransactionService,
  restoreTransactionService,
  deleteTransactionService
};