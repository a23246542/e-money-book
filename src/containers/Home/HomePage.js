import {
  useState,
  Fragment,
  useMemo,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { Loader, IconItem } from '@/components/common';
import {
  MonthPicker,
  TotalNumber,
  Tabs,
  Tab,
  CreateBtn,
  PieChartItem,
  LedgerList,
} from '@/components';
import {
  LIST_VIEW,
  CHART_VIEW,
  TYPE_OUTCOME,
  TYPE_INCOME,
} from '../../helpers/constants';
import AppContext from '../../contexts/AppContext';
import AuthContext from '../../contexts/AuthContext';
import styleContainer from '../style.module.scss';
import style from './style.module.scss';

export const HomePageComponent = ({ history, match }) => {
  const {
    categories,
    ledgerStore,
    currentDate,
    isLoading,
    actions,
  } = useContext(AppContext);

  const actionsRef = useRef(actions);

  const { handleFBLogout } = useContext(AuthContext);

  const [tabView, setTabView] = useState(LIST_VIEW);
  const tabsTexts = [LIST_VIEW, CHART_VIEW];

  useEffect(() => {
    actionsRef.current.getInitData();
  }, [actionsRef]);

  const choiceDate = (yearNum, monthNum) => {
    actionsRef.current.selectNewMonth(yearNum, monthNum);
  };

  const changeView = (tabIndex) => {
    setTabView(tabsTexts[tabIndex]);
  };

  const modifyItem = (clickedItem) => {
    history.push(`/edit/${clickedItem.id}`);
  };

  const createItem = () => {
    history.push('/create');
  };

  const deleteItem = (clickedItem) => {
    actionsRef.current.deleteData(clickedItem);
  };

  const listWithCategory = useMemo(() => {
    const categoriesLen = Object.keys(categories).length;
    const ledgerLen = Object.keys(ledgerStore).length;
    //切換View不會重新來
    if (!categoriesLen > 0 || !ledgerLen > 0) {
      return [];
    }

    const ledgerIdList = Object.keys(ledgerStore);
    let cloneObj = JSON.parse(JSON.stringify(ledgerStore));

    return ledgerIdList.map((id) => {
      cloneObj[id].category = categories[ledgerStore[id].cid];
      return cloneObj[id];
    });
    // eslint-disable-next-line
    // }, [ledgerLen, categoriesLen, currentDate.year, currentDate.month]);
  }, [ledgerStore, categories]);

  const { totalIncome, totalOutcome } = useMemo(() => {
    let totalIncome = 0,
      totalOutcome = 0;
    if (!listWithCategory.length > 0) {
      return {
        totalIncome: 0,
        totalOutcome: 0,
      };
    }

    listWithCategory.forEach((item) => {
      try {
        if (categories[item.cid].type === 'outcome') {
          totalOutcome += item.amount;
        } else {
          totalIncome += item.amount;
        }
      } catch {
        throw new Error(item);
      }
    });

    return {
      totalIncome,
      totalOutcome,
    };
  }, [listWithCategory, categories]);

  const generateChartDataByCategory = (
    ledgerItemsWithCategory,
    type = TYPE_OUTCOME
  ) => {
    let categoryMap = {};
    ledgerItemsWithCategory
      .filter((item) => item.category.type === type)
      .forEach((item) => {
        if (categoryMap[item.cid]) {
          categoryMap[item.cid].value += item.amount * 1;
          categoryMap[item.cid].items.push(item.id);
        } else {
          categoryMap[item.cid] = {
            name: item.category.name,
            value: item.amount * 1,
            items: [item.id],
          };
        }
      });
    return Object.values(categoryMap);
  };

  const tabIndex = tabsTexts.findIndex((tabText) => tabText === tabView);

  const chartOutcomeDataByCategory = useMemo(
    () => generateChartDataByCategory(listWithCategory, TYPE_OUTCOME),
    [listWithCategory]
  );

  const chartIncomeDataByCategory = useMemo(
    () => generateChartDataByCategory(listWithCategory, TYPE_INCOME),
    [listWithCategory]
  );

  return (
    <div className={styleContainer['app-wrapper']}>
      <div className={styleContainer['app-container']}>
        <header className={style['app-header']}>
          <button
            onClick={(e) => handleFBLogout(e)}
            className={`${style['app-logout']} btn btn-info`}
          >
            登出
          </button>
          <div className={style['app-headerWrap']}>
            <div className="container-fluid d-flex justify-content-center">
              <div className="row w-100">
                <div className="col-6">
                  <MonthPicker
                    year={currentDate.year}
                    month={currentDate.month}
                    choiceDate={choiceDate}
                  />
                </div>
                <div className="col-6">
                  <TotalNumber income={totalIncome} outcome={totalOutcome} />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={`${style['app-body']} py-3 px-0`}>
          {isLoading && <Loader />}
          {!isLoading && (
            <Fragment>
              <Tabs activeIndex={tabIndex} onTabChange={changeView}>
                <Tab>
                  <IconItem
                    icon="IosPaper"
                    className="mr-2 align-bottom"
                    fontSize="25px"
                    color="#007bff"
                  />
                  列表模式
                </Tab>
                <Tab>
                  <IconItem
                    icon="IosPie"
                    className="mr-2 align-bottom"
                    fontSize="25px"
                    color="#007bff"
                  />
                  圖表模式
                </Tab>
              </Tabs>
              <CreateBtn onCreateItem={createItem} />
              {tabView === LIST_VIEW && listWithCategory.length > 0 && (
                <LedgerList
                  items={listWithCategory}
                  onModifyItem={modifyItem}
                  onDeleteItem={deleteItem}
                ></LedgerList>
              )}
              {tabView === CHART_VIEW && listWithCategory.length > 0 && (
                <Fragment>
                  <PieChartItem
                    title="本月支出"
                    type={TYPE_OUTCOME}
                    chartData={chartOutcomeDataByCategory}
                  />
                  <PieChartItem
                    title="本月收入"
                    type={TYPE_INCOME}
                    chartData={chartIncomeDataByCategory}
                  />
                </Fragment>
              )}
              {listWithCategory.length === 0 && (
                <div className="no-record alert alert-light text-center">
                  您還沒有記帳紀錄
                </div>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

HomePageComponent.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export const HomePage = withRouter(HomePageComponent);
