import React from 'react';
import { shallow, mount } from 'enzyme';
import { Tabs, Tab} from '../Tabs';

const props = {
  activeIndex:0,
  onTabChange:jest.fn()
};
let wrapper = {};

describe('test Tabs and Tab component', ()=>{
  //進行每個最小用例之前，重新shallow
  beforeEach(()=>{
    wrapper = shallow(
      <Tabs {...props}>
        <Tab>1</Tab>
        <Tab>2</Tab>
      </Tabs>
    )
  })
  //渲染組件要符合快照
  it('should render the component to match the snapshot',()=>{
    expect(wrapper).toMatchSnapshot();
  })
  //默認渲染兩個tab，第一個標籤要是active

  //交互點第二個tab會改變active狀態跟觸發對的函式
})