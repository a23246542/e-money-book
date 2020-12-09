import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { padLeft, makeArrByRange } from '../utility';

const MonthPicker = ({year, month, choiceDate}) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedYear, setYear] = useState(year);
  const [selectedMonth, setMonth] = useState(month);
  let nodeMonthPicker = useRef(null);
  const monthRange = makeArrByRange(12,1);
  const yearRange = makeArrByRange(9,-4).map(number=>number + year);

  useEffect(() => {
    document.addEventListener('click',docHandleClick,false)
    return () => {
      console.log('组件销毁');
      document.removeEventListener('click',docHandleClick,false)
    }
  }, [''])

  const docHandleClick = (e) => {
    // if (this.node.current.contains(e.target)) {
    if (nodeMonthPicker.current.contains(e.target)) {// 要小抓大&!!contains可以Dom(字串)
      return;
    }  
    console.log(nodeMonthPicker.current);
    console.log(e.target);
    // toggleDropdown();
    console.log(isOpen);
    // setOpen((!isOpen));    
    setOpen(false);//%%%
  }

  const toggleDropdown = () => {
    console.log('開或關',!isOpen);
    // if(isOpen === true) {
    //   setOpen(false);
    // } else {
    //   setOpen(true);
    // }
    setOpen((!isOpen));    
  }

  const selectYear = (e,yearNum) => {
    e.preventDefault();
    // console.log(yearNum);
    setYear(yearNum);
  }

  const selectMonth = (e,monthNum) => {
    e.preventDefault();
    setMonth(monthNum);
    toggleDropdown();
    choiceDate(selectedYear,monthNum);
  }
  
  console.log('渲染');

  return (
    // <div className="dropdown" ref={ref=>{ this.node = ref}}>
    <div className="dropdown" ref={nodeMonthPicker}>
      <p>請選擇</p>
      <button 
        className="btn btn-primary dropdown-toggle"
        onClick={toggleDropdown}
      >
        {`${year}年 ${padLeft(month)}月`}
      </button>
      { isOpen && 
        <div className="dropdown-menu dropdown-menu-right" 
            style={{display: 'block'}} //!!!BS4默認隱藏
        >
          <div className="row text-center">
            <div className="col years-range border-right">
              { 
                yearRange.map((yearNum,index) =>
                  (
                    <a href="#" role="button" 
                      key={index}
                      //@@@參數括號沒辦法閉包參考到外部yearNum(變成undefined)
                      // onClick={(e,yearNum)=>{changeYear(e,yearNum)}}
                      className={ yearNum === selectedYear? `dropdown-item active`:`dropdown-item`}
                      onClick={(e)=>{selectYear(e,yearNum)}}
                    >
                      {`${yearNum}年`}
                    </a>
                  )
                )
              }
            </div>
            <div className="col months-range">
              {
                monthRange.map((monthNum,index) => 
                  (
                    <a href="#" role="button" 
                      key={index}
                      className={ monthNum === selectedMonth? `dropdown-item active`:`dropdown-item`}
                      onClick={(e) => {selectMonth(e,monthNum)}}
                    >
                      {`${padLeft(monthNum)}月`}
                    </a>
                  )
                )
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}

MonthPicker.propTypes = {

}

export default MonthPicker
