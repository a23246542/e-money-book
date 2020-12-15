import React from 'react'
import PropTypes from 'prop-types';
import Ionicons from '../plugin/ionicons';


const CreateBtn = ({onCreateItem}) => {

  const { IosAddCircle }  = Ionicons;
  return (
    <div className="btn btn-primary btn-block my-3"
      onClick={onCreateItem}
    >
      <IosAddCircle
        className="mr-2 align-bottom"
        color="#fff"
      />創建一個項目
    </div>
  )
}

CreateBtn.propTypes = {

}

export default CreateBtn
