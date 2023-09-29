import React from 'react';

import './index.scss';

const ROOT = 'ts-navigation-button';

type Props = {
  imgAlt: string;
  imgSrc: string;
  onClick: any;
  title: string;
};

const NavigationButton = (props: Props) => {
  return (
    <button type="button" className={ROOT} onClick={props.onClick}>
      <img src={props.imgSrc} alt={props.imgAlt} />
      <span>{props.title}</span>
    </button>
  );
};

export default NavigationButton;
