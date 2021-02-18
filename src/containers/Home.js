import {
  useState,
  Fragment,
  useMemo,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, withRouter } from 'react-router-dom';

import {
  LIST_VIEW,
  CHART_VIEW,
  TYPE_OUTCOME,
  TYPE_INCOME,
} from '../helpers/constants';
import { parseToYearsAndMonth, padLeft } from '../helpers/utility';
import Icon from '../components/common/Icon';
import LedgerList from '../components/LedgerList';
import ViewTab from '../components/ViewTab';
import { Tabs, Tab } from '../components/Tabs';
import TotalNumber from '../components/TotalNumber';
import CreateBtn from '../components/CreateBtn';
import MonthPicker from '../components/MonthPicker';
import Loader from '../components/common/Loader';
import PieChart from '../components/PieChart';
import AppContext from '../contexts/AppContext';
import AuthContext from '../contexts/AuthContext';

/* @param
  ledgerList //帳目列表
  currentDate //當前年月
  totalIncome,totalOutcome //收入支出總和
  tabView //當前視圖信息
  帳目表的分類資訊跟月份資訊
*/

export const HomePage = ({ history, match }) => {
  const {
    categories,
    ledgerStore,
    currentDate,
    isLoading,
    actions,
  } = useContext(AppContext);

  const { handleFBLogout } = useContext(AuthContext);

  const [tabView, setTabView] = useState(LIST_VIEW);
  const tabsTexts = [LIST_VIEW, CHART_VIEW];

  useEffect(() => {
    actions.getInitData();
  }, []);

  const changeDate = (yearNum, monthNum) => {
    actions.selectNewMonth(yearNum, monthNum);
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
    actions.deleteData(clickedItem);
  };

  const listWithCategory = useMemo(() => {
    //切換View不會重新來
    const categoriesLen = Object.keys(categories).length;
    const ledgerLen = Object.keys(ledgerStore).length;

    if (!categoriesLen > 0 || !ledgerLen > 0) {
      return [];
    }

    const ledgerIdList = Object.keys(ledgerStore);
    let cloneObj = JSON.parse(JSON.stringify(ledgerStore));

    return ledgerIdList.map((id) => {
      cloneObj[id].category = categories[ledgerStore[id].cid];
      return cloneObj[id];
    });
    // },[ledgerLen,categoriesLen])
  }, [categories, ledgerStore]); //!!!是否換掉物件 不需ledgerStore.length可重新計算

  const { totalIncome, totalOutcome } = useMemo(() => {
    let totalIncome = 0,
      totalOutcome = 0;
    // let totalIncome,totalOutcome; //%%%沒給型別變NaN = undefined + number
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
    // },[ledgerIdList.length])
    // },[filteredListWithCategory.length])
    // },[listWithCategory.length,categoriesLen])//@@
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
    <Fragment>
      <header className="App-header">
        <button onClick={(e) => handleFBLogout(e)}>登出</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Code
        </a>
        <div className="headerWrap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-sm-6">
                <MonthPicker
                  year={currentDate.year}
                  month={currentDate.month}
                  choiceDate={changeDate}
                  // path={match.path}
                />
              </div>
              <div className="col-12 col-sm-6">
                <TotalNumber income={totalIncome} outcome={totalOutcome} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="content-area py-3 px-3">
        {isLoading && <Loader />}
        {!isLoading && (
          <Fragment>
            <Tabs activeIndex={tabIndex} onTabChange={changeView}>
              <Tab>
                <Icon
                  icon="IosPaper"
                  className="mr-2 align-bottom"
                  fontSize="25px"
                  color="#007bff"
                />
                列表模式
              </Tab>
              <Tab>
                <Icon
                  icon="IosPie"
                  className="mr-2 align-bottom"
                  fontSize="25px"
                  color="#007bff"
                />
                圖表模式
              </Tab>
            </Tabs>
            {/* <ViewTab activeTab={tabView} onTabChange={changeView} /> */}
            <CreateBtn onCreateItem={createItem} />
            {tabView === LIST_VIEW && listWithCategory.length > 0 && (
              <LedgerList
                items={listWithCategory}
                onModifyItem={modifyItem}
                onDeleteItem={deleteItem}
              ></LedgerList>
            )}
            {tabView === LIST_VIEW && listWithCategory.length === 0 && (
              <div className="no-record alert alert-light text-center">
                您還沒有記帳紀錄
              </div>
            )}
            {tabView === CHART_VIEW && (
              <Fragment>
                <PieChart
                  title="本月支出"
                  type={TYPE_OUTCOME}
                  chartData={chartOutcomeDataByCategory}
                />
                <PieChart
                  title="本月收入"
                  type={TYPE_INCOME}
                  chartData={chartIncomeDataByCategory}
                />
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

HomePage.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(HomePage);
