import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { padLeft, makeArrByRange } from '../utility';

const MonthPicker = ({year, month}) => {
  const [isOpen, setOpen] = useState(false);

  const monthArr = makeArrByRange(12,1);
  const yearArr = makeArrByRange(9,-4).map(item=>{
    return item+year;
  });
  
  return (
    <div className="dropdown">
      <p>請選擇</p>
      <button 
        className="btn btn-primary dropdown-toggle"
        onClick={()=>{ setOpen(!isOpen);}}
      >
        {`${year}年 ${padLeft(month)}月`}
      </button>
      { isOpen&& 
        <div className="dropdown-menu dropdown-menu-right" 
            style={{display: 'block'}} //!!!BS4默認隱藏
        >
          <div className="row text-center">
            <div className="col border-right">
              { yearArr.map( (year,index)=>{
                return (
                  <a href="#" key={index}
                    className="dropdown-item"
                  >
                    {`${year}年`}
                  </a>
                )
              })}
            </div>
            <div className="col">
              {
                monthArr.map((month,index) => {
                  return (
                    <a href="#" key={index}
                      className="dropdown-item"
                    >
                      {`${padLeft(month)}月`}
                    </a>
                  )
                })
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
