import PropTypes from 'prop-types';
import { IconItem } from '@/components/common';

export const LedgerList = ({ items, onModifyItem, onDeleteItem }) => {
  return (
    <ul className="list-group" data-testid="ledgerList">
      {items.map((item) => {
        return (
          <li
            className="ledger-item list-group-item d-flex align-items-center"
            key={item.id}
            data-testid={`ledger-item-${item.id}`}
            title="ledger-item"
          >
            <span className="col-1 badge badge-primary">
              {<IconItem icon={item.category.iconName} color="#fff" />}
            </span>
            <span className="col-5 ledger-title">{item.title}</span>
            <span className="col-2 font-weight-bold">
              {item.category.type === 'income' ? '+' : '-'}
              {item.amount}元
            </span>
            <span className="col-2">{item.date}</span>
            <button
              className="col-1 btn btn-edit d-flex justify-content-center align-items-center"
              onClick={(e) => {
                e.preventDefault();
                onModifyItem(item);
              }}
              data-test="editBtn"
              data-testid={`editBtn-${item.id}`}
            >
              <IconItem
                icon="IosCreate"
                fontSize="35px"
                color="#28a745"
                style={{
                  marginRight: '5px',
                }}
              />
              編輯
            </button>
            <button
              className="col-1 btn btn-delete d-flex justify-content-center align-items-center"
              onClick={(e) => {
                e.preventDefault();
                onDeleteItem(item);
              }}
              data-test="deleteBtn"
            >
              <IconItem
                icon="IosCloseCircle"
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
