import React, { useEffect } from 'react';

import last from 'lodash/last';

import {
  MAX_PAGE_NUM,
  MAX_RECORD_NUM,
  PAGE_SIZE_OPTIONS,
} from '@apps/commons/constants/psa/page';

import Pagination from '@apps/commons/components/Pagination';
import EmptyScreenContainer from '@apps/commons/containers/psa/EmptyScreenContainer';
import msg from '@apps/commons/languages';

import { ProjectList } from '@apps/domain/models/psa/Project';

import NewProjectFormContainer from '@psa/containers/NewProjectFormContainer';

import ListBody from './ListBody';
import ListHeader from './ListHeader';

import './index.scss';

const ROOT = 'ts-psa__first-screen';

type Props = {
  activeDialog: Array<string>;
  onClickPagerLink: (arg0: number, arg1: number) => void;
  onClickProjectListItem: (projectId?: string) => void;
  pageNum: number;
  pageSize: number;
  projectList: ProjectList;
  totalRecords: number;
};

const ProjectListScreen = (props: Props) => {
  const currentActiveDialog = last(props.activeDialog);
  const isNewProjectDialogActive = currentActiveDialog === 'NEW_PROJECT';
  let projectList;

  useEffect(() => {
    // scroll to the top
    const containerEl = document.querySelector('.ts-container');
    if (containerEl) {
      containerEl.scrollTop = 0;
    }
  }, [props.pageNum]);

  if (props.projectList && props.projectList.length > 0) {
    projectList = (
      <div className={`${ROOT}__list-container`}>
        <ListHeader />
        <ListBody
          onClickProjectListItem={props.onClickProjectListItem}
          projectList={props.projectList}
        />
        {props.pageNum === MAX_PAGE_NUM &&
          props.totalRecords > MAX_RECORD_NUM && (
            <div className={`${ROOT}-too-many-results`}>
              {msg().Com_Lbl_TooManySearchResults}
            </div>
          )}

        <Pagination
          allowLargerPageSize
          className={`${ROOT}__list-pager`}
          currentPage={props.pageNum}
          displayNum={5}
          havePagerInfo
          maxPageNum={MAX_PAGE_NUM}
          onChangePageSize={(pageSize) => props.onClickPagerLink(0, pageSize)}
          onClickPagerLink={(num) =>
            props.onClickPagerLink(num, props.pageSize)
          }
          pageSize={PAGE_SIZE_OPTIONS}
          totalNum={props.totalRecords}
        />
      </div>
    );
  } else {
    projectList = (
      <EmptyScreenContainer
        headerMessage={msg().Psa_Lbl_EmptyProjectHeader}
        bodyMessage={msg().Psa_Lbl_EmptyProjectBody}
      />
    );
  }

  return (
    <div className={`${ROOT}`}>
      {projectList}
      {isNewProjectDialogActive && <NewProjectFormContainer />}
    </div>
  );
};

export default ProjectListScreen;
