import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import NextButton from '../../../commons/images/btnNextArrow.svg';
import PrevButton from '../../../commons/images/btnPreviousArrow.svg';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import { Text } from '../../../core';
import SubRoleInfo from '@apps/commons/components/exp/SubRole/SubRoleInfo/SubRoleInfo';

import { MAX_SEARCH_RESULT_NUM } from '../../modules/ui/FinanceApproval/RequestList/page';

import './SubHeaderPager.scss';

const ROOT = 'ts-finance-approval-sub-header-pager';

export type Props = {
  // TODO Remove 'record : boolean' code after the pagination < > is moved down to Report Summary Header
  currentRequestIdx: number;
  isBulkEditMode?: boolean;
  isPartialLoading?: boolean;
  overlap: { hasSubrole?: boolean; record: boolean; report: boolean };
  requestTotalNum: number;
  showPagination: boolean;
  showSubrole?: boolean;
  subroleEditable?: boolean;
  // event handlers
  onClickBackButton: () => void;
  onClickNextToRequestButton: (arg0: number) => void;
  onClickSubRoleInfo?: () => void;
};

const SubHeaderPager = ({
  showPagination,
  overlap,
  currentRequestIdx,
  isBulkEditMode,
  isPartialLoading,
  requestTotalNum,
  onClickNextToRequestButton,
  onClickBackButton,
  subroleEditable,
  showSubrole,
  onClickSubRoleInfo,
}: Props) => {
  if (!overlap.report) {
    return null;
  }

  const displayNum = TextUtil.template(
    msg().Exp_Lbl_NumberDisplay,
    currentRequestIdx + 1,
    requestTotalNum
  );

  const isVisible = currentRequestIdx !== -1;
  const isNotFirstPage = currentRequestIdx !== 0;
  const isNotLastPage =
    currentRequestIdx < requestTotalNum - 1 &&
    currentRequestIdx + 1 < MAX_SEARCH_RESULT_NUM;

  const prevArrowColorClass = isNotFirstPage ? `${ROOT}__active-arrow` : '';
  const nextArrowColorClass = isNotLastPage ? `${ROOT}__active-arrow` : '';
  const isNotBulkEditMode = !isBulkEditMode;
  const isShowNavArrow = !overlap.record && isNotBulkEditMode;
  const isDisableBackToListBtn = isBulkEditMode && isPartialLoading;

  return (
    <div className={ROOT}>
      <Button
        type="text"
        className={`${ROOT}__back-btn`}
        data-testid={`${ROOT}-back-btn`}
        disabled={isDisableBackToListBtn}
        onClick={onClickBackButton}
      >
        <Text size="large" color="action">
          {msg().Com_Lbl_BackToList}
        </Text>
      </Button>
      {isVisible && showPagination && (
        <div className={`${ROOT}__contents`}>
          <div
            className={`${ROOT}__previous-request-btn ${prevArrowColorClass}`}
          >
            {isShowNavArrow && // TODO Remove '!overlap.record' code after the pagination < > is moved down to Report Summary Header
              (isNotFirstPage ? (
                <a onClick={() => onClickNextToRequestButton(-1)} href={null}>
                  <PrevButton aria-hidden="true" />
                </a>
              ) : (
                <PrevButton aria-hidden="true" />
              ))}
          </div>
          {isNotBulkEditMode && (
            <div className={`${ROOT}__current-page`}>{displayNum}</div>
          )}

          <div className={`${ROOT}__next-request-btn ${nextArrowColorClass}`}>
            {isShowNavArrow && // TODO Remove '!overlap.record' code after the pagination < > is moved down to Report Summary Header
              (isNotLastPage ? (
                <a onClick={() => onClickNextToRequestButton(+1)} href={null}>
                  <NextButton aria-hidden="true" />
                </a>
              ) : (
                <NextButton aria-hidden="true" />
              ))}
          </div>
        </div>
      )}
      {showSubrole && (
        <SubRoleInfo
          subroleEditable={subroleEditable}
          onClick={onClickSubRoleInfo}
        />
      )}
    </div>
  );
};

export default SubHeaderPager;
