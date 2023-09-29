import React, { FunctionComponent } from 'react';

import msg from '../../../../commons/languages';

import {
  CustomRequest,
  STATUS_MAP,
} from '@apps/domain/models/exp/CustomRequest';

import LinkListItem from '../../atoms/LinkListItem';

import './CustomRequestListItem.scss';

const ROOT = 'mobile-app-molecules-expense-custom-request-list-item';

type Props = CustomRequest & {
  onClickCustomRequestItem: (id: string, title: string) => void;
};

const CustomRequestListItem: FunctionComponent<Props> = ({
  id,
  title,
  employeeName,
  status,
  requestDate,
  onClickCustomRequestItem,
}) => {
  const onClickItem = () => {
    onClickCustomRequestItem(id, title);
  };

  return (
    <LinkListItem className={ROOT} onClick={onClickItem} noIcon>
      <div className={`${ROOT}__item`}>
        <div>{title}</div>
        <div className={`${ROOT}__item-employee-name`}>{employeeName}</div>
        <div className={`${ROOT}__item-status`}>
          {msg()[STATUS_MAP[status]]}
        </div>
        <div className={`${ROOT}__item-request-date`}>
          {`${msg().Exp_Lbl_RequestedDate}: ${requestDate}`}
        </div>
      </div>
    </LinkListItem>
  );
};

export default CustomRequestListItem;
