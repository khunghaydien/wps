import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import '../../../commons/styles/modal-transition-slideleft.css';

import { clear as clearEmployeeList } from '../../modules/annual-paid-leave-management/list-pane/entities/employee-list';
import { clear as clearSearchForm } from '../../modules/annual-paid-leave-management/list-pane/ui/search-form';
import { hide as hideDialog } from '../../modules/annual-paid-leave-management/update-dialog/ui';

import { AppDispatch } from '../../action-dispatchers/AppThunk';

import DetailPaneContainer from '../../containers/AnnualPaidLeaveManagementContainer/DetailPaneContainer';
import ListPaneContainer from '../../containers/AnnualPaidLeaveManagementContainer/ListPaneContainer';
import UpdateDialogContainer from '../../containers/AnnualPaidLeaveManagementContainer/UpdateDialogContainer';

import './index.scss';

const ROOT = 'admin-pc-annual-paid-leave-management';

export type Props = {
  dispatch: AppDispatch;
  isDetailVisible: boolean;
};

export default class AnnualPaidLeaveManagement extends React.Component<Props> {
  componentWillUnmount() {
    this.props.dispatch(clearSearchForm());
    this.props.dispatch(clearEmployeeList());
    this.props.dispatch(hideDialog());
  }

  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__list-pane`}>
          <ListPaneContainer />
        </div>

        <ReactCSSTransitionGroup
          classNames="ts-modal-transition-slideleft"
          timeout={{ enter: 200, exit: 200 }}
        >
          <div>
            {this.props.isDetailVisible ? (
              <div className={`${ROOT}__detail-pane`}>
                {/* @ts-ignore */}
                <DetailPaneContainer />
              </div>
            ) : null}
          </div>
        </ReactCSSTransitionGroup>

        {/* @ts-ignore */}
        <UpdateDialogContainer />
      </div>
    );
  }
}
