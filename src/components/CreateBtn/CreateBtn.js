import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from '../../plugin/ionicons';

export const CreateBtn = ({ onCreateItem }) => {
  const { IosAddCircle } = Ionicons;
  return (
    <div
      className="btn btn-primary btn-block my-3"
      data-testid="createBtn"
      onClick={onCreateItem}
    >
      <IosAddCircle className="mr-2 align-bottom" color="#fff" />
      新增記帳
    </div>
  );
};

CreateBtn.propTypes = {
  onCreateItem: PropTypes.func.isRequired,
};

export default CreateBtn;
