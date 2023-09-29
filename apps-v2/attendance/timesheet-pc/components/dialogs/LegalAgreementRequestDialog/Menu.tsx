import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';

import { LegalAgreementRequest } from '@attendance/domain/models/LegalAgreementRequest';
import {
  Code as RequestTypeCode,
  DisplayOrder,
} from '@attendance/domain/models/LegalAgreementRequestType';

import MenuItem from './MenuItem';

const S = {
  Wrapper: styled.div`
    border-right: 1px solid #eee;
    height: 100%;
    overflow-x: auto;
  `,
  Title: styled.div`
    padding: 8px 0 8px 20px;
    font-size: 13px;
    font-weight: bold;
  `,
};

export const menuTypeMap = {
  Monthly: {
    code: 'Monthly',
    name: msg().Admin_Lbl_UseLegalAgreementMonthlyRequest,
  },
  Yearly: {
    code: 'Yearly',
    name: msg().Admin_Lbl_UseLegalAgreementYearlyRequest,
  },
};

type Props = {
  loading: boolean;
  selectedRequestId: string | null;
  selectedRequestTypeCode: RequestTypeCode | null;
  requestConditions: {
    isLocked: boolean;
    availableRequestTypes: Record<string, RequestTypeCode>;
    latestRequests: Array<LegalAgreementRequest>;
  };
  onClickRequestDetailButton: (target: LegalAgreementRequest) => void;
  onClickRequestEntryButton: (arg0: string) => void;
};

const Menu: React.FC<Props> = ({
  loading,
  selectedRequestId,
  selectedRequestTypeCode,
  requestConditions,
  onClickRequestDetailButton,
  onClickRequestEntryButton,
}) => {
  const { latestRequests, availableRequestTypes } = requestConditions || {};

  return (
    <S.Wrapper>
      {latestRequests?.length > 0 && (
        <div>
          <S.Title>{msg().Att_Lbl_ApprovelIn}</S.Title>
          <ul>
            {latestRequests.map((request, i) => (
              <MenuItem
                key={`menu-item-for-${request.id || i}`}
                status={request.status}
                isForReapply={request.isForReapply}
                selected={request.id === selectedRequestId}
                disabled={loading}
                onClick={() => {
                  onClickRequestDetailButton(request);
                }}
              >
                {menuTypeMap[request.requestType].name || null}
              </MenuItem>
            ))}
          </ul>
        </div>
      )}
      {Object.keys(availableRequestTypes || {}).length > 0 && (
        <div>
          <S.Title>{msg().Att_Lbl_NewRequest}</S.Title>
          <ul>
            {DisplayOrder.filter(
              (orderedTypeCode) => availableRequestTypes[orderedTypeCode]
            ).map((orderedTypeCode) => {
              const requestType = menuTypeMap[orderedTypeCode];

              const selected =
                !selectedRequestId &&
                selectedRequestTypeCode === requestType.code;

              return (
                <MenuItem
                  key={`menu-item-for-${requestType.code}`}
                  disabled={loading}
                  selected={selected}
                  onClick={() => onClickRequestEntryButton(requestType.code)}
                  status={null}
                >
                  {requestType.name}
                </MenuItem>
              );
            })}
          </ul>
        </div>
      )}
    </S.Wrapper>
  );
};

export default Menu;
