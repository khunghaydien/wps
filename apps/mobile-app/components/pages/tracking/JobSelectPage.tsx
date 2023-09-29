import * as React from 'react';

import msg from '../../../../commons/languages';
import Navigation from '../../molecules/commons/Navigation';

import { Job } from '../../../../domain/models/time-tracking/Job';

import QuickSearchableListContainer from '../../../containers/organisms/tracking/QuickSearchableListContainer';

import TextButton from '../../atoms/TextButton';
import ItemList from '../../organisms/tracking/ItemList';

import './JobSelectPage.scss';

const ROOT = 'mobile-app-pages-tracking-job-select-page';

type Props = Readonly<{
  isRoot: boolean;
  onClickBack: () => void;
  onClickCancel: () => void;
  onClickChildJob: (job: Job) => void;
  onClickJob: (job: Job) => void;
}>;

const JobSelectPage = ({
  isRoot,
  onClickBack,
  onClickCancel,
  onClickChildJob,
  onClickJob,
}: Props) => {
  return (
    <div className={ROOT}>
      <div className={`${ROOT}__heading`}>
        <Navigation
          className={`${ROOT}__navigation`}
          title={msg().Time_Lbl_JobSelect}
          onClickBack={!isRoot ? onClickBack : undefined}
          actions={[
            <TextButton onClick={onClickCancel}>
              {msg().Com_Btn_Cancel}
            </TextButton>,
          ]}
        />
      </div>
      <div className={`${ROOT}__body`}>
        <QuickSearchableListContainer>
          {({ items, className }) => (
            <ItemList
              className={className}
              items={items}
              onClickJob={onClickJob}
              onClickChildJob={onClickChildJob}
            />
          )}
        </QuickSearchableListContainer>
      </div>
    </div>
  );
};

export default JobSelectPage;
