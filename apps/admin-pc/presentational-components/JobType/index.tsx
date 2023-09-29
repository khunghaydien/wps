import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import { FunctionTypeList } from '../../constants/functionType';

import DetailContainer from '../../containers/JobTypeContainer/DetailContainer';
import ListContainer from '../../containers/JobTypeContainer/ListContainer';

import './index.scss';

type Props = {
  title: string;
  isShowDetail: boolean;
  useFunction: FunctionTypeList;
};

const ROOT = 'admin-pc-job-type';

const JobType = ({ title, isShowDetail, useFunction }: Props) => {
  return (
    <div className={ROOT}>
      <ListContainer title={title} />
      <ReactCSSTransitionGroup
        classNames="ts-modal-transition-slideleft"
        timeout={{ enter: 200, exit: 200 }}
      >
        <div>
          {isShowDetail && <DetailContainer useFunction={useFunction} />}
        </div>
      </ReactCSSTransitionGroup>
    </div>
  );
};

export default JobType;
