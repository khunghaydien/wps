import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import { FunctionTypeList } from '../../constants/functionType';

import DetailContainer from '../../containers/ExpenseTypeContainer/DetailContainer';
import ListContainer from '../../containers/ExpenseTypeContainer/ListContainer';

import './index.scss';

const ROOT = 'admin-pc-expense-type';

type Props = {
  title: string;
  isShowDetail: boolean;
  useFunction: FunctionTypeList;
};

const ExpenseType = ({ title, isShowDetail, useFunction }: Props) => {
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

export default ExpenseType;
