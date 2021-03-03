import api from './api';

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
