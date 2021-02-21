import React from 'react';
import PropTypes from 'prop-types';
import { IconItem } from '@/components/common';
import { Color } from '@/helpers/utility';

export const Loader = (props) => {
  return (
    <div className="loading-component">
      <IconItem
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
