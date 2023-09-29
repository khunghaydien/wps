import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { State } from '@psa/modules';

import {
  fetchProject,
  fetchProjectList,
} from '@psa/action-dispatchers/Project';

import ProjectListScreen from '@psa/components/ProjectListScreen';

type OwnProps = {
  activeDialog: Array<string>;
  overlapProject?: () => void;
};

const ProjectListScreenContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const pageNum = useSelector(
    (state: State) => state.entities.psa.project.pageNum
  );
  const pageSize = useSelector(
    (state: State) => state.entities.psa.project.pageSize
  );
  const projectList = useSelector(
    (state: State) => state.entities.psa.project.pageData
  );
  const projectListFilterState = useSelector(
    (state: State) => state.ui.filter.project
  );
  const totalRecords = useSelector(
    (state: State) => state.entities.psa.project.totalRecords
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );

  const onClickPagerLink = (num: number, pageSize: number) => {
    dispatch(
      fetchProjectList(
        companyId,
        num,
        selectedGroup.id,
        projectListFilterState,
        pageSize
      )
    );
  };
  const onClickProjectListItem = (projectId: string) => {
    dispatch(fetchProject(projectId));
  };

  return (
    <ProjectListScreen
      noAccessToPsaGroup={selectedGroup === undefined}
      activeDialog={ownProps.activeDialog}
      onClickPagerLink={onClickPagerLink}
      onClickProjectListItem={onClickProjectListItem}
      pageNum={pageNum}
      pageSize={pageSize}
      projectList={projectList}
      totalRecords={totalRecords}
    />
  );
};

export default ProjectListScreenContainer;
