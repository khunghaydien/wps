import React from 'react';

import DateUtil from '@commons/utils/DateUtil';
import ObjectUtil from '@commons/utils/ObjectUtil';

import { LegalAgreementRequestSummary } from '@attendance/domain/models/approval/LegalAgreementRequest';

import requestType from '@attendance/ui/helpers/legalAgreementRequest/requestType';

const ROOT = 'attendance-att-legal-agreement-type-and-duration';

type Props = {
  value: LegalAgreementRequestSummary;
};

export default class TypeAndDuration extends React.Component<Props> {
  render() {
    const targetMonth = ObjectUtil.getOrEmpty(this.props.value, 'targetMonth');
    const type = ObjectUtil.getOrEmpty(this.props.value, 'requestType');

    return (
      <div className={`${ROOT}`}>
        <div>
          <span>{DateUtil.formatYM(targetMonth)}</span>
        </div>
        <div>{requestType(type)}</div>
      </div>
    );
  }
}
