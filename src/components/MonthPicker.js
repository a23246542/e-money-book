import React from 'react'
import PropTypes from 'prop-types'
import { padLeft } from '../utility';

const MonthPicker = ({year, month}) => {
  return (
    <div className="dropdown">
      <p>請選擇</p>
      <button className="btn btn-primary dropdown-toggle">
        {`${year}年 ${padLeft(month)}月`}
      </button>
      <div className="dropdown-menu">
        XXXxx
      </div>
    </div>
  )
}

MonthPicker.propTypes = {

}

export default MonthPicker
