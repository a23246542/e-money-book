import React from 'react';
import PropTypes from 'prop-types';
import ionicons from '../../plugin/ionicons';

// %%% props會undefined
// const Icon = ({icon, fontSize, color}) => {
const Icon = ({icon,...props}) => {
  let aa ='IosPlane';
  console.log(icon);
  
  const IconComponent = ionicons[icon];// %%icon要是字串讀取物件屬性
  return (
    <IconComponent
      {...props}
    />
  )
}

Icon.propTypes = {

}

export default Icon
