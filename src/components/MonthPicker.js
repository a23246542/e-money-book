import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import AppContext from '../AppContext';
import PropTypes from 'prop-types';
import { padLeft, makeArrByRange } from '../utility';

const MonthPicker = ({ year, month, choiceDate, path }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedYear, setYear] = useState(year);
  const [selectedMonth, setMonth] = useState(month);
  const nodeMonthPicker = useRef(null);
  // const { node } = useConetxt(AppContext);
  // const node = useRef(null);
  const monthRange = makeArrByRange(12, 1);
  const yearRange = makeArrByRange(9, -4).map((number) => number + year);

  console.log('渲染');
  const docHandleClick = useCallback((e, node) => {
    // if (this.node.current.contains(e.target)) {
    console.log(nodeMonthPicker);
    console.log(node);
    if (!nodeMonthPicker.current) {
      return;
    }
    if (nodeMonthPicker.current.contains(e.target)) {
      // 要小抓大&!!contains可以Dom(字串)
      // if (node.current.contains(e.target)) {
      return;
    }
    // console.log(nodeMonthPicker.current);
    // console.log(e.target);
    // toggleDropdown();
    // console.log(isOpen);
    // setOpen((!isOpen));
    setOpen(() => false); //%%%@@取得同步
  }, []); //@@不放isOpen
  // console.log(path);
  useEffect(() => {
    document.addEventListener('click', docHandleClick, false);
    // document.addEventListener('click',(e,nodeMonthPicker)=>{docHandleClick(e,nodeMonthPicker)},false)
    // document.addEventListener('click',()=>{docHandleClick},false)//@@@這樣才成功 且不能傳入參數
    return () => {
      console.log('组件销毁');
      document.removeEventListener('click', docHandleClick, false); //@@跳創建頁點擊還是會觸發
      // document.removeEventListener('click',()=>{docHandleClick()},false)
    };
    // }, [''])
  }, [docHandleClick]);

  // useEffect(()=>{
  //   choiceDate(selectedYear,selectedMonth);
  //   console.log('useEffect');
  // },[selectedYear,selectedMonth,choiceDate])//@@變成choiceDate需要層層useCallback
  // },[selectedMonth,choiceDate])//@@變成choiceDate需要層層useCallback

  const toggleDropdown = () => {
    console.log('開或關', !isOpen);
    // if(isOpen === true) {
    //   setOpen(false);
    // } else {
    //   setOpen(true);
    // }
    setOpen((isOpen) => !isOpen);
  };

  const selectYear = (e, yearNum) => {
    e.preventDefault();
    // console.log(yearNum);
    setYear(yearNum);
  };

  const selectMonth = (e, monthNum) => {
    e.preventDefault();
    // setMonth(monthNum);
    setMonth(() => monthNum); //!!后面函式同样有影响%%後面吃到selectedYear的還是舊的
    // setMonth(()=> {
    //   // toggleDropdown();
    //   // choiceDate(selectedYear,selectedMonth);
    //   return monthNum;
    // })
    // console.log('choiceDate',selectedYear,selectedMonth);
    toggleDropdown();
    choiceDate(selectedYear, monthNum); //!!最簡單的方法用舊的值
  };

  // const isFirstRender = useRef(true)
  // useEffect(()=>{//!!可是會有不想mount就toggle down的問題 用useRef
  //   if(!isFirstRender.current) {
  //     toggleDropdown();
  //     choiceDate(selectedYear,selectedMonth);
  //   } else {
  //     isFirstRender.current = false
  //   }
  // },[selectedMonth])//%%可是有個問題點了12月再點關不掉

  // console.log('渲染');

  return (
    // <div className="dropdown" ref={ref=>{ this.node = ref}}>
    // <div className="dropdown" ref={(ref) => {node = ref}}>
    <div className="dropdown" ref={nodeMonthPicker}>
      {/* <div className="dropdown" ref={node}> */}
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
          }} //!!!BS4默認隱藏
        >
          <div className="row text-center">
            <div className="col-6 years-range border-right">
              {yearRange.map((yearNum, index) => (
                <a
                  href="/"
                  role="button"
                  key={index}
                  //@@@參數括號沒辦法閉包參考到外部yearNum(變成undefined)
                  // onClick={(e,yearNum)=>{changeYear(e,yearNum)}}
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

MonthPicker.propTypes = {};

export default MonthPicker;
