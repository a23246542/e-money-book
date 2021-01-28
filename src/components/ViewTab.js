import PropTypes from 'prop-types';
import Ionicons from '../plugin/ionicons';
import { LIST_VIEW, CHART_VIEW } from '../constants';

const ViewTab = ({ activeTab, onTabChange }) => {
  const generateLinkClass = (current, view) => {
    return current === view ? 'nav-link active' : 'nav-link';
  };

  const { IosPaper, IosPie } = Ionicons;

  return (
    <ul className="nav nav-tabs nav-fill my-4">
      <li className="nav-item">
        {/* <a className="nav-link active" href="#"> */}
        <button
          className={generateLinkClass(LIST_VIEW, activeTab)}
          onClick={(e) => {
            e.preventDefault();
            onTabChange(LIST_VIEW);
          }}
          data-testid="listBtn"
        >
          <IosPaper
            className="mr-2 align-bottom"
            fontSize="25px"
            color="#007bff"
          />
          列表模式
        </button>
      </li>
      <li className="nav-item">
        <button
          className={generateLinkClass(CHART_VIEW, activeTab)}
          onClick={(e) => {
            e.preventDefault();
            onTabChange(CHART_VIEW);
          }}
          data-testid="chartBtn"
        >
          <IosPie
            className="mr-2 align-bottom"
            fontSize="25px"
            color="#007bff"
          />
          圖表模式
        </button>
      </li>
    </ul>
  );
};

ViewTab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ViewTab;
