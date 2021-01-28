import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { padLeft, makeArrByRange } from '../utility';

const MonthPicker = ({ year, month, choiceDate }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedYear, setYear] = useState(year);
  const [selectedMonth, setMonth] = useState(month);
  const nodeMonthPicker = useRef(null); // 指派monthPicker

  const docHandleClickWhenIsOpen = useCallback(
    (e) => {
      if (!nodeMonthPicker.current && !isOpen) {
        return;
      }

      if (nodeMonthPicker.current.contains(e.target)) {
        // 包含點擊的位置
        return;
      }
      setOpen(false);
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener('click', docHandleClickWhenIsOpen, false);
    return () => {
      document.removeEventListener('click', docHandleClickWhenIsOpen, false); //@@跳創建頁點擊還是會觸發
    };
  }, [docHandleClickWhenIsOpen]);

  const toggleDropdown = () => {
    setOpen((isOpen) => !isOpen);
  };

  const selectYear = (e, yearNum) => {
    e.preventDefault();
    setYear(yearNum);
  };

  const selectMonth = (e, monthNum) => {
    e.preventDefault();
    setMonth(monthNum);
    toggleDropdown();
    choiceDate(selectedYear, monthNum);
  };

  const monthRange = makeArrByRange(12, 1);
  const yearRange = makeArrByRange(9, -4).map((number) => number + year);

  return (
    <div className="dropdown" ref={nodeMonthPicker}>
      <p>請選擇</p>
      <button
        className="btn btn-primary dropdown-toggle"
        onClick={toggleDropdown}
      >
        {`${selectedYear}年 ${padLeft(selectedMonth)}月`}
      </button>
      {isOpen && (
        <div
          className="dropdown-menu dropdown-menu-left"
          style={{
            display: 'block',
            left: '50%',
          }} // BS4默認隱藏
        >
          <div className="row text-center">
            <div className="col-6 years-range border-right">
              {yearRange.map((yearNum, index) => (
                <a
                  href="/"
                  role="button"
                  key={index}
                  className={
                    yearNum === selectedYear
                      ? `dropdown-item active`
                      : `dropdown-item`
                  }
                  onClick={(e) => {
                    selectYear(e, yearNum);
                  }}
                >
                  {`${yearNum}年`}
                </a>
              ))}
            </div>
            <div className="col-6 months-range">
              {monthRange.map((monthNum, index) => (
                <a
                  href="/"
                  role="button"
                  key={index}
                  className={
                    monthNum === selectedMonth
                      ? `dropdown-item active`
                      : `dropdown-item`
                  }
                  onClick={(e) => {
                    selectMonth(e, monthNum);
                  }}
                >
                  {`${padLeft(monthNum)}月`}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

MonthPicker.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  choiceDate: PropTypes.func.isRequired,
};

export default MonthPicker;
