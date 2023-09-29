import React from 'react';

import { PageData, RequestListItem } from '@apps/domain/models/psa/Request';

import ListItem from '@resource/components/RoleRequestList/ListItem';

const ROOT = 'ts-resource__list-body';

type Props = {
  onClickRequestListItem: (requestId?: string) => void;
  requestList: PageData;
};

const ListBody = (props: Props) => {
  if (!props.requestList) {
    return null;
  }

  return (
    <div className={`${ROOT}`}>
      {props.requestList.map((i: RequestListItem) => (
        <ListItem
          assignmentDueDate={i.assignmentDueDate}
          clientName={i.clientName}
          onClickRequestListItem={props.onClickRequestListItem}
          projectCode={i.projectJobCode}
          projectManager={i.projectManager}
          projectTitle={i.projectTitle}
          receivedDate={i.receivedDate}
          resourceGroup={i.resourceGroup}
          requestCode={i.requestCode}
          roleId={i.roleId}
          roleTitle={i.roleTitle}
          status={i.status}
        />
      ))}
    </div>
  );
};

export default ListBody;
