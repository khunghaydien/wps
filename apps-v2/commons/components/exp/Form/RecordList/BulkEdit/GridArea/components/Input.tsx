import React from 'react';

import classNames from 'classnames';

import './Input.scss';

type Props = React.HTMLProps<HTMLInputElement> & {
  onChangeText?: (text: string) => void;
};

const ROOT =
  'ts-expenses__form-records__bulk-edit__grid-area-cell-detail__input';
const Input = (props: Props): React.ReactElement => {
  const { className } = props;

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChangeText) props.onChangeText(e.target.value);
  };

  return (
    <input
      type="text"
      {...props}
      className={classNames(ROOT, className)}
      onChange={onChangeText}
    />
  );
};

export default Input;
