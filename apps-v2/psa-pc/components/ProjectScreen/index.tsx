import React from 'react';

import { PsaAccessType } from '@apps/domain/models/psa/PsaAccess';

import { SIDEBAR_TYPES } from '@psa/modules/ui/sidebar';

import ActivityContainer from '@psa/containers/ActivityContainer';
import FileUploadContainer from '@psa/containers/FileUploadContainer';
import ProjectDetailFormContainer from '@psa/containers/ProjectDetailFormContainer';
import ProjectFinanceContainer from '@psa/containers/ProjectFinanceContainer';

import Sidebar from './Sidebar';

import './index.scss';

const ROOT = 'ts-psa__second-screen';

type Props = {
  accessSetting: PsaAccessType;
  activeTab: string;
  enableProjectFinance: boolean;
  switchTo: (component: string) => void;
  permission: string;
};

const ProjectScreen = (props: Props) => {
  const renderActiveComponent = () => {
    switch (props.activeTab) {
      case SIDEBAR_TYPES.ACTIVITY:
        return <ActivityContainer />;
      case SIDEBAR_TYPES.UPLOAD:
        return <FileUploadContainer />;
      case SIDEBAR_TYPES.FINANCE:
        return <ProjectFinanceContainer />;
      default:
        return <ProjectDetailFormContainer permission={props.permission} />;
    }
  };

  return (
    <div className={`${ROOT}`}>
      <Sidebar
        accessSetting={props.accessSetting}
        activeTab={props.activeTab}
        switchTo={props.switchTo}
        enableProjectFinance={props.enableProjectFinance}
      />
      <div className={`${ROOT}__content`}>{renderActiveComponent()}</div>
    </div>
  );
};

export default ProjectScreen;
