import React from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ children, activeIndex, onTabChange }) => {
  const selectTab = (e, index) => {
    e.preventDefault();
    onTabChange(index);
  };
  return (
    <ul className="nav nav-tabs nav-justified" data-testid="navTabs">
      {React.Children.map(children, (item, index) => {
        const activeClassName =
          index === activeIndex ? 'nav-link active' : 'nav-link';
        return (
          <li className="nav-item" data-test="navItem">
            <a
              className={activeClassName}
              onClick={(e) => {
                selectTab(e, index);
              }}
              role="button"
            >
              {item}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

const Tab = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

Tabs.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export { Tabs, Tab };
