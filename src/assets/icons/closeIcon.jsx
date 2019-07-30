

import React from 'react';
import PropTypes from 'prop-types';

const CloseIcon = ({height, width, color}) => (
  <svg width={width} height={height} viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0V0z"/>
    <path fill={color} d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
  </svg>
);

CloseIcon.defaultProps = {
  width: 24,
  height: 24,
  color: 'black'
};

CloseIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default CloseIcon;
