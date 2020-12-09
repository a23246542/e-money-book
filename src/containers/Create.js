import React from 'react'
import PropTypes from 'prop-types'

const Create = ({ match }) => {
  return (
    <div>
      {match.params.id}頁
    </div>
  )
}

Create.propTypes = {

}

export default Create
