import { memo } from 'react';
import PropTypes from 'prop-types';

const TotalNumberComponent = ({ income, outcome }) => {
  return (
    <div className="container">
      <ul className="row justify-content-center">
        <li className="col-3">收入:{income}</li>
        <li className="col-3">支出:{outcome}</li>
      </ul>
    </div>
  );
};

TotalNumberComponent.propTypes = {
  income: PropTypes.number.isRequired,
  outcome: PropTypes.number.isRequired,
};

export const TotalNumber = memo(TotalNumberComponent);
