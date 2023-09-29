import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePortal from 'react-useportal';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import CheckIcon from '@apps/commons/images/icons/CheckIcon.svg';
import msg from '@apps/commons/languages';
import { CloseButton } from '@apps/core';

import { State as resourceState } from '@resource/modules';

import getResourcegroups from '@psa/action-dispatchers/ResourceGroup';

import ListItem from '@apps/time-tracking/JobSelectDialog/components/ExploreInHierarchy/ListItem';

import IconAdd from '@psa/images/icons/add.svg';

import './index.scss';

const ROOT = 'ts-Resource-group-filter';

type Group = {
  id: string;
  name: string;
  isOwned: boolean;
};

type Member = {
  id: string;
  name: string;
  title: string;
  url: string;
};

type GroupMembers = {
  owners: Array<Member>;
  members: Array<Member>;
};

type Props = {
  getMembers: (arg0: string) => void;
  groupDetail: GroupMembers;
  groupList: Array<Group>;
  isResetted: boolean;
  name: string;
  onSelect: (groups: Set<Group> | any) => void;
  resourceGroups: Array<Group>;
  selectLimit: number;
  title: string;
  disabled?: boolean;
  onRemove?: () => void;
};

const ResourceGroupFilter = (props: Props) => {
  const [selection, setSelection] = useState(new Set());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(undefined);
  const [isSelectionDisabled, setSelectionDisabled] = useState(true);
  const [wrapperClass, setWrapperClass] = useState('disable');
  const [filter, setFilter] = useState('');
  const [groupList, setGroupList] = useState(props.groupList);

  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector(
    (state: resourceState) => state.userSetting.companyId
  );

  // ViewAllResources
  const allowCrossGroupSearch = useSelector(
    (state: resourceState) => state.entities.psa.setting.allowCrossGroupSearch
  );
  const employeeId = useSelector(
    (state: resourceState) => state.userSetting.employeeId
  );

  const selectedRole = useSelector(
    (state: resourceState) => state.entities.psa.role.role
  );

  const siteRoute = useSelector((state: resourceState) => state.ui.siteRoute);

  const tab = useSelector((state: resourceState) => state.ui.tab);

  useEffect(() => {
    if (isDialogOpen) {
      switch (siteRoute) {
        case 'REQUEST_LIST':
          dispatch(getResourcegroups(companyId));
          break;

        case 'VIEW_ALL_RESOURCES':
          tab === 'Projects' || (allowCrossGroupSearch && tab === 'Resource')
            ? dispatch(getResourcegroups(companyId))
            : dispatch(getResourcegroups(companyId, employeeId));
          break;

        case 'PROJECT_LIST':
        case 'VIEW_PROJECT':
        case 'ROLE_DETAILS':
          dispatch(getResourcegroups(companyId));
          break;

        case 'RESOURCE_PLANNER':
          dispatch(getResourcegroups(companyId, selectedRole.rmId));
          break;
      }
    }
  }, [isDialogOpen]);

  const { Portal } = usePortal({
    isOpen: true,
  });

  useEffect(
    () => setSelectionDisabled(selectedGroup === undefined),
    [selectedGroup]
  );

  const initSelectedGroup = () => {
    if (props.resourceGroups) {
      const { length } = props.resourceGroups;
      if (length >= 0) {
        setSelection(
          new Set(
            props.groupList.filter((group: Group) =>
              props.resourceGroups.map((g) => g.id).includes(group.id)
            )
          )
        );
      }
      if (length < props.selectLimit && !props.disabled) {
        setWrapperClass('action');
      } else {
        setWrapperClass('disable');
      }
    } else {
      if (!props.disabled) {
        setWrapperClass('action');
        setSelection(new Set());
      }
    }
  };

  useEffect(() => {
    setGroupList(props.groupList);
    initSelectedGroup();
  }, [props.groupList]);

  useEffect(() => {
    initSelectedGroup();
  }, [props.resourceGroups, props.disabled]);

  const checkWrapper = (s) =>
    setWrapperClass(s.size < props.selectLimit ? 'action' : 'disable');

  useEffect(() => {
    if (props.isResetted) {
      const originalSet = new Set(props.resourceGroups);
      checkWrapper(originalSet);
      props.onSelect(originalSet);
      setSelection(originalSet);
    }
  }, [props.isResetted]);

  const toggleOpen = () => {
    setDialogOpen(!isDialogOpen);
    setFilter('');
    setGroupList(props.groupList);
    setSelectedGroup(undefined);
  };

  const onGroupSelect = () => {
    setSelection(() => {
      if (selectedGroup) {
        selection.add(selectedGroup);
      }
      checkWrapper(selection);
      props.onSelect(selection);
      return selection;
    });
    setSelectedGroup(undefined);
    setDialogOpen(!isDialogOpen);
  };

  const onClickGroup = (group: Group) => {
    setSelectedGroup(group);
    props.getMembers(group.id);
  };

  const onRemoveGroup = (id) =>
    setSelection(() => {
      const newSet = new Set(
        Array.from(selection).filter((group: Group) => group.id !== id)
      );
      checkWrapper(newSet);
      props.onSelect(newSet);
      return newSet;
    });

  const memberGroupHeader = (name: string) => (
    <div className={`${ROOT}__group-header`}>
      <div className={`${ROOT}__group-header__name`}>{name}</div>
    </div>
  );

  const memberBody = (member: Member) => (
    <div key={member.id} className={`${ROOT}__group-member`}>
      <img className={`${ROOT}__group-member__avatar`} src={member.url} />
      <div className={`${ROOT}__group-member__info`}>
        <div className={`${ROOT}__group-member__info__name`}>{member.name}</div>
        <div className={`${ROOT}__group-member__info__title`}>
          {member.title}
        </div>
      </div>
    </div>
  );

  const memberGroup = (groupName: string, memberList: Array<Member>) =>
    memberList &&
    memberList.length > 0 && (
      <div>
        {memberGroupHeader(groupName)}
        {memberList.map((member) => memberBody(member))}
      </div>
    );

  const filterList = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value.length) {
      const filteredList = props.groupList.filter((listItem) =>
        listItem.name.toLowerCase().includes(value.toLowerCase())
      );
      setGroupList(filteredList);
    } else {
      setGroupList(props.groupList);
    }
  };

  const modalContent = (
    <div className={`${ROOT}__modal-content`}>
      <div className={`${ROOT}__group-list`}>
        <div className={`${ROOT}__group-list__item-container`}>
          <div className={`${ROOT}__enableResourceGroupListFilter`}>
            <input
              type="text"
              className="ts-text-field slds-input"
              onChange={filterList}
              value={filter}
              placeholder={`Search Resource Group`}
            />
          </div>
          {props.groupList
            ? groupList.map((group: Group) => (
                <ListItem
                  key={group.id}
                  hasChildren
                  opened={selectedGroup && group.id === selectedGroup.id}
                  onClick={() => onClickGroup(group)}
                >
                  {selection && selection.has(group) && (
                    <CheckIcon className={`${ROOT}__group-list__item__check`} />
                  )}
                  <span
                    className={
                      selectedGroup && group.id === selectedGroup.id
                        ? `${ROOT}__group-list__item__selected`
                        : ''
                    }
                  >
                    {group.name}
                  </span>
                </ListItem>
              ))
            : null}
        </div>
      </div>
      {selectedGroup && (
        <div className={`${ROOT}__group-members`}>
          {props.groupDetail &&
            props.groupDetail.owners &&
            props.groupDetail.owners.length > 0 &&
            memberGroup(
              msg().Psa_Lbl_ResourceGroupOwner,
              props.groupDetail.owners
            )}
          {memberGroup(
            msg().Psa_Lbl_SelectedResource,
            props.groupDetail.members
          )}
        </div>
      )}
    </div>
  );

  const modalFooter = (
    <DialogFrame.Footer>
      <Button type="default" onClick={toggleOpen}>
        {msg().Psa_Btn_Cancel}
      </Button>
      <Button
        disabled={isSelectionDisabled}
        type="primary"
        onClick={onGroupSelect}
      >
        {msg().Com_Btn_Select}
      </Button>
    </DialogFrame.Footer>
  );

  const selectDialog = (
    <DialogFrame
      title={props.title}
      hide={toggleOpen}
      className={`${ROOT}__modal`}
      draggable
      footer={modalFooter}
    >
      {modalContent}
    </DialogFrame>
  );

  const selectionButton = (
    <div className={`${ROOT}__selection-button`}>
      <IconAdd className={`${ROOT}__selection-button__icon__${wrapperClass}`} />
      <div
        onClick={
          props.disabled || wrapperClass === 'disable' ? null : toggleOpen
        }
      >
        <span className={`${ROOT}__selection-button__name__${wrapperClass}`}>
          {props.name}
        </span>
      </div>
    </div>
  );

  const selectionList = (
    <div className={`${ROOT}__selection-list`}>
      {Array.from(selection).map((group: Group) => (
        <div key={group.id} className={`${ROOT}__selection-list__item`}>
          <span className={`${ROOT}__selection-list__item__label`}>
            {group.name}
          </span>
          <CloseButton
            className={`${ROOT}__selection-list__item__close-button${
              props.disabled ? '__disable' : ''
            } `}
            onClick={() => {
              if (!props.disabled) {
                onRemoveGroup(group.id);
                props.onRemove && props.onRemove();
              }
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${ROOT}`}>
      <div className={`${ROOT}__selection`}>
        {selectionButton}
        {selectionList}
      </div>
      <Portal>
        {isDialogOpen && selection.size < props.selectLimit && selectDialog}
      </Portal>
    </div>
  );
};

export default ResourceGroupFilter;
