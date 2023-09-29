import React from 'react';

import SLDSCloseIcon from '@salesforce-ux/design-system/assets/icons/utility/close.svg';

import msg from '../languages';
import PopoverFrame from './PopoverFrame';

import './PersonalMenuPopover.scss';

const ROOT = 'commons-personal-menu-popover';

type MenuItemsProps = {
  children: React.ReactNode;
};

const MenuItems = (props: MenuItemsProps) => (
  <div className={`slds-border--top ${ROOT}__menu-items`}>
    <ul>{props.children}</ul>
  </div>
);

type MenuItemProps = {
  onClick: (arg0: React.SyntheticEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

const MenuItem = (props: MenuItemProps) => (
  <li>
    {/* @ts-ignore  */}
    <a className={`${ROOT}__menu__item`} onClick={props.onClick}>
      {props.children}
    </a>
  </li>
);

export type Props = {
  employeeName: string;
  departmentName: string;
  managerName: string;
  showProxyEmployeeSelectButton: boolean;
  showChangeApproverButton: boolean;
  showLeaveDetailButton: boolean;
  isApprovalScreen: boolean;
  delegateAssignmentsCount: string;
  pendingRequestCount: number;
  onClickSwitchApproverButton: (
    arg0: React.SyntheticEvent<HTMLElement>
  ) => void;
  onClickOpenDADialog: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  onClickCloseButton: (arg0: React.SyntheticEvent<HTMLElement>) => void;
  onClickOpenLeaveWindowButton: (
    arg0: React.SyntheticEvent<HTMLButtonElement>
  ) => void;
  onClickOpenProxyEmployeeSelectButton: (
    arg0: React.SyntheticEvent<HTMLButtonElement>
  ) => void;
  onClickOpenChangeApproverButton: (
    arg0: React.SyntheticEvent<HTMLButtonElement>
  ) => void;
};

export default class PersonalMenuPopover extends React.Component<Props> {
  static defaultProps = {
    showLeaveDetailButton: true,
  };

  renderCloseButton() {
    return (
      <button
        title={msg().Com_Btn_Close}
        className="slds-popover__close slds-button slds-button--icon slds-button--icon-small slds-float--right"
        onClick={this.props.onClickCloseButton}
      >
        <SLDSCloseIcon aria-hidden className="slds-button__icon" />
        <span className="slds-assistive-text">{msg().Com_Btn_Close}</span>
      </button>
    );
  }

  renderEmployeeInfo() {
    return (
      <div
        className={`slds-p-vertical--small slds-p-horizontal--small ${ROOT}__emp-info`}
      >
        <p
          className={`slds-m-bottom--xx-small slds-text-color--weak ${ROOT}__dept-name`}
        >
          {this.props.departmentName}
        </p>
        <h3 className={`slds-text-heading--small ${ROOT}__emp-name`}>
          {this.props.employeeName}
        </h3>
        {!this.props.isApprovalScreen && (
          <p className={`${ROOT}__mng-name`}>
            {msg().Admin_Lbl_ManagerName} :{' '}
            {this.props.managerName || msg().Com_Lbl_Unspecified}
          </p>
        )}
      </div>
    );
  }

  renderPopover() {
    const {
      onClickOpenProxyEmployeeSelectButton,
      onClickOpenChangeApproverButton,
      pendingRequestCount,
    } = this.props;

    return (
      <section
        role="dialog"
        className={`slds-dynamic-menu slds-popover slds-nubbin--top-right ${ROOT}__popover`}
      >
        <div className="slds-popover__body slds-p-vertical--none slds-p-horizontal--none">
          {this.renderCloseButton()}
          {this.renderEmployeeInfo()}
          {!this.props.isApprovalScreen && this.props.showLeaveDetailButton && (
            <MenuItems>
              <MenuItem onClick={this.props.onClickOpenLeaveWindowButton}>
                {msg().Att_Lbl_LeaveDetails}
              </MenuItem>
            </MenuItems>
          )}
          {this.props.isApprovalScreen && (
            <MenuItems>
              <MenuItem onClick={this.props.onClickSwitchApproverButton}>
                {msg().Com_Btn_SwitchEmployee}
                <div className={`${ROOT}__count`}>
                  {pendingRequestCount > 0 && pendingRequestCount}
                </div>
              </MenuItem>
            </MenuItems>
          )}
          {this.props.isApprovalScreen && (
            <MenuItems>
              <MenuItem onClick={this.props.onClickOpenDADialog}>
                {msg().Com_Lbl_DelegateApprover}
                {` (${this.props.delegateAssignmentsCount})`}
              </MenuItem>
            </MenuItems>
          )}
          {this.props.showChangeApproverButton &&
          onClickOpenChangeApproverButton !== null &&
          onClickOpenChangeApproverButton !== undefined ? (
            <MenuItems>
              <MenuItem onClick={onClickOpenChangeApproverButton}>
                {msg().Com_Btn_ChangeApprover}
              </MenuItem>
            </MenuItems>
          ) : null}
          {this.props.showProxyEmployeeSelectButton &&
          onClickOpenProxyEmployeeSelectButton !== null &&
          onClickOpenProxyEmployeeSelectButton !== undefined ? (
            <MenuItems>
              <MenuItem onClick={onClickOpenProxyEmployeeSelectButton}>
                {msg().Com_Btn_SwitchEmployee}
              </MenuItem>
            </MenuItems>
          ) : null}
        </div>
      </section>
    );
  }

  render() {
    return (
      <PopoverFrame onClickOverlay={this.props.onClickCloseButton}>
        <div className={`${ROOT}__popover-container`}>
          {this.renderPopover()}
        </div>
      </PopoverFrame>
    );
  }
}
