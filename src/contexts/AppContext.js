import { createContext, useState } from 'react';
import useLedger from '../hooks/useLedger';
import { flattenArr, parseToYearsAndMonth, makeID } from '../helpers/utility';
import api from '../api';

const AppContext = createContext({
  categories: {},
  ledgerStore: {},
  currentData: {},
  isLoading: true,
  actions: {},
});

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState({});
  const [currentDate, setCurrentDate] = useState(() => parseToYearsAndMonth());
  const [isLoading, setIsLoading] = useState(false);
  const { ledgerStore, dispatchLedger } = useLedger();

  const withLoader = (cb) => {
    return (...args) => {
      setIsLoading(true);
      return cb(...args);
    };
  };

  const actions = {
    getInitData: withLoader(async () => {
      const getUrlWithData = `/ledger?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
      const promiseArr = [api.get('/category'), api.get(getUrlWithData)];
      const [resCategory, resLedger] = await Promise.all(promiseArr);

      dispatchLedger({
        type: 'fetchItems',
        payload: flattenArr(resLedger.data),
      });
      setCategories(flattenArr(resCategory.data));
      setIsLoading(false);
    }),
    selectNewMonth: withLoader(async (year, month) => {
      const getUrlWithData = `/ledger?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
      const resLedger = await api.get(getUrlWithData);

      dispatchLedger({
        type: 'fetchItems',
        payload: flattenArr(resLedger.data),
      });

      setCurrentDate({
        year,
        month,
      });
      setIsLoading(false);
      // return res;//返不返回都可以
    }),
    getEditData: withLoader(async (id) => {
      //創建頁重整可取得編輯資料
      let promiseArr = [];

      if (Object.keys(categories).length === 0) {
        promiseArr.push(api.get('/category'));
      } else {
        promiseArr.push(new Promise((resolve) => resolve(null)));
      }

      const isItemAlreadyFetched = !!(
        Object.keys(ledgerStore).indexOf(id) > -1
      );
      if (id && !isItemAlreadyFetched) {
        const getUrlWithId = `/ledger/${id}`;
        promiseArr.push(api.get(getUrlWithId));
      }

      const [resCategory, resEditItem] = await Promise.all(promiseArr);

      const finalCategory = resCategory
        ? flattenArr(resCategory.data)
        : categories;
      const finalEditItem = resEditItem ? resEditItem.data : ledgerStore[id];

      if (id) {
        // 編輯模式
        setCategories(finalCategory);
        setIsLoading(false);
        dispatchLedger({
          type: 'fetchItems',
          payload: {
            [id]: finalEditItem,
          },
        });
      } else {
        // 創建模式
        setCategories(finalCategory);
        setIsLoading(false);
      }

      return {
        categories: finalCategory,
        editItem: finalEditItem,
      };
    }),
    createData: withLoader(async (formData, selectedCategoryId) => {
      const newId = makeID();
      const dateObj = parseToYearsAndMonth(formData.date);
      const timestamp = new Date().getTime();

      const { data: newItem } = await api.post('/ledger', {
        ...formData,
        id: newId,
        cid: selectedCategoryId,
        monthCategory: `${dateObj.year}-${dateObj.month}`,
        timestamp,
      });

      dispatchLedger({
        type: 'addItem',
        payload: {
          newItem,
          newId,
        },
      });
      return newItem;
    }),
    editData: withLoader(async (formData, newCategoryId) => {
      const dateObj = parseToYearsAndMonth(formData.date);
      const timestamp = new Date(formData.date).getTime(); //@年月日轉排序

      const updatedItem = {
        ...formData,
        cid: newCategoryId,
        // timestamp,//%%會不小心把排序提升 創建有就好
        monthCategory: `${dateObj.year}-${dateObj.month}`,
      };
      const { data: modifiedItem } = await api.patch(
        `ledger/${formData.id}`,
        updatedItem
      );

      dispatchLedger({
        type: 'updateItem',
        payload: {
          id: modifiedItem.id,
          modifiedItem,
        },
      });

      return modifiedItem;
    }),
    deleteData: withLoader(async (item) => {
      const deleteItem = await api.delete(`/ledger/${item.id}`);
      dispatchLedger({
        type: 'deleteItem',
        payload: item,
      });
      setIsLoading(false);

      return deleteItem;
    }),
  };

  return (
    <AppContext.Provider
      value={{
        categories: categories,
        ledgerStore,
        currentDate,
        isLoading,
        actions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppContext;
