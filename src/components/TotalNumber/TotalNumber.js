import { memo } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';

const TotalNumberComponent = ({ income, outcome }) => {
  return (
    <div className={style['container']}>
      <ul className={style['row']}>
        <li className={style['item']}>
          <span>收入:</span>
          {income}
        </li>
        <li className={style['item']}>
          <span>支出:</span>
          {outcome}
        </li>
      </ul>
    </div>
  );
};

TotalNumberComponent.propTypes = {
  income: PropTypes.number.isRequired,
  outcome: PropTypes.number.isRequired,
};

export const TotalNumber = memo(TotalNumberComponent);
