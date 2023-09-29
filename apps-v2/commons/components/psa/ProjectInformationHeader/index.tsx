import React, { useState } from 'react';

import ChevronDown from '@apps/commons/images/icons/fa-chevrondown.svg';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import './index.scss';

const ROOT = `ts-psa__project-information-header`;

type Props = {
  projectCode: string;
  projectName: string;
  durationStartDate: string;
  durationEndDate: string;
  contractAmount: string;
  projectManager: string;
  client: string;
  status: string;
  currencyDecimal: number;
  currencyCode: string;
};

const ProjectInformationHeader = (props: Props) => {
  const [isExpanded, setExpanded] = useState(true);
  const labelItemGenerator = (label, item) => (
    <span className={`${ROOT}__header-info-item`}>
      <label className={`${ROOT}__header-info-label`}>{label}:</label>
      {item}
    </span>
  );

  const expandClass = isExpanded ? 'js-is-expanded' : '';

  return (
    <div className={`${ROOT}__header-info ${expandClass}`}>
      <button
        className={`${ROOT}__header-info--buttons`}
        onClick={() => setExpanded(!isExpanded)}
      >
        <span className={`${ROOT}__header-info__toggle-icon-bg`}>
          <ChevronDown
            className={`${ROOT}__header-info__toggle-icon`}
          ></ChevronDown>
        </span>
        <span>
          {isExpanded
            ? msg().Psa_Lbl_CloseProjectInformation
            : msg().Psa_Lbl_OpenProjectInformation}
        </span>
      </button>
      <div className={`${ROOT}__header-info__column`}>
        <div>
          {labelItemGenerator(msg().Psa_Lbl_ProjectCode, props.projectCode)}
        </div>
        <div>
          {labelItemGenerator(msg().Psa_Lbl_ProjectTitle, props.projectName)}
        </div>
        <div>
          {labelItemGenerator(
            msg().Psa_Lbl_ProjectDuration,
            `${DateUtil.format(props.durationStartDate)} - ${DateUtil.format(
              props.durationEndDate
            )}`
          )}
        </div>
        <div>
          {labelItemGenerator(
            msg().Psa_Lbl_ContractAmount,
            `${props.currencyCode || ''} ${
              FormatUtil.formatNumber(
                props.contractAmount,
                props.currencyDecimal
              ) || 0
            }`
          )}
        </div>
      </div>
      <div className={`${ROOT}__header-info__column`}>
        <div>
          {labelItemGenerator(
            msg().Psa_Lbl_ProjectManager,
            props.projectManager
          )}
        </div>
        <div>
          {labelItemGenerator(msg().Psa_Lbl_ProjectClient, props.client || '-')}
        </div>
        <div>
          {labelItemGenerator(
            msg().Psa_Lbl_Status,
            msg()[`Psa_Lbl_Status${props.status}`]
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInformationHeader;
