import React, { useState, memo } from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Tabs = ({ children, activeIndex, onTabChange }) => {
  // const [Index,setIndex] = useState(1)
  // const [activeIndex,setActiveIndex] = useState(activeIndex1)
  const selectTab = (index) => {
    // setActiveIndex(index)
    onTabChange(index);
    console.log('onTabChange',index);
  };
  console.log('tabs渲染');
  return (
    <ul className="nav nav-tabs nav-pills nav-justified" data-testid="navTabs">
      {React.Children.map(children, (item, index) => {
        const activeClassName =
          index === activeIndex ? 'nav-link active' : 'nav-link';
        return (
          <li className="nav-item" data-test="navItem">
            <div
              className={activeClassName}
              onClick={() => {
                selectTab(index);
              }}
            >
              {item}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const Tab = memo(({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
});

Tabs.propTypes = {};

// export default Tabs
export { Tabs, Tab };
