import PropTypes from 'prop-types';
import Ionicons from '../plugin/ionicons';
import { LIST_VIEW, CHART_VIEW } from '../constants';

const ViewTab = ({ activeTab, onChangeView }) => {

  const generateLinkClass = (current, view) => {
    return (current === view )? "nav-link active" : "nav-link"
  }

  const { IosPaper , IosPie } = Ionicons;


  return(
    <ul className="nav nav-tabs nav-fill my-4">
      <li className="nav-item">
        {/* <a className="nav-link active" href="#"> */}
        <a 
          className={ generateLinkClass(LIST_VIEW,activeTab)} 
          href="#"
          onClick={(e) => {e.preventDefault(); onTabChange(LIST_VIEW)}}
        >
          <IosPaper
            className="mr-2 align-bottom"
            fontSize="25px"
            color="#007bff"
          />列表模式
        </a>
      </li>
      <li className="nav-item">
        <a 
          className={ generateLinkClass(CHART_VIEW,activeTab)}
          href="#"
          onClick={(e)=>{e.preventDefault();onChangeView(CHART_VIEW)}}
          >
          <IosPie
            className="mr-2 align-bottom"
            fontSize="25px"
            color="#007bff"
          />圖表模式
        </a>
      </li>
    </ul>
  ) 
}

ViewTab.propTypes = {
  activeTab:PropTypes.string.isRequired
}


export default ViewTab;