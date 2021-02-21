import React from 'react';
import PropTypes from 'prop-types';
import ionicons from '@/plugin/ionicons';

// %%% props會undefined
// const Icon = ({icon, fontSize, color}) => {
export const IconItem = ({ icon, ...props }) => {
  const IconComponent = ionicons[icon]; // %%icon要是字串讀取物件屬性
  return <IconComponent {...props} />;
};

IconItem.propTypes = {};

export default IconItem;
