import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { padLeft, makeArrByRange } from '@/helpers/utility';
import style from './style.module.scss';

const MonthPickerComponent = ({ year, month, choiceDate }) => {
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
    <div
      className={`dropdown ${style['monthPicker-dropdown']}`}
      ref={nodeMonthPicker}
      data-testid="MonthPicker"
    >
      <button
        className="btn btn-primary dropdown-toggle"
        onClick={toggleDropdown}
        data-testid="MonthPicker-button"
      >
        {`${selectedYear}年 ${padLeft(selectedMonth)}月`}
      </button>
      {isOpen && (
        <div
          className={`${style['dropdownMenu']} dropdown-menu dropdown-menu-left`}
          style={{
            display: 'block',
            left: '50%',
          }} // BS4默認隱藏
        >
          <div className="row text-center no-gutters">
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
                  data-testid={`MonthPicker-year-${yearNum}`}
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
                  data-testid={`MonthPicker-month-${padLeft(monthNum)}`}
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

MonthPickerComponent.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  choiceDate: PropTypes.func.isRequired,
};

const areEquals = (prevProps, nextProps) => {
  if (
    prevProps.year === nextProps.year &&
    prevProps.month === nextProps.month
  ) {
    return true;
  }
};

export const MonthPicker = memo(MonthPickerComponent, areEquals);
