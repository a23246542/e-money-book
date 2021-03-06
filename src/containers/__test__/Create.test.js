import React from 'react';
import { shallow, mount } from 'enzyme';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { CreatePageComponent } from '@/containers';
import {
  parseToYearsAndMonth,
  flattenArr,
  makeArrByRange,
} from '@/helpers/utility';
import { CategorySelect, LedgerForm, Tabs } from '@/components';
import { Loader } from '@/components/common';
import { testCategories, testItems } from '@/helpers/testData';
import AppContext from '@/contexts/AppContext';
import { act } from 'react-dom/test-utils';
import { screen } from '@testing-library/react';

const testItem = testItems[1];

const createMatch = { params: { id: '' } };
const editMatch = {
  params: {
    id: testItem.id,
  },
};
const history = { push: () => {} };

const actions = {
  getEditData: jest.fn().mockResolvedValue({
    editItem: testItem,
    categories: flattenArr(testCategories),
  }),
  createData: jest.fn().mockReturnValue(Promise.resolve('')),
  editData: jest.fn().mockReturnValue(Promise.resolve('')),
};

const initData = {
  ledgerStore: {},
  categories: {},
  isLoading: false,
  currentDate: parseToYearsAndMonth(),
  actions,
};

const loadingData = {
  ...initData,
  isLoading: true,
};

const withLoadedData = {
  ledgerStore: flattenArr(testItems),
  categories: flattenArr(testCategories),
  isLoading: false,
  currentDate: parseToYearsAndMonth(),
  actions,
};

let wrapper;
// const setInputValue = (selector, newValue) => {
//   wrapper.find(selector).instance().value = newValue;
// };

describe('test Create component init behavior', () => {
  beforeEach(() => {
    wrapper = mount(
      <AppContext.Provider value={initData}>
        <CreatePageComponent match={createMatch} history={history} />
      </AppContext.Provider>
    );
  });

  it('test Create page for the first render，getEditData should be called with right params', (done) => {
    setTimeout(() => {
      expect(actions.getEditData.mock.calls.length).toBe(1);
      done();
    }, 0);
  });

  it('should show loading component when isLoading is true', () => {
    wrapper = mount(
      <AppContext.Provider value={loadingData}>
        <CreatePageComponent match={createMatch} history={history} />
      </AppContext.Provider>
    );
    expect(wrapper.find(Loader).length).toEqual(1);
  });
});

describe('test component when in create mode', () => {
  beforeEach(() => {
    wrapper = mount(
      <AppContext.Provider value={withLoadedData}>
        <CreatePageComponent match={createMatch} history={history} />
      </AppContext.Provider>
    );
  });

  it('should pass the null to props selectedCategory for CategorySelect', () => {
    expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(null);
  });

  it('should pass empty object for PriceForm', () => {
    expect(wrapper.find(LedgerForm).props().ledgerItem).toEqual({});
    expect(wrapper.find(Tabs).props().activeIndex).toEqual(0);
  });

  it('submit the form, the addItem should not be triggered', () => {
    wrapper.find('form').simulate('submit');
    expect(actions.createData).not.toHaveBeenCalled();
  });

  it('fill all inputs, and select the category, submit the form, addItem should be called', (done) => {
    setTimeout(() => {
      wrapper.update();
      wrapper.find('.category-item').first().simulate('click');
      wrapper
        .find('#inputTitle')
        .simulate('change', { target: { value: 'new title' } });
      wrapper
        .find('#inputAmount')
        .simulate('change', { target: { value: '200' } });
      wrapper
        .find('#inputDate')
        .simulate('change', { target: { value: '2021-01-02' } });
      setTimeout(() => {
        wrapper.update();
        wrapper.find('#submit').simulate('click');
        setTimeout(() => {
          const testData = {
            title: 'new title',
            amount: 200,
            date: '2021-01-02',
          };
          expect(actions.createData).toHaveBeenCalledWith(
            testData,
            testCategories[0].id
          );
          done();
        }, 100);
      }, 100);
    }, 100);
  });

  it.only('fill all inputs, and select the category, submit the form, addItem should be called with test-library-react', async () => {
    const { getByTestId, getByText, container, debug } = render(
      <AppContext.Provider value={withLoadedData}>
        <CreatePageComponent match={createMatch} history={history} />
      </AppContext.Provider>
    );
    // debug(getByTestId('category-select'));
    fireEvent.click(getByText('旅行'), { preventDefault: () => {} });
    fireEvent.change(getByTestId('inputTitle'), {
      target: { value: 'new title' },
    });
    fireEvent.change(getByTestId('inputAmount'), { target: { value: '200' } });
    fireEvent.change(getByTestId('inputDate'), {
      target: { value: '2021-01-02' },
    });
    fireEvent.click(getByTestId('submit'));

    const testData = { title: 'new title', amount: 200, date: '2021-01-02' };
    await waitFor(() => {
      expect(actions.createData.mock.calls[0]).toEqual([
        testData,
        testCategories[0].id,
      ]);
    });
    cleanup();
  });
});

describe('test component when in edit mode', () => {
  beforeEach(() => {
    wrapper = mount(
      <AppContext.Provider value={withLoadedData}>
        <CreatePageComponent match={editMatch} history={history} />
      </AppContext.Provider>
    );
  });

  const selectedCategory = testCategories.find(
    (category) => testItem.cid === category.id
  );

  it('should pass the right category to props selectedCategory for CategorySelect', (done) => {
    setTimeout(() => {
      //等待getEditDate
      wrapper.update();
      expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(
        selectedCategory
      );
      done();
    }, 100);
  });

  it('modify some inputs and submit the form, modifyItem should be called', (done) => {
    setTimeout(() => {
      wrapper.update();
      wrapper
        .find('#inputTitle')
        .simulate('change', { target: { value: 'new title' } });
      wrapper.find('#submit').simulate('click');
      const testData = { ...testItem, title: 'new title' };
      expect(actions.editData).toHaveBeenCalledWith(
        testData,
        selectedCategory.id
      );
      done();
    }, 100);
  });

  //MemoyRouter跳頁
});
