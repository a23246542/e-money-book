import React from 'react';
import { shallow, mount } from 'enzyme';
import { CategorySelect } from '@/components';
import { IconItem } from '@/components/common';
import { testCategories } from '@/helpers/testData';
// import "jest-fix-undefined";

export const categories = [
  {
    id: '1',
    name: '旅行',
    type: 'outcome',
    iconName: 'IosPlane',
  },
  {
    id: '2',
    name: '理财',
    type: 'income',
    //  "iconName": "logo-yen",
    //  "iconName": "ios-plane",
    iconName: 'IosPaper',
  },
  {
    id: '3',
    name: '理财',
    type: 'income',
    iconName: 'IosPlane',
  },
];

const props = {
  categories: testCategories,
  onSelectCategory: jest.fn(),
};

const props_with_category = {
  categories: testCategories,
  selectedCategory: testCategories[0],
  onSelectCategory: jest.fn(),
};

let wrapper;

describe('test CategorySelect component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component to match the snapshot', () => {
    wrapper = shallow(<CategorySelect {...props_with_category} />);
    expect(wrapper).toMatchSnapshot();
  });
  //~~~with傳入的意思
  it('render with categories should render the correct times and icon', () => {
    wrapper = shallow(<CategorySelect {...props} />);

    expect(wrapper.find('.category-item').length).toBe(testCategories.length);
    expect(wrapper.find('.category.active').length).toBe(0);

    const firstIcon = wrapper.find(IconItem).first();
    expect(firstIcon.length).toBe(1);
    expect(firstIcon.props().icon).toBe(testCategories[0].iconName);
  });

  it('render with selectedCategory should highlight the correct item', () => {
    wrapper = shallow(<CategorySelect {...props_with_category} />);
    expect(wrapper.find('.category-item').first().hasClass('active')).toBe(
      true
    );
  });

  it('click the item should add active class and trigger the callback', () => {
    wrapper = shallow(<CategorySelect {...props_with_category} />);

    wrapper
      .find('.category-item')
      .at(1)
      .simulate('click', { preventDefault: () => {} });
    expect(props_with_category.onSelectCategory).toHaveBeenCalledWith(
      props_with_category.categories[1]
    );

    wrapper.setProps({
      selectedCategory: testCategories[1],
    });
    expect(wrapper.find('.category-item').at(0).hasClass('active')).toBe(false);
    expect(wrapper.find('.category-item').at(1).hasClass('active')).toBe(true);
  });
});
