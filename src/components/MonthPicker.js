import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { padLeft } from '../utility';

const MonthPicker = ({year, month}) => {
  const [isOpen, setOpen] = useState(false);
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
          XXX
        </div>
      }
    </div>
  )
}

MonthPicker.propTypes = {

}

export default MonthPicker
