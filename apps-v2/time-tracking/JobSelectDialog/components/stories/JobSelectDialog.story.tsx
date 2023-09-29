import React from 'react';

import { action } from '@storybook/addon-actions';

import DialogRoot from '@apps/core/blocks/Dialog/DialogRoot';

import { Job } from '@apps/domain/models/time-tracking/Job';

import JobSelectDialog from '../JobSelectDialog';
import jobsList, { createJobables, selectedJob } from './mocks/jobsList';

const isOpened = (job: Job) => {
  return (
    job === jobsList[0].value[0] ||
    job === jobsList[1].value[1] ||
    job === jobsList[2].value[2]
  );
};

export default {
  title: 'time-tracking/JobSelectDialog',
  decorators: [
    (story: Function) => (
      <DialogRoot
        dialogs={{
          '1': {
            dialog: () => story(),
            props: { isModal: true, onClose: action('onClose') },
          },
        }}
      />
    ),
  ],
};

export const Default = () => {
  const jobables = createJobables(100);
  return (
    <JobSelectDialog
      isModal
      onClose={action('onClose')}
      exploreInHierarchyProps={{
        initialize: () => {
          action('initialize')();
          return action('cleanUp');
        },
        jobsList: jobsList,
        onClickItem: action('onClickItem'),
        selectedJob: selectedJob,
        isOpenedJob: isOpened,
        onOk: action('onOk for ExploreInHierarchy'),
        onSearch: action('onSearch for ExploreInHierarchy'),
      }}
      conditionalSearchProps={{
        conditionalSearch: action('conditionalSearch'),
        codeOrNameQuery: '',
        setCodeOrNameQuery: action('setCodeOrNameQuery'),
        isLoading: false,
        resultRecords: jobables,
        hasResultMoreThanRecordCount: false,
        onSelectJob: action('onSelectJob'),
        selectedJob: jobables[1],
        onOk: action('onOk for ConditionalSearch'),
      }}
      useConditionalSearch
    />
  );
};

Default.storyName = 'Default';

export const ConditionalSearchIsNotUsed = () => {
  const jobables = createJobables(100);
  return (
    <JobSelectDialog
      isModal
      onClose={action('onClose')}
      exploreInHierarchyProps={{
        initialize: () => {
          action('initialize')();
          return action('cleanUp');
        },
        jobsList: jobsList,
        onClickItem: action('onClickItem'),
        selectedJob: selectedJob,
        isOpenedJob: isOpened,
        onOk: action('onOk for ExploreInHierarchy'),
        onSearch: action('onSearch for ExploreInHierarchy'),
      }}
      conditionalSearchProps={{
        conditionalSearch: action('conditionalSearch'),
        codeOrNameQuery: '',
        setCodeOrNameQuery: action('setCodeOrNameQuery'),
        isLoading: false,
        resultRecords: jobables,
        hasResultMoreThanRecordCount: false,
        onSelectJob: action('onSelectJob'),
        selectedJob: jobables[1],
        onOk: action('onOk for ConditionalSearch'),
      }}
      useConditionalSearch={false}
    />
  );
};

ConditionalSearchIsNotUsed.storyName = 'Conditional Search Is Not Used.';

export const IsLoading = () => {
  const jobables = createJobables(100);
  return (
    <JobSelectDialog
      isModal
      onClose={action('onClose')}
      exploreInHierarchyProps={{
        initialize: () => {
          action('initialize')();
          return action('cleanUp');
        },

        jobsList: jobsList,
        onClickItem: action('onClickItem'),
        selectedJob: selectedJob,
        isOpenedJob: isOpened,
        onOk: action('onOk for ExploreInHierarchy'),
        onSearch: action('onSearch for ExploreInHierarchy'),
      }}
      conditionalSearchProps={{
        conditionalSearch: action('conditionalSearch'),
        codeOrNameQuery: '',
        setCodeOrNameQuery: action('setCodeOrNameQuery'),
        isLoading: true,
        resultRecords: jobables,
        hasResultMoreThanRecordCount: false,
        onSelectJob: action('onSelectJob'),
        selectedJob: jobables[1],
        onOk: action('onOk for ConditionalSearch'),
      }}
      useConditionalSearch
      defaultSearchMode={'ConditionalSearch'}
    />
  );
};

IsLoading.storyName = 'Loading (at Conditional Search)';
