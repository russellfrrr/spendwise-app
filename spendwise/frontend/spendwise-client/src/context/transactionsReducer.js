export const initialTransactionState = {
  transactions: [],
  archived: [],
  loading: false,
  error: null,
  filter: 'all',
};

export const transactionsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        transactions: action.payload.active,
        archived: action.payload.archived,
      };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    default:
      return state;
  }
};