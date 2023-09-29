import * as React from 'react';

import { action } from '@storybook/addon-actions';

import ConditionalSearch from '../ConditionalSearch';
import { createJobables } from './mocks/jobsList';

export default {
  title: 'time-tracking/JobSelectDialog/ConditionalSearch',
  decorators: [
    (story: Function) => (
      <div
        style={{
          display: 'flex',
          width: '964px',
          height: '420px',
          backgroundColor: '#fff',
        }}
      >
        {story()}
      </div>
    ),
  ],
};

export const Standard = () => {
  const resultList = createJobables(20);
  return (
    <ConditionalSearch
      isShow={true}
      conditionalSearch={action('conditionalSearch')}
      codeOrNameQuery={''}
      setCodeOrNameQuery={action('setCodeOrNameQuery')}
      isLoading={false}
      resultRecords={resultList}
      hasResultMoreThanRecordCount={false}
      onSelectJob={action('onSelectJob')}
      selectedJob={resultList[1]}
    />
  );
};

Standard.storyName = 'Standard';

export const Initial = () => (
  <ConditionalSearch
    isShow={true}
    conditionalSearch={action('conditionalSearch')}
    codeOrNameQuery={''}
    setCodeOrNameQuery={action('setCodeOrNameQuery')}
    isLoading={false}
    resultRecords={null}
    hasResultMoreThanRecordCount={false}
    onSelectJob={action('onSelectJob')}
    selectedJob={null}
  />
);

Initial.storyName = 'initial';

export const NoResults = () => (
  <ConditionalSearch
    isShow={true}
    conditionalSearch={action('conditionalSearch')}
    codeOrNameQuery={''}
    setCodeOrNameQuery={action('setCodeOrNameQuery')}
    isLoading={false}
    resultRecords={[]}
    hasResultMoreThanRecordCount={false}
    onSelectJob={action('onSelectJob')}
    selectedJob={null}
  />
);

NoResults.storyName = 'No Results';

export const HasMoreThanRecordCount = () => (
  <ConditionalSearch
    isShow={true}
    conditionalSearch={action('conditionalSearch')}
    codeOrNameQuery={''}
    setCodeOrNameQuery={action('setCodeOrNameQuery')}
    isLoading={false}
    resultRecords={createJobables(100)}
    hasResultMoreThanRecordCount={true}
    onSelectJob={action('onSelectJob')}
    selectedJob={null}
  />
);

HasMoreThanRecordCount.storyName = 'Has More Than Record Count';

export const HasLongJobName = () => {
  const jobables = createJobables(3);
  return (
    <ConditionalSearch
      isShow={true}
      conditionalSearch={action('conditionalSearch')}
      codeOrNameQuery={''}
      setCodeOrNameQuery={action('setCodeOrNameQuery')}
      isLoading={false}
      resultRecords={[
        jobables[0],
        {
          ...jobables[1],
          name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
          ...jobables[2],
          name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            .split(/[ .,]/)
            .join(''),
        },
      ]}
      hasResultMoreThanRecordCount={false}
      onSelectJob={action('onSelectJob')}
      selectedJob={null}
    />
  );
};

HasLongJobName.storyName = 'Has Long Job Name';

export const WithHistoryRecord = () => {
  const jobables = createJobables(3);
  return (
    <ConditionalSearch
      isShow={true}
      conditionalSearch={action('conditionalSearch')}
      codeOrNameQuery={''}
      setCodeOrNameQuery={action('setCodeOrNameQuery')}
      isLoading={false}
      resultRecords={jobables.map((i) => ({
        ...i,
        validFrom: '2020-01-01',
        validTo: '2025-01-01',
      }))}
      hasResultMoreThanRecordCount={false}
      onSelectJob={action('onSelectJob')}
      selectedJob={null}
    />
  );
};

WithHistoryRecord.storyName = 'With History Record';
