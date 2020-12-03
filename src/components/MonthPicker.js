import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { padLeft, makeArrByRange } from '../utility';

const MonthPicker = ({year, month}) => {
  const [isOpen, setOpen] = useState(false);

  const monthRange = makeArrByRange(12,1);
  const yearRange = makeArrByRange(9,-4).map(number=>number + year)
  
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
                      className="dropdown-item"
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
                      className="dropdown-item"
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
