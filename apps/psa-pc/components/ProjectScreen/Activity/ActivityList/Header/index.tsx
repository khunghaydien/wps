import React from 'react';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import msg from '@apps/commons/languages';

import IconCollapseAll from '@psa/images/icons/collapseAll.svg';
import IconExpandAll from '@psa/images/icons/expandAll.svg';

import './index.scss';

type Props = {
  isDisabled: boolean;
  expandAll: () => void;
  collapseAll: () => void;
};

const ROOT = 'ts-psa__activity-header';

const ActivityHeader = (props: Props) => {
  return (
    <MultiColumnsGrid className={ROOT} sizeList={[4, 2, 1, 1, 1, 3]}>
      <span className={`${ROOT}-name`}>
        <button
          className={`${ROOT}-expand-all`}
          data-testid={`${ROOT}--expand-all`}
          onClick={props.expandAll}
          disabled={props.isDisabled}
        >
          <IconExpandAll />
        </button>
        <span className={`${ROOT}-separator`}>|</span>
        <button
          className={`${ROOT}-expand-all`}
          data-testid={`${ROOT}--close-all`}
          onClick={props.collapseAll}
          disabled={props.isDisabled}
        >
          <IconCollapseAll />
        </button>

        <span className={`${ROOT}-info`} />
      </span>

      <span className={`${ROOT}-status`}>{msg().Psa_Lbl_Status}</span>

      <span className={`${ROOT}-request-no`}>{msg().Psa_Lbl_RequestCode}</span>

      <span className={`${ROOT}-start-date`}>{msg().Psa_Lbl_StartDate}</span>

      <span className={`${ROOT}-end-date`}>{msg().Psa_Lbl_EndDate}</span>

      <span className={`${ROOT}-lead`}>{msg().Psa_Lbl_ActivityAssignees}</span>
      {/* Not in scope for MVP
        <span className={`${ROOT}-work-hours`}>Work Hours</span>

      <span className={`${ROOT}-total-hours`}>Total Hours</span>
      */}
    </MultiColumnsGrid>
  );
};

export default ActivityHeader;
