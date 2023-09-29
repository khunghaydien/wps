import React from 'react';

import { ProjectList, ProjectListItem } from '@apps/domain/models/psa/Project';

import ListItem from '@psa/components/ProjectListScreen/ListItem';

const ROOT = 'ts-psa__list-body';

type Props = {
  onClickProjectListItem: (projectId?: string) => void;
  projectList: ProjectList;
};

const ListBody = (props: Props) => {
  if (!props.projectList) {
    return null;
  }

  return (
    <div className={`${ROOT}`}>
      {props.projectList.map((i: ProjectListItem, index: number) => (
        <ListItem
          testId={index}
          projectId={i.projectId}
          clientName={i.clientName}
          endDate={i.endDate}
          pmName={i.pmName}
          name={i.name}
          startDate={i.startDate}
          status={i.status}
          onClickProjectListItem={props.onClickProjectListItem}
          companyId={i.companyId}
          currentDetailId={i.currentDetailId}
          deptName={i.deptName}
          projectJobCode={i.projectJobCode}
        />
      ))}
    </div>
  );
};

export default ListBody;
