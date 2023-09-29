import React from 'react';

import IconButton from '@apps/commons/components/buttons/IconButton';
import { Label } from '@apps/core';

import './IconLabelButton.scss';

type Props = {
  icon: string;
  label: string;
  onClick: () => void;
};

const ROOT =
  'ts-expenses__form-records__bulk-edit__grid-area-cell-detail__icon-label-button';
const IconLabelButton = (props: Props): React.ReactElement => {
  const { icon, label, onClick } = props;
  return (
    <div className={ROOT} onClick={onClick}>
      <IconButton srcType="svg" src={icon} className={`${ROOT}__button`} />
      <Label color="accent" backgroundColor="base">
        {label}
      </Label>
    </div>
  );
};

export default IconLabelButton;
