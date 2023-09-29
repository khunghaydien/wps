import * as React from 'react';

import msg from '@apps/commons/languages';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

export type Props = {
  employeeName: string;
  delegatedEmployeeName: string | null | undefined;
};

const ApplicantName: React.FC<Props> = ({
  employeeName,
  delegatedEmployeeName,
}) => (
  <ViewItem label={msg().Appr_Lbl_ApplicantName}>
    {employeeName}
    {delegatedEmployeeName
      ? ` (${msg().Appr_Lbl_DelegatedApplicantName}: ${
          delegatedEmployeeName || ''
        })`
      : null}
  </ViewItem>
);

export default ApplicantName;
