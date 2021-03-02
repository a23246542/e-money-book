import axios from 'axios';

axios.defaults.adapter = require('axios/lib/adapters/http');

let api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'test'
      ? 'http://localhost:3003'
      : process.env.REACT_APP_URL,
  headers: {
    'Content-Type': 'application/json',
    'Facebook-Client-Token': localStorage.getItem('facebookClientToken'),
  },
});

// export default api;

export const getLedger = (year, month) => {
  return api.get(
    `/ledger?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`
  );
};

export const getCategory = () => {
  return api.get('/category');
};

export const getSingleLedgerItem = (LedgerItemId) => {
  return api.get(`/ledger/${LedgerItemId}`);
};

export const createLedgerItem = (newData) => {
  return api.post('/ledger', newData);
};

export const updateLedgerItem = (LedgerItemId, updatedData) => {
  return api.patch(`/ledger/${LedgerItemId}`, updatedData);
};

export const deleteLedgerItem = (LedgerItemId) => {
  return api.delete(`/ledger/${LedgerItemId}`);
};
