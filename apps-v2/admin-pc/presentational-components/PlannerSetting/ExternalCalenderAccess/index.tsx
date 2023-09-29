import React from 'react';

import styled from 'styled-components';

import fieldSize from '@admin-pc/constants/fieldSize';

import Label from '@commons/components/fields/Label';
import msg from '@commons/languages';

import AuthStatusFieldMS365Container from '../../../containers/PlannerSettingContainer/AuthStatusFieldMS365Container';

import { AuthStatus } from '../ExternalCalenderAccess/AuthStatusField';

const EXTERNAL_CALENDER = {
  MICROSOFT365: 'microsoft365',
  SALESFORCE: 'salesforce',
} as const;

type ExternalCalenderType =
  typeof EXTERNAL_CALENDER[keyof typeof EXTERNAL_CALENDER];

type ItemProps = {
  type: ExternalCalenderType;
  isUse: boolean;
  authStatus: AuthStatus;
  onIsUseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
};

type Props = {
  tmpEditRecord: {
    externalCalenderAccessMap: {
      [key in ExternalCalenderType]: {
        isUse: boolean;
        authStatus?: AuthStatus;
      };
    };
  };
  onChangeDetailItem: (key: string, value: unknown) => void;
  disabled: boolean;
};

const S = {
  ServiceContainer: styled.div`
    margin: 24px 0;
    &:first-child {
      margin-top: 0;
    }
  `,
  Label: styled(Label).attrs((_) => ({
    childCols: fieldSize.SIZE_LARGE,
  }))`
    margin: 12px 0;
    &:first-child {
      margin-top: 0;
    }
    .ts-horizontal-layout__body {
      color: #333;

      input[type='checkbox'] {
        margin-right: 6px;
        vertical-align: -2px;
      }

      input[type='checkbox']:not(:disabled),
      input[type='checkbox']:not(:disabled) + span {
        cursor: pointer;
      }
    }
  `,
};

const IsUseCheckboxRow: React.FC<{
  label: string;
  isUse: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}> = ({ label, isUse, onChange, disabled }) => (
  <S.Label text={label}>
    <label>
      <input
        type="checkbox"
        checked={isUse}
        onChange={onChange}
        disabled={disabled}
      />
      <span>{msg().Admin_Lbl_CalendarAccessEnable}</span>
    </label>
  </S.Label>
);

const ExternalCalenderAccessService: React.FC<ItemProps> = ({
  type,
  isUse,
  authStatus,
  onIsUseChange,
  disabled,
}) => {
  const label = {
    [EXTERNAL_CALENDER.MICROSOFT365]:
      msg().Admin_Lbl_CalendarAccessServiceMicrosoft365,
    [EXTERNAL_CALENDER.SALESFORCE]:
      msg().Admin_Lbl_CalendarAccessServiceSalesforce,
  }[type];

  return (
    <S.ServiceContainer>
      <IsUseCheckboxRow
        label={label}
        isUse={isUse}
        onChange={onIsUseChange}
        disabled={disabled}
      />

      {isUse && type === EXTERNAL_CALENDER.MICROSOFT365 && (
        <S.Label text={msg().Admin_Lbl_CalendarAccessAuthorization}>
          <AuthStatusFieldMS365Container
            authStatus={authStatus}
            isEditing={!disabled}
          />
        </S.Label>
      )}
    </S.ServiceContainer>
  );
};

const ExternalCalenderAccess: React.FC<Props> = ({
  tmpEditRecord,
  onChangeDetailItem,
  disabled,
}) => {
  const externalCalenderAccessMap =
    tmpEditRecord?.externalCalenderAccessMap || {};

  const bindToOnIsUseChange =
    (service: ExternalCalenderType) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isUse = e.target.checked;
      const targetServiceStats = externalCalenderAccessMap[service];
      onChangeDetailItem('externalCalenderAccessMap', {
        ...externalCalenderAccessMap,
        [service]: {
          ...targetServiceStats,
          isUse,
        },
      });
    };

  return (
    <>
      {[EXTERNAL_CALENDER.MICROSOFT365, EXTERNAL_CALENDER.SALESFORCE].map(
        (service) => (
          <ExternalCalenderAccessService
            key={service}
            type={service}
            {...externalCalenderAccessMap[service]}
            onIsUseChange={bindToOnIsUseChange(service)}
            disabled={disabled}
          />
        )
      )}
    </>
  );
};

export default ExternalCalenderAccess;
