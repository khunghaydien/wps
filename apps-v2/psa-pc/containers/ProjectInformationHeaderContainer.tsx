import React from 'react';
import { useSelector } from 'react-redux';

import ProjectInformationHeader from '@apps/commons/components/psa/ProjectInformationHeader';

import { State } from '@psa/modules';

const ProjectInformationHeaderContainer = () => {
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const currencyDecimal = useSelector(
    (state: State) => state.userSetting.currencyDecimalPlaces
  );
  const useExistingJobCode = useSelector(
    (state: State) => state.entities.psa.setting.useExistingJobCode
  );

  const currencyCode = useSelector(
    (state: State) => state.userSetting.currencyCode
  );
  return (
    <ProjectInformationHeader
      projectCode={
        useExistingJobCode ? selectedProject.jobCode : selectedProject.code
      }
      projectName={selectedProject.name}
      durationStartDate={selectedProject.startDate}
      durationEndDate={selectedProject.endDate}
      contractAmount={selectedProject.contractAmount}
      projectManager={selectedProject.pmName}
      client={selectedProject.clientName}
      status={selectedProject.status}
      currencyDecimal={currencyDecimal}
      currencyCode={currencyCode}
    />
  );
};

export default ProjectInformationHeaderContainer;
