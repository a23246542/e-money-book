import React from 'react';
import PropTypes from 'prop-types';

let view = '';

const Tabs = ({ children, selectedTab, onTabChange }) => {
  view = selectedTab;
  return (
    <ul className="nav nav-tabs nav-fill my-4">
      {React.Children.map(children, (item, index) => item)}
    </ul>
  );
};

const Tab = ({ children }) => {
  const activeClassName = view === 'chart' ? 'nav-link active' : 'nav-link';
  return (
    <li className="nav-item">
      <div className={activeClassName}>{children}</div>
    </li>
  );
};

Tabs.propTypes = {};

// export default Tabs
export { Tabs, Tab };
