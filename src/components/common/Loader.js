import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { Color } from '../../helpers/utility';

const Loader = (props) => {
  return (
    <div className="loading-component">
      <Icon
        icon="IosRefresh"
        fontSize="50px"
        color={Color.blue}
        rotate={true}
      />
      <p className="h6">加載中</p>
    </div>
  );
};

Loader.propTypes = {};

export default Loader;
