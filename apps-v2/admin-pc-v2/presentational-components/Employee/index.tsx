import * as React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import { FunctionTypeList } from '@admin-pc/constants/functionType';

import DetailContainer from '@admin-pc-v2/containers/EmployeeContainer/DetailContainer';
import ListContainer from '@admin-pc-v2/containers/EmployeeContainer/ListContainer';
import DelegateApplicantContainer from '@admin-pc/containers/DelegateApplicant/DelegateApplicantContainer';
import DelegateApproverContainer from '@admin-pc/containers/DelegateApprover/DelegateApproverContainer';

type Props = {
  title: string;
  useFunction: FunctionTypeList;
  isShowDetail: boolean;
};

const ROOT = 'admin-pc-employee';

export default class Employee extends React.Component<Props> {
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
        {/* @ts-ignore */}
        {this.props.isNewApproverAssignment && <DelegateApproverContainer />}
        {/* @ts-ignore */}
        {this.props.isNewApplicantAssignment && <DelegateApplicantContainer />}
      </div>
    );
  }
}
