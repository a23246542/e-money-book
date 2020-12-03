import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { padLeft, makeArrByRange } from '../utility';

const MonthPicker = ({year, month}) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedYear, setYear] = useState(year);
  const [selectedMonth, setMonth] = useState(month);

  const monthRange = makeArrByRange(12,1);
  const yearRange = makeArrByRange(9,-4).map(number=>number + year);

  const changeYear = (e,yearNum) => {
    e.preventDefault();
    // console.log(yearNum);
    setYear(yearNum);
  }

  const changeMonth = (e,monthNum) => {
    e.preventDefault();
    setMonth(monthNum);
  }
  
  return (
    <div className="dropdown">
      <p>請選擇</p>
      <button 
        className="btn btn-primary dropdown-toggle"
        onClick={()=>{ setOpen(!isOpen);}}
      >
        {`${year}年 ${padLeft(month)}月`}
      </button>
      { isOpen && 
        <div className="dropdown-menu dropdown-menu-right" 
            style={{display: 'block'}} //!!!BS4默認隱藏
        >
          <div className="row text-center">
            <div className="col border-right">
              { 
                yearRange.map((yearNum,index) =>
                  (
                    <a href="#" role="button" 
                      key={index}
                      //@@@參數括號沒辦法閉包參考到外部yearNum(變成undefined)
                      // onClick={(e,yearNum)=>{changeYear(e,yearNum)}}
                      className={ yearNum === selectedYear? `dropdown-item active`:`dropdown-item`}
                      onClick={(e)=>{changeYear(e,yearNum)}}
                    >
                      {`${yearNum}年`}
                    </a>
                  )
                )
              }
            </div>
            <div className="col">
              {
                monthRange.map((monthNum,index) => 
                  (
                    <a href="#" role="button" 
                      key={index}
                      className={ monthNum === selectedMonth? `dropdown-item active`:`dropdown-item`}
                      onClick={(e) => {changeMonth(e,monthNum)}}
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
