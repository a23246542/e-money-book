import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { IconItem } from '@/components/common';
import { Color } from '@/helpers/utility';

const CategorySelectComponent = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const selectCategory = (event, category) => {
    onSelectCategory(category);
    event.preventDefault();
  };

  const selectedCategoryId = selectedCategory && selectedCategory.id;

  return (
    <div className="category-select pt-4" data-testid="category-select">
      <div className="container">
        <div className="row">
          {categories.map((item, index) => {
            const iconColor =
              selectedCategoryId === item.id ? Color.white : Color.gray;
            const backColor =
              selectedCategoryId === item.id ? Color.blue : Color.lightGray;
            const activeClassName =
              selectedCategoryId === item.id
                ? 'col-3 category-item active mb-2'
                : 'col-3 category-item mb-2';
            return (
              <div
                className={activeClassName}
                key={item.id}
                data-testid={`category-item-${item.id}`}
                role="button"
                onClick={(e) => {
                  selectCategory(e, item);
                }}
              >
                {
                  <IconItem
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

CategorySelectComponent.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.object,
  onSelectCategory: PropTypes.func.isRequired,
};

const areEquals = (prevProps, nextProps) => {
  if (prevProps.categories && nextProps.categories) {
    return prevProps.categories !== nextProps.categories && false;
  }

  if (prevProps.selectedCategory && nextProps.selectCategory) {
    return (
      prevProps.selectedCategory.id !== nextProps.selectedCategory.id && false
    );
  }
  return true;
};

export const CategorySelect = memo(CategorySelectComponent, areEquals);
