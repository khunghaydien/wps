import React from 'react';

import msg from '../../../../../commons/languages';
import Icon from '@commons/components/exp/Icon';

import './TransactionCard.scss';

import IconButton from '@mobile/components/atoms/IconButton';

const ROOT = 'mobile-app-transactions-card';

type Props = {
  cardName: string;
  transactionDetail: string;
  cardAmount: string;
  cardPaymentDate: string;
  isClaimed: boolean;
  isArchived: boolean;
  hideICCardTransaction: () => void;
  showAlert?: () => void;
};

const TransactionCard = (props: Props) => {
  const renderStatus = () => {
    if (props.isClaimed) {
      return (
        <div className={`${ROOT}-claimed`}>{msg().Exp_Lbl_TransClaimed}</div>
      );
    }
    const icon = props.isArchived ? 'hide' : 'preview';
    const title = props.isArchived
      ? msg().Exp_Lbl_MoveToUnArchive
      : msg().Exp_Lbl_MoveToArchive;
    return (
      <button
        className={`${ROOT}-archived`}
        onClick={props.hideICCardTransaction}
        type="button"
      >
        <Icon
          className={`${ROOT}-visible-icon-btn`}
          type={icon}
          color="#4c96ec"
        />
        <span>{title}</span>
      </button>
    );
  };

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__left`}>
        <div className={`${ROOT}__card-name-container`}>
          <span className={`${ROOT}__card-name`}>{props.cardName}</span>
          {props.showAlert && (
            <span>
              <IconButton
                className="info-icon"
                icon="info_alt"
                onClick={props.showAlert}
              />
            </span>
          )}
        </div>
        <div className={`${ROOT}__card-detail`}>{props.transactionDetail}</div>
        {renderStatus()}
      </div>
      <div className={`${ROOT}__right`}>
        <div className={`${ROOT}__card-amount`}>{props.cardAmount}</div>
        <div className={`${ROOT}__card-payment-date`}>
          {props.cardPaymentDate}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
