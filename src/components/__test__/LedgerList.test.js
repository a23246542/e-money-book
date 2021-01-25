import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from '../../plugin/ionicons';
import IosPlane from 'react-ionicons/lib/IosPlane';
import { flattenArr } from '../../utility';
import { shallow, mount } from 'enzyme';
import LedgerList from '../LedgerList';
// import AppContext, { Provider } from '../../AppContext';
import { testCategories } from '../../testData';
import Icon from '../../components/common/Icon';

const category = {
  1: {
    name: '旅行',
    type: 'outcome',
    iconName: 'IosPlane',
  },
  2: {
    name: '領薪水',
    type: 'income',
    iconName: 'IosPlane',
  },
  3: {
    name: '投資',
    type: 'income',
    iconName: 'IosPlane',
  },
};

const items = [
  {
    id: 1,
    title: '去雲南旅遊',
    price: 200,
    date: '2020-11-26',
    categoryId: 1,
  },
  {
    id: 2,
    title: '領薪水',
    price: 1000,
    date: '2020-11-26',
    categoryId: 2,
  },
  {
    id: 3,
    title: '去台灣旅遊',
    price: 400,
    date: '2020-11-27',
    categoryId: 1,
  },
];

const listWithCategory = items.map((item) => {
  // item.category = category[item.categoryId];
  return {
    ...items,
    category: category[item.categoryId],
  };
});

const props = {
  items: listWithCategory,
  onModifyItem: jest.fn(),
  onDeleteItem: jest.fn(),
};

let wrapper;

describe('test LedgerList component', () => {
  beforeEach(() => {
    wrapper = mount(<LedgerList {...props} />);
    // wrapper = mount(<LedgerList {...props}/>)
  });

  it('should render component to match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct leger items length', () => {
    expect(wrapper.find('.list-group-item').length).toEqual(
      listWithCategory.length
    );
  });

  it('should render correct icon and price for each item', () => {
    // const { IosPlane } = Ionicons;
    // const icon = wrapper.find('.list-group-item').first().find(<IosPlane/>);
    const iconList = wrapper.find('.list-group-item').first().find(Icon); //要直接蒐組件不能用mount 要用shallow
    expect(iconList.first().props().icon).toEqual(
      listWithCategory[0].category.iconName
    );
  });
});
