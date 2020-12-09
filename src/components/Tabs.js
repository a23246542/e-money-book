import React from 'react';
// import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'

const Tabs = ({children,activeIndex,onTabChange}) => {

  const selectTab = (index) => {
    onTabChange(index)
  }
  console.log('tabs渲染');
  return (
    <ul className="nav nav-tabs nav-fill">
      {React.Children.map(children,(item,index)=>{
        const activeClassName = index === activeIndex? 'nav-link active': 'nav-link'
        return(
          <li className="nav-item"
            onClick={()=>{selectTab(index)}}
          >
            <div className={activeClassName}>{item}</div>
          </li>
        )
      })}
    </ul>
  )
}

const Tab = ({children}) =>{
  return(
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}

Tabs.propTypes = {

}

// export default Tabs
export { Tabs, Tab}
