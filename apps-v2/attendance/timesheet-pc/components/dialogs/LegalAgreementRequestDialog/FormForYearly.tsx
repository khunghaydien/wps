import React, { useMemo, useState } from 'react';

import styled from 'styled-components';

import TextField from '@apps/commons/components/fields/TextField';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';
import { TextField as TextAreaField } from '@apps/core';

import {
  WorkSystem,
  YearlyOvertime,
} from '@attendance/domain/models/LegalAgreementOvertime';
import { LegalAgreementRequest } from '@attendance/domain/models/LegalAgreementRequest';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import {
  Keys,
  Values,
} from '@attendance/timesheet-pc/modules/ui/legalAgreementRequest/requests/monthlyRequest';

import FormRow from './FormRow';
import OvertimeTable from './OvertimeTable';

const Wrapper = styled.div`
  width: 100%;
`;
const Input = styled(TextField)`
  width: 80px !important;
  margin-right: 10px;
`;
const TextSpan = styled.span`
  color: #999999;
`;

const Warning = styled.div`
  color: #f00;
`;

type Props = {
  isReadOnly: boolean;
  overtime: YearlyOvertime | null;
  workSystem: WorkSystem | null;
  targetRequest: LegalAgreementRequest | null;
  requireFlags: {
    requireReason: boolean;
    requireMeasures: boolean;
  };
  onUpdateValue: (key: Keys, value: Values) => void;
};

const FormForYearly: React.FC<Props> = ({
  isReadOnly,
  overtime,
  workSystem,
  targetRequest,
  requireFlags,
  onUpdateValue,
}) => {
  const [limitTime, setLimitTime] = useState(
    targetRequest?.changedOvertimeHoursLimit
  );

  const validLimit: boolean = useMemo(
    () =>
      overtime?.specialYearlyOvertimeLimit > 0 &&
      limitTime > overtime?.specialYearlyOvertimeLimit,
    [limitTime, overtime?.specialYearlyOvertimeLimit]
  );

  const $onUpdateValue = (value: number) => {
    setLimitTime(value);
    onUpdateValue('changedOvertimeHoursLimit', value);
  };

  return (
    <Wrapper>
      <OvertimeTable
        type={CODE.YEARLY}
        overtime={overtime}
        workSystem={workSystem}
      />
      <FormRow labelText={msg().Att_Lbl_LimitToBeChanged}>
        <Input
          type="number"
          min={1}
          disabled={isReadOnly}
          required={true}
          value={targetRequest?.changedOvertimeHoursLimit}
          onChange={(e) => {
            $onUpdateValue(e.target.value);
          }}
        />
        <TextSpan>
          {TextUtil.template(
            msg().Att_Lbl_MaximumTimeLimit,
            overtime?.specialYearlyOvertimeLimit || '--'
          )}
        </TextSpan>
        {validLimit && (
          <Warning>{msg().Att_Lbl_LimitOfOvertimeHoursWarning}</Warning>
        )}
      </FormRow>
      <FormRow labelText={msg().$Att_Lbl_RequestTypeReason}>
        <TextAreaField
          maxLength={255}
          minRows={3}
          readOnly={isReadOnly}
          required={requireFlags.requireReason}
          value={targetRequest?.reason}
          onChange={(e) => {
            onUpdateValue('reason', e.target.value);
          }}
        />
      </FormRow>
      <FormRow labelText={msg().$Att_Lbl_RequestTypeMeasures}>
        <TextAreaField
          maxLength={255}
          minRows={3}
          readOnly={isReadOnly}
          required={requireFlags.requireMeasures}
          value={targetRequest?.measure}
          onChange={(e) => {
            onUpdateValue('measure', e.target.value);
          }}
        />
      </FormRow>
    </Wrapper>
  );
};

export default FormForYearly;
