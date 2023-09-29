import React, { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import Button from '@apps/commons/components/buttons/Button';
import IconButton from '@apps/commons/components/buttons/IconButton';
import iconTitleToggle from '@apps/commons/components/exp/images/iconTitleToggle.png';
import msg from '@apps/commons/languages/index';

import { CurrentRoute } from '@apps/domain/models/psa/CurrentRoute';
import { RoleStatus } from '@apps/domain/models/psa/RoleStatus';

import './index.scss';

const ROOT = 'ts-psa__role-details__btn-area';

type isBtnDisabledObject = {
  edit: boolean;
  editByRM: boolean;
  recall: boolean;
  cancel: boolean;
  delete: boolean;
  submit: boolean;
  reschedule: boolean;
  assignResource: boolean;
  softBooking: boolean;
  hardBooking: boolean;
  rescheduleEndDate: boolean;
  resourceNotFound: boolean;
  selectResource: boolean;
  history: boolean;
};

type Props = {
  currentRoute?: string;
  displayClass?: string;
  isBtnDisabled: isBtnDisabledObject;
  onClickCancel: any;
  onClickClone: any;
  onClickDelete: any;
  onClickEdit: any;
  onClickHardBook?: () => void;
  onClickNotFound?: any;
  onClickRecall: any;
  onClickReschedule?: any;
  onClickSelectResource: () => void;
  onClickSoftBook?: (roleId: string) => void;
  onClickSubmit: any;
  roleStatus: string;
  scrollToCommentHistory?: () => void;
  scrollToMemo?: () => void;
  selectedResourceCount?: number;
};

const RoleDetailsBtnArea = (props: Props) => {
  const { isBtnDisabled } = props;
  const subMenuRef = useRef(null);
  const [isMenuOpen, setMenu] = useState(false);

  const isProjectRoute = props.currentRoute === CurrentRoute.Projects;
  const isResourceRoute = props.currentRoute === CurrentRoute.Resource;

  const toggleMenu = () => {
    setMenu(!isMenuOpen);
  };

  const handleClickOutside: any = (e) => {
    if (subMenuRef.current && !subMenuRef.current.contains(e.target)) {
      setMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const menuClass = classNames(`${ROOT}__toggle`, {
    active: isMenuOpen,
  });

  const renderCount = () => {
    return props.selectedResourceCount > 0
      ? `(${props.selectedResourceCount}/5 Candidates)`
      : '';
  };

  return (
    <div className={`${ROOT} ${props.displayClass}`} ref={subMenuRef}>
      <div className={`${ROOT}__main`}>
        <Button
          className={`${ROOT}__memo`}
          data-testid={`${ROOT}__btn--memo`}
          onClick={props.scrollToMemo}
        >
          {msg().Psa_Lbl_RoleMemo}
        </Button>
        <Button
          className={`${ROOT}__history`}
          data-testid={`${ROOT}__btn--history`}
          onClick={props.scrollToCommentHistory}
          disabled={isBtnDisabled.history}
        >
          {msg().Admin_Lbl_History}
        </Button>
      </div>
      <div className={`${ROOT}__main`}>
        {isProjectRoute && (
          <div>
            <Button
              className={`${ROOT}__edit`}
              data-testid={`${ROOT}__btn--edit`}
              onClick={props.onClickEdit}
              disabled={isBtnDisabled.edit}
            >
              {props.roleStatus === RoleStatus.InProgress
                ? msg().Psa_Btn_MarkAsCompleted
                : msg().Com_Btn_Edit}
            </Button>
            <Button
              className={`${ROOT}__submit`}
              data-testid={`${ROOT}__btn--submit`}
              onClick={props.onClickSubmit}
              disabled={isBtnDisabled.submit}
            >
              {msg().Psa_Btn_Submit}
            </Button>
          </div>
        )}

        {isResourceRoute && (
          <div>
            <Button
              className={`${ROOT}__select-resource-candidates`}
              onClick={() => props.onClickSelectResource()}
              disabled={
                isBtnDisabled.selectResource || props.selectedResourceCount >= 5
              }
            >
              {msg().Psa_Lbl_SelectResource} {renderCount()}
            </Button>
            <Button
              type={'primary'}
              className={`${ROOT}__request-confirmation`}
              onClick={props.onClickSoftBook}
              disabled={isBtnDisabled.softBooking}
            >
              {msg().Psa_Btn_SoftBooking}
            </Button>
            <Button
              className={`${ROOT}__edit`}
              data-testid={`${ROOT}__btn--edit`}
              onClick={props.onClickEdit}
              disabled={isBtnDisabled.editByRM}
            >
              {msg().Com_Btn_Edit}
            </Button>
          </div>
        )}

        <IconButton
          src={iconTitleToggle}
          className={menuClass}
          onClick={toggleMenu}
        />
      </div>

      {isMenuOpen && isProjectRoute && (
        <div className={`${ROOT}__submenu`}>
          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__select-resource`
            )}
            data-testid={`${ROOT}__btn--select-resource`}
            onClick={props.onClickSelectResource}
            disabled={
              props.isBtnDisabled.assignResource ||
              props.selectedResourceCount !== 0
            }
          >
            {msg().Psa_Lbl_AssignResource}
          </button>

          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__clone`
            )}
            data-testid={`${ROOT}__btn--clone`}
            onClick={props.onClickClone}
          >
            {msg().Com_Lbl_Clone}
          </button>

          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__recall`
            )}
            data-testid={`${ROOT}__btn--recall`}
            disabled={isBtnDisabled.recall}
            onClick={props.onClickRecall}
          >
            {msg().Psa_Lbl_Recall}
          </button>

          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__cancel`
            )}
            data-testid={`${ROOT}__btn--cancel`}
            disabled={isBtnDisabled.cancel}
            onClick={props.onClickCancel}
          >
            {msg().Psa_Btn_RoleRequestCancel}
          </button>

          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__delete`
            )}
            data-testid={`${ROOT}__btn--delete`}
            onClick={props.onClickDelete}
            disabled={isBtnDisabled.delete}
          >
            {msg().Com_Btn_Delete}
          </button>

          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__reschedule`
            )}
            data-testid={`${ROOT}__btn--reschedule`}
            onClick={props.onClickReschedule}
            disabled={isBtnDisabled.reschedule}
          >
            {msg().Psa_Btn_Reschedule}
          </button>
        </div>
      )}

      {isMenuOpen && isResourceRoute && (
        <div className={`${ROOT}__submenu`}>
          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__notFound`
            )}
            onClick={props.onClickNotFound}
            disabled={isBtnDisabled.resourceNotFound}
          >
            {msg().Psa_Btn_CannotFindResource}
          </button>
          <button
            className={classNames(
              `${ROOT}__submenu-item-button`,
              `${ROOT}__hardBook`
            )}
            onClick={props.onClickHardBook}
            disabled={isBtnDisabled.hardBooking || isBtnDisabled.softBooking}
          >
            {msg().Psa_Btn_HardBooking}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleDetailsBtnArea;
