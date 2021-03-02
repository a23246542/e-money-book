import React from 'react';
import PropTypes from 'prop-types';
import ionicons from '@/plugin/ionicons';

export const IconItem = ({ icon, ...props }) => {
  const IconComponent = ionicons[icon];
  return <IconComponent {...props} />;
};

IconItem.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default IconItem;
