import React,{ useState } from 'react'
import PropTypes from 'prop-types'
import Icon from './common/Icon';
import { Color } from '../utility';

const CategorySelect = ({categories, selectedCategory, onSelectCategory}) => {
  // const [selectedCategory,setSelectedCategory] = useState(selectedCategory)//@@會重複宣告
  // const selectedCategoryId = selectedCategory.id && selectedCategory.id;%%
  const selectedCategoryId = selectedCategory && selectedCategory.id;//@@const 可以等於undefined
  const selectCategory = (event, category) => {
    // setSelectedCategory(category);
    console.log('CategorySelect.js選中',category);
    onSelectCategory(category);

    event.preventDefault();
  }
  // console.log('CategorySelect.js',categories);

  return (
    <div className="category-select pt-4" data-testid="category-select">
      {/* //有row沒container會破版 */}
      <div className="container">
        <div className="row">
          {categories.map((item, index) => {
            const isActive = selectedCategoryId === item.id;
            const iconColor = isActive ? Color.white : Color.gray;
            const backColor = isActive ? Color.blue : Color.lightGray;
            const activeClassName = isActive ? 'col-3 category-item active' : 'col-3 category-item'
            // const activeClass = selectedCategory.id === item.id ?
            return (
              <div className={activeClassName} key={item.id} data-testid={item.id}
                  onClick={(e)=>{selectCategory(e, item)}}
              >
                {<Icon
                  icon={item.iconName}
                  className="rounded-circle"
                  style={{backgroundColor:`${backColor}`,padding:'6px'}}
                  fontSize="40px"
                  color={iconColor}
                />}
                <div className="mt-1">
                  {item.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

CategorySelect.propTypes = {

}

export default CategorySelect
