import React, {
  useState,
  useMemo,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loader, IconItem } from '@/components/common';
import { CategorySelect, LedgerForm, Tabs, Tab } from '@/components';
import { TYPE_OUTCOME, TYPE_INCOME } from '@/helpers/constants';
import AppContext from '@/contexts/AppContext';
import styleContainer from '../style.module.scss';
import style from './style.module.scss';

export const CreatePageComponent = ({ match, history }) => {
  const { categories, ledgerStore, isLoading, actions } = useContext(
    AppContext
  );

  const [selectedTab, setTab] = useState(TYPE_OUTCOME);
  const [selectedCategory, setCategory] = useState(null);
  const [validationPassed, setValidation] = useState(true);

  useEffect(() => {
    const { id } = match.params;
    actions.getEditData(id).then((data) => {
      const { editItem, categories } = data;
      setTab(id && editItem ? categories[editItem.cid].type : TYPE_OUTCOME);
      setCategory(id && editItem ? categories[editItem.cid] : null);
    });
  }, [match.params]); //eslint-disable-line

  const createPageTabs = useRef([
    {
      text: '支出',
      value: TYPE_OUTCOME,
      iconName: 'IosCard',
    },
    {
      text: '收入',
      value: TYPE_INCOME,
      iconName: 'IosCash',
    },
  ]);

  const tabChange = useCallback((index) => {
    setTab(createPageTabs.current[index].value);
  }, []);

  const selectCategory = useCallback((category) => {
    setCategory(category);
  }, []);

  const cancelSubmit = useCallback(() => {
    history.push('/');
  }, [history]);

  const submitForm = useCallback(
    (formData, isEditMode) => {
      if (!selectedCategory) {
        setValidation(false);
        return;
      }
      if (!isEditMode) {
        //創建模式
        actions.createData(formData, selectedCategory.id).then(() => {
          history.push('/');
        });
      } else {
        //編輯模式
        actions.editData(formData, selectedCategory.id).then(() => {
          history.push('/');
        });
      }
    },
    [history, selectedCategory, actions]
  );

  const selectedTabIndex = useMemo(() => {
    return createPageTabs.current.findIndex(
      (item) => item.value === selectedTab
    );
  }, [selectedTab, createPageTabs]);

  const categoryIdList = Object.keys(categories);
  const filterCategories = useMemo(() => {
    return categoryIdList
      .filter((id) => categories[id].type === selectedTab)
      .map((id) => categories[id]);
    //eslint-disable-next-line
  }, [selectedTab, categoryIdList.length]);

  const { id } = match.params;
  const editItem = useMemo(() => {
    return id && ledgerStore[id] ? ledgerStore[id] : {};
  }, [id, ledgerStore]);

  return (
    <div className={`${styleContainer['app-wrapper']} ${style['create-page']}`}>
      <div
        className={`${styleContainer['app-container']} ${style['app-container']} p-3`}
      >
        {isLoading && (
          <div className={style['loader-bg']}>
            <Loader />
          </div>
        )}
        <Tabs activeIndex={selectedTabIndex} onTabChange={tabChange}>
          {createPageTabs.current.map((item, index) => {
            return (
              <Tab key={index}>
                {<IconItem icon={item.iconName} />}
                {item.text}
              </Tab>
            );
          })}
        </Tabs>
        <CategorySelect
          categories={filterCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={selectCategory}
        />
        <LedgerForm
          ledgerItem={editItem}
          onFormSubmit={submitForm}
          onCancelSubmit={cancelSubmit}
        >
          {!validationPassed && (
            <div className="alert alert-warning">請選擇分類選項</div>
          )}
        </LedgerForm>
      </div>
    </div>
  );
};

CreatePageComponent.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export const CreatePage = withRouter(CreatePageComponent);
