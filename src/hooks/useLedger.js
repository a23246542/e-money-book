import { useReducer } from 'react';
import { parseToYearsAndMonth, makeID } from '../helpers/utility';

const useLedger = (defaultValue) => {
  const [ledgerStore, dispatchLedger] = useReducer(
    ledgerReducer,
    (defaultValue = {})
  );

  return { ledgerStore, dispatchLedger };
};

const ledgerReducer = (state, action) => {
  const { type, payload } = action;
  let dateObj = {},
    timestamp = 0; //%%

  switch (type) {
    case 'fetchItems': {
      return payload;
    }
    case 'deleteItem': {
      const { id } = payload;
      // delete state[payload.id];//不react
      // let clone = {...ledgerItems};//@@ ReferenceError: Cannot access 'ledgerItems' before initialization
      let cloneObj = {
        ...state,
      };
      delete cloneObj[id];
      return cloneObj;
    }
    case 'createItem': {
      const { selectedCategoryId, formData } = payload;
      dateObj = parseToYearsAndMonth(formData.date);
      timestamp = new Date().getTime();
      const newId = makeID();

      const newItem = {
        ...formData,
        id: newId,
        cid: selectedCategoryId,
        monthCategory: `${dateObj.year}-${dateObj.month}`,
        timestamp,
      };
      // return {...state, newId: newItem};//%%%属性沒辦法直接存取變數會變字串
      return {
        ...state,
        [newId]: newItem,
      };
    }
    case 'addItem': {
      const { newItem, newId } = payload;
      return {
        ...state,
        [newId]: newItem,
      };
    }
    case 'updatedItem': {
      const { id, modifiedItem } = payload;
      return {
        ...state,
        [id]: modifiedItem,
      };
    }
    default:
      return state;
  }
};
export default useLedger;
