import { memo } from 'react';
import PropTypes from 'prop-types';
import { IconItem } from '@/components/common';
import style from './style.module.scss';

const LedgerListComponent = ({ items, onModifyItem, onDeleteItem }) => {
  return (
    <ul className="list-group list-group-flush" data-testid="ledgerList">
      {items.map((item) => {
        return (
          <li
            className="ledger-item list-group-item d-flex align-items-center pr-0 pl-2 no-gutters border-top border-bottom"
            key={item.id}
            data-testid={`ledger-item-${item.id}`}
            title="ledger-item"
          >
            <div className="col-1 text-center">
              <span
                className={`${style['category-icon']} badge badge-primary rounded-circle`}
              >
                <IconItem
                  icon={item.category.iconName}
                  color="#fff"
                  fontSize="20px"
                />
              </span>
            </div>
            <div className="col-5 ledger-title">{item.title}</div>
            <div className="col-2 font-weight-bold">
              {item.category.type === 'income' ? '+' : '-'}
              {item.amount}
            </div>
            <span className="col-2">{item.date.replace('2021-', '')}</span>
            <button
              className="col-1 btn btn-edit d-flex justify-content-center align-items-center"
              onClick={(e) => {
                e.preventDefault();
                onModifyItem(item);
              }}
              data-test="editBtn"
              data-testid={`editBtn-${item.id}`}
              title="editBtn"
            >
              <IconItem
                icon="IosCreate"
                fontSize="23px"
                color="#28a745"
                style={{
                  marginRight: '5px',
                }}
              />
              {/* 編輯 */}
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
                fontSize="20px"
                color="#dc3545"
                style={{
                  marginRight: '5px',
                }}
              />
              {/* 刪除 */}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

LedgerListComponent.propTypes = {
  items: PropTypes.array.isRequired,
  onModifyItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export const LedgerList = memo(LedgerListComponent);
