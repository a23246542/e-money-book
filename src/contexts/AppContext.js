import { createContext, useState, useCallback, useRef } from 'react';
import useLedger from '@/hooks/useLedger';
import { flattenArr, parseToYearsAndMonth, makeID } from '@/helpers/utility';
import api from '@/api';

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
      try {
        const getURLWithDate = `/ledger?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
        const promiseArr = [api.get('/category'), api.get(getURLWithDate)];
        const [resCategory, resLedger] = await Promise.all(promiseArr);

        dispatchLedger({
          type: 'fetchItems',
          payload: flattenArr(resLedger.data),
        });
        setCategories(flattenArr(resCategory.data));
        setIsLoading(false);
      } catch (error) {
        console.log('[getInitData] getURLWithData failed', error);
      }
    }),
    selectNewMonth: withLoader(async (year, month) => {
      try {
        const getURLWithDate = `/ledger?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
        const resLedger = await api.get(getURLWithDate);

        dispatchLedger({
          type: 'fetchItems',
          payload: flattenArr(resLedger.data),
        });

        setCurrentDate({
          year,
          month,
        });
        setIsLoading(false);
      } catch (error) {
        console.log('[selectNewMonth] getURLWithDate failed', error);
      }
    }),
    getEditData: withLoader(async (id) => {
      try {
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
          const getURLWithId = `/ledger/${id}`;
          promiseArr.push(api.get(getURLWithId));
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
      } catch (error) {
        console.log('[getEditData] getURLWithData failed', error);
      }
    }),
    createData: withLoader(async (formData, selectedCategoryId) => {
      try {
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
      } catch (error) {
        console.log('[createData] postURLWithData failed', error);
      }
    }),
    editData: withLoader(async (formData, newCategoryId) => {
      try {
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
      } catch (error) {
        console.log('[editData] patchURLWithData failed', error);
      }
    }),
    deleteData: withLoader(async (item) => {
      try {
        await api.delete(`/ledger/${item.id}`);
        dispatchLedger({
          type: 'deleteItem',
          payload: item,
        });
        setIsLoading(false);
        return item;
      } catch (error) {
        console.log('[deleteData] deleteURLWithData failed', error);
      }
    }),
  };

  return (
    <AppContext.Provider
      value={{
        categories,
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
