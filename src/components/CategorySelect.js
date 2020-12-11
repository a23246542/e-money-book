import React from 'react'
import PropTypes from 'prop-types'
import Icon from './common/Icon';

const CategorySelect = ({categories, onSelectCategory}) => {
  return (
    <div className="category-select">
      <div className="row">
        {categories.map((item, index) => {
          return (
            <div className="col-3 category-item" key={item.id}>
              {<Icon
                icon={item.iconName}
                className="rounded-circle"
                style={{backgroundColor:'#efefef',padding:'6px'}} 
                fontSize="40px"
                color="#555"
              />}{item.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

CategorySelect.propTypes = {

}

export default CategorySelect
