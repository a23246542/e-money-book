import { createContext, useState, useCallback, useRef, useMemo } from 'react';
import useLedger from '@/hooks/useLedger';
import { flattenArr, parseToYearsAndMonth, makeID } from '@/helpers/utility';
import {
  getLedger,
  getCategory,
  getSingleLedgerItem,
  createLedgerItem,
  updateLedgerItem,
  deleteLedgerItem,
} from '@/api/ledger';

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

  const actions = useMemo(
    () => ({
      getInitData: withLoader(async () => {
        try {
          const promiseArr = [
            getCategory(),
            getLedger(currentDate.year, currentDate.month),
          ];
          const [resCategory, resLedger] = await Promise.all(promiseArr);
          const sortByDateLedger = resLedger.data.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
          });
          dispatchLedger({
            type: 'fetchItems',
            payload: flattenArr(sortByDateLedger),
          });
          setCategories(flattenArr(resCategory.data));
          setIsLoading(false);
        } catch (error) {
          console.log('[getInitData] getURLWithData failed', error);
        }
      }),
      selectNewMonth: withLoader(async (year, month) => {
        try {
          const resLedger = await getLedger(year, month);
          const sortByDateLedger = resLedger.data.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
          });
          dispatchLedger({
            type: 'fetchItems',
            payload: flattenArr(sortByDateLedger),
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
            promiseArr.push(getCategory());
          } else {
            promiseArr.push(new Promise((resolve) => resolve(null)));
          }

          const isItemAlreadyFetched = !!(
            Object.keys(ledgerStore).indexOf(id) > -1
          );
          if (id && !isItemAlreadyFetched) {
            promiseArr.push(getSingleLedgerItem(id));
          }

          const [resCategory, resEditItem] = await Promise.all(promiseArr);

          const finalCategory = resCategory
            ? flattenArr(resCategory.data)
            : categories;
          const finalEditItem = resEditItem
            ? resEditItem.data
            : ledgerStore[id];

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

          const { data: newItem } = await createLedgerItem({
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
          const { data: modifiedItem } = await updateLedgerItem(
            formData.id,
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
          await deleteLedgerItem(item.id);
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
    }),
    [
      categories,
      currentDate.month,
      currentDate.year,
      dispatchLedger,
      ledgerStore,
    ]
  );

  const appContextValue = useMemo(
    () => ({
      categories,
      ledgerStore,
      currentDate,
      isLoading,
      actions,
    }),
    [categories, ledgerStore, currentDate, isLoading, actions]
  );

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};
export default AppContext;
