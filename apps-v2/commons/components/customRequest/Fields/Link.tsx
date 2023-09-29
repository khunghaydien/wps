import React from 'react';

import Label from './Label';

type Props = {
  label: string;
  value: string;
};

const Link = (props: Props) => {
  const { label, value } = props;

  return (
    <>
      <Label text={label} />
      <a href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    </>
  );
};

export default Link;
