import React from 'react';
import { Props as defaultProps, Rnd } from 'react-rnd';

import './DraggableResizable.scss';

const DraggableResizable = (props: defaultProps) => {
  return <Rnd {...props}>{props.children}</Rnd>;
};

export default DraggableResizable;
