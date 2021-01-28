import React from 'react';
import PropTypes from 'prop-types';
import Icon from './common/Icon';
import { Color } from '../utility';

const CategorySelect = ({ categories, selectedCategory, onSelectCategory }) => {
  // const [selectedCategory,setSelectedCategory] = useState(selectedCategory)//@@會重複宣告

  const selectCategory = (event, category) => {
    // setSelectedCategory(category);
    onSelectCategory(category);
    event.preventDefault();
  };

  const selectedCategoryId = selectedCategory && selectedCategory.id;

  return (
    <div className="category-select pt-4" data-testid="category-select">
      <div className="container">
        <div className="row">
          {categories.map((item, index) => {
            const iconColor = selectedCategoryId === item.id ? Color.white : Color.gray;
            const backColor = selectedCategoryId === item.id ? Color.blue : Color.lightGray;
            const activeClassName = selectedCategoryId === item.id
              ? 'col-3 category-item active'
              : 'col-3 category-item';
            return (
              <div
                className={activeClassName}
                key={item.id}
                data-testid={item.id}
                role="button"
                onClick={(e) => {
                  selectCategory(e, item);
                }}
              >
                {
                  <Icon
                    icon={item.iconName}
                    className="rounded-circle"
                    style={{
                      backgroundColor: `${backColor}`,
                      padding: '6px',
                    }}
                    fontSize="40px"
                    color={iconColor}
                  />
                }
                <div className="mt-1">{item.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

CategorySelect.propTypes = {
  categories:PropTypes.array.isRequired,
  selectedCategory:PropTypes.object,
  onSelectCategory:PropTypes.func.isRequired,
};

export default CategorySelect;
