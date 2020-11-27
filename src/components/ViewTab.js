import PropTypes from 'prop-types';
import Ionicons from '../plugin/ionicons';
import { LIST_VIEW, CHART_VIEW } from '../constants';

const ViewTab = ({ activeTab, onTabChange }) => {

  const generateLinkClass = (current, view) => {
    return (current === view )? "nav-link active" : "nav-link"
  }

  return(
    <ul className="nav nav-tabs nav-fill my-4">
      <li className="nav-item">
        {/* <a className="nav-link active" href="#"> */}
        <a className={ generateLinkClass(LIST_VIEW,activeTab)} href="#">
          列表模式
        </a>
      </li>
      <li className="nav-item">
        <a className={ generateLinkClass(CHART_VIEW,activeTab)} href="#">
          圖表模式
        </a>
      </li>
    </ul>
  ) 
}

ViewTab.propTypes = {
  activeTab:PropTypes.string.isRequired
}


export default ViewTab;