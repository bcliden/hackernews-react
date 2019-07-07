import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  onClick,
  className = '',
  style = {},
  children,
}) => (
  <button
    onClick={onClick}
    className={className}
    type="button"
    style={style}
  >
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
