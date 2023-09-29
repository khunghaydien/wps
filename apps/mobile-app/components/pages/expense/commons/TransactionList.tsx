import React from 'react';

import msg from '@apps/commons/languages';
import Navigation from '@mobile/components/molecules/commons/Navigation';

import './TransactionList.scss';

import Button from '@mobile/components/atoms/Button';
import Wrapper from '@mobile/components/atoms/Wrapper';

type Props = {
  rowContent: Array<Record<string, unknown>>;
  selectedIds: string[];
  displayHint?: boolean;
  mainBtnLabel?: string;
  onSelectRow: (string) => void;
  onClickBack: () => void;
  onClickMainButton: () => void;
};

const ROOT = 'mobile-app-pages-transaction-list';

const TransactionList = (props: Props) => {
  const list = props.rowContent.map((item, idx) => {
    const recordId = item.props['data-id'];
    const isSelected = props.selectedIds.indexOf(recordId) > -1;
    return (
      <div key={idx} className={`${ROOT}__row`}>
        <>
          {item}
          <label className={`${ROOT}__img-radio radio-container`}>
            <input
              type="checkbox"
              value={recordId}
              onClick={props.onSelectRow}
              checked={isSelected}
            />
            <span className="checkmark" />
          </label>
        </>
      </div>
    );
  });

  const noOfSelected = props.selectedIds.length;
  const isButtonDisabled = noOfSelected === 0 || noOfSelected > 20;

  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_SelectTransaction}
        onClickBack={props.onClickBack}
      />
      <div className="main-content">
        {list}
        {list.length === 0 && (
          <div className={`${ROOT}__has-zero`}>
            {msg().Com_Lbl_ZeroSearchResult}
          </div>
        )}
      </div>

      <div className={`${ROOT}__next`}>
        <Button
          priority="primary"
          variant="neutral"
          type="submit"
          className={`${ROOT}__next-btn`}
          onClick={props.onClickMainButton}
          disabled={isButtonDisabled}
        >
          {props.mainBtnLabel || msg().Com_Lbl_NextButton}
        </Button>
        {props.displayHint && (
          <div className={`${ROOT}__next-hint`}>
            {msg().Exp_Msg_MaxTwentyICTransaction}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default TransactionList;
