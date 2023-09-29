import * as React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import { FunctionTypeList } from '../../constants/functionType';

import DelegateApplicantContainer from '../../containers/DelegateApplicant/DelegateApplicantContainer';
import DelegateApproverContainer from '../../containers/DelegateApprover/DelegateApproverContainer';
import DetailContainer from '../../containers/EmployeeContainer/DetailContainer';
import ListContainer from '../../containers/EmployeeContainer/ListContainer';

import './index.scss';

type Props = {
  title: string;
  useFunction: FunctionTypeList;
  isNewApproverAssignment: boolean;
  isNewApplicantAssignment: boolean;
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
