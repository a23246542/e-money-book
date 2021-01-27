import { useContext } from 'react';
import PropTypes from 'prop-types';
import Ionicons from '../plugin/ionicons';
import AppContext from '../AppContext';
import Icon from '../components/common/Icon';

const LedgerList = ({ items, onModifyItem, onDeleteItem }) => {
  const { IosCreate, IosCloseCircle } = Ionicons;
  // const { categories } = useContext(AppContext);//%%%items就有了
  return (
    <ul className="list-group">
      {console.log('渲染list')
      }
      {items.map((item) => {
        // const {iconName:CategoryIcon} = item.category;//%%@@不行
        // const CategoryIcon = Ionicons[item.category.iconName]
        // const CategoryIcon = Ionicons[categories[item.cid].iconName]
        // const iconName = categories[item.cid].iconName;
        return (
          <li
            className="ledger-item list-group-item d-flex align-items-center"
            key={item.id}
            data-testid={`ledger-item-${item.id}`}
          >
            <span className="col-1 badge badge-primary">
              {/* <CategoryIcon
                  iconTitle={item.category.iconName}
                  color="#fff"
                /> */}
              {<Icon icon={item.category.iconName} color="#fff" />}
            </span>
            {/* <span className="col-11 bg-primary"></span> */}
            <span className="col-5 ledger-title">{item.title}</span>
            <span className="col-2 font-weight-bold">
              {/* {item.category.type === 'income'?
                  `${item.price}元`:
                  `-${item.price}元`
                } */}
              {item.category.type === 'income' ? '+' : '-'}
              {item.amount}元
            </span>
            <span className="col-2">{item.date}</span>
            <button
              className="col-1 btn d-flex justify-content-center align-items-center"
              // style={{backgroundColor:'#28a745'}}
              // onClick={onModifyItem(item)} //會傳直接執行的函式%%%
              onClick={(e) => {
                e.preventDefault();
                onModifyItem(item);
              }}
              data-testid={`editBtn-${item.id}`}
            >
              <IosCreate
                // icon="ios-create"
                fontSize="35px"
                color="#28a745"
                style={{
                  marginRight: '5px',
                }}
              />
              編輯
            </button>
            <button
              className="col-1 btn d-flex justify-content-center align-items-center"
              onClick={(e) => {
                e.preventDefault();
                onDeleteItem(item);
              }}
            >
              <IosCloseCircle
                // icon="ios-close-circle"
                fontSize="30px"
                color="#dc3545"
                style={{
                  marginRight: '5px',
                }}
              />
              刪除
            </button>
          </li>
        );
      })}
    </ul>
  );
};

LedgerList.propTypes = {
  items: PropTypes.array.isRequired,
  onModifyItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

// PriceList.defaultTypes = {

// }

export default LedgerList;
