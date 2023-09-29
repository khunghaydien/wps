import * as React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import { FunctionTypeList } from '@admin-pc/constants/functionType';

import DetailContainer from '@admin-pc-v2/containers/DepartmentContainer/DetailContainer';
import ListContainer from '@admin-pc-v2/containers/DepartmentContainer/ListContainer';

import './index.scss';

type Props = {
  title: string;
  useFunction: FunctionTypeList;
  isShowDetail: boolean;
};

const ROOT = 'admin-pc-department';

export default class Department extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <ListContainer title={this.props.title} />
        <ReactCSSTransitionGroup
          classNames="ts-modal-transition-slideleft"
          timeout={{ enter: 200, exit: 200 }}
        >
          <div>
            {this.props.isShowDetail && (
              <DetailContainer useFunction={this.props.useFunction} />
            )}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
