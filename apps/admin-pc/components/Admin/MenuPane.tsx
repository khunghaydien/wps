import React from 'react';

import _ from 'lodash';

import Chevronright from '../../../../node_modules/@salesforce-ux/design-system/assets/icons/utility/chevronright.svg';

import { MenuGroup, MenuItem } from '../../constants/Setting/types';

import SelectField from '../../../commons/components/fields/SelectField';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import { QuickSearchField } from '../../../core';

import './MenuPane.scss';

const ROOT = 'admin-pc-menu-pane';

type Props = {
  getOrganizationSetting: {
    [key: string]: string | null | undefined;
  };
  searchCompany: Array<{
    [key: string]: any;
  }>;
  selectedCompanyId: string;
  isCompany: boolean;
  menuGroupList: MenuGroup[];
  hasPermission: (arg0: any) => boolean;
  selectedKey: string;
  onClickMenuItem: (
    event: React.SyntheticEvent<HTMLElement> | null | undefined,
    key: string,
    title: string,
    type: string | null | undefined
  ) => void;
  onChangeSelectedCompany: (
    arg0: React.SyntheticEvent<HTMLSelectElement>
  ) => void;
};

type State = {
  openKeyList: string[];
  displayMenuList: MenuGroup[];
  searchText: string;
  showNoMatchMsg: boolean;
};

export default class MenuPane extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onClickMenuItem = this.onClickMenuItem.bind(this);
  }

  UNSAFE_componentWillMount() {
    // 全て展開
    let openKeyList = [];
    (this.props.menuGroupList || []).forEach((groupItem) => {
      openKeyList = openKeyList.concat(this.getKeyList(groupItem.menuList));
    });
    this.setState({
      openKeyList,
      displayMenuList: this.props.menuGroupList,
      searchText: '',
    });
  }

  componentDidMount() {
    this.setState({
      showNoMatchMsg: document.getElementsByTagName('li').length === 0,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (!_.isEqual(this.props.menuGroupList, nextProps.menuGroupList)) {
      let openKeyList = [];
      (nextProps.menuGroupList || []).forEach((groupItem) => {
        openKeyList = openKeyList.concat(this.getKeyList(groupItem.menuList));
      });
      this.setState({
        openKeyList,
        displayMenuList: nextProps.menuGroupList,
        searchText: '',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedCompanyId !== this.props.selectedCompanyId)
      this.setState({
        showNoMatchMsg: document.getElementsByTagName('li').length === 0,
      });
  }

  onClickTreeOpener(event: React.SyntheticEvent<HTMLElement>, key: string) {
    this.setState((prevState) => {
      const openKeyList = _.cloneDeep(prevState.openKeyList);
      if (!_.includes(openKeyList, key)) {
        openKeyList.push(key);
      } else {
        _.pull(openKeyList, key);
      }
      return {
        openKeyList,
      };
    });
    event.stopPropagation();
  }

  onClickMenuItem(
    event: React.SyntheticEvent<HTMLElement>,
    key: string,
    title: string
  ) {
    this.props.onClickMenuItem(event, key, title, null);
    event.stopPropagation();
  }

  getKeyList(menuList: MenuItem[]) {
    let retList = [];
    (menuList || []).forEach((menuItem) => {
      retList.push(menuItem.key);
      if (menuItem.childMenuList && menuItem.childMenuList.length) {
        retList = retList.concat(this.getKeyList(menuItem.childMenuList));
      }
    });
    return retList;
  }

  isPermissionSatisfied(menuItem: MenuItem | MenuGroup): boolean {
    const { requiredPermission } = menuItem;

    return (
      // NOTE: requiredPermissionの設定が無ければチェックせず利用を許可する
      requiredPermission === undefined ||
      this.props.hasPermission(requiredPermission)
    );
  }

  filterTree(
    list: Array<MenuGroup | MenuItem>,
    keyword: string
  ): Array<MenuGroup | MenuItem> {
    return _.filter(list, (item: MenuGroup & MenuItem) => {
      if (msg()[item.name].toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      } else if (item.menuList) {
        item.menuList = this.filterTree(item.menuList, keyword) as MenuItem[];
        return !_.isEmpty(item.menuList);
      } else if (item.childMenuList) {
        item.childMenuList = this.filterTree(
          item.childMenuList,
          keyword
        ) as MenuItem[];
        return !_.isEmpty(item.childMenuList);
      }
    });
  }

  /*
   * メニュー項目のリンク表示
   */
  renderMenuLink(menuItem: MenuItem, currentId: string) {
    const selectedClassName =
      this.props.selectedKey === menuItem.key
        ? `${ROOT}__tree-menu-item-text-link--selected`
        : '';

    return (
      <a
        id={`${currentId}__label`}
        tabIndex={-1}
        role="presentation"
        className="slds-text-link--reset"
        title={msg()[menuItem.name] || menuItem.name}
      >
        {TextUtil.getMarkedLabel(
          msg()[menuItem.name] || menuItem.name,
          this.state.searchText,
          `slds-text-link ${selectedClassName}`
        )}
      </a>
    );
  }

  /*
   * メニュー項目の小見出し表示
   */
  renderMenuSubHeading(menuItem: MenuItem) {
    return (
      <a
        tabIndex={-1}
        role="presentation"
        className="slds-text-link--reset"
        title={msg()[menuItem.name] || menuItem.name}
      >
        {TextUtil.getMarkedLabel(
          msg()[menuItem.name] || menuItem.name,
          this.state.searchText
        )}
      </a>
    );
  }

  /**
   * メニュー項目の表示
   */
  renderMenuItem(
    menuItem: MenuItem,
    parentId: string,
    menuIndex: number,
    depth: number,
    useFunction: {
      [key: string]: any;
    },
    filter: string[],
    isInitializing: boolean
  ) {
    const isSubHeading = menuItem.childMenuList !== undefined;
    const currentId = `${parentId}-${menuIndex}`;
    const childFilter = _.cloneDeep(filter);

    if (menuItem.objectName) {
      childFilter.push(menuItem.objectName);
    }

    // 利用機能チェック
    if (
      useFunction !== undefined &&
      menuItem.objectName !== null &&
      menuItem.objectName !== undefined &&
      ((!menuItem.objectValue && useFunction[menuItem.objectName] === false) ||
        (typeof menuItem.objectValue !== 'undefined' &&
          useFunction[menuItem.objectName] !== menuItem.objectValue))
    ) {
      return null;
    }

    // アクセス権限チェック
    if (!this.isPermissionSatisfied(menuItem)) {
      return null;
    }

    // 初期表示チェック
    if (isInitializing && !menuItem.isInitialDisplay) {
      return null;
    }

    const children = isSubHeading
      ? (menuItem.childMenuList || []).map((childItem, i) => {
          return this.renderMenuItem(
            childItem,
            currentId,
            i,
            depth + 1,
            useFunction,
            filter,
            isInitializing
          );
        })
      : null;

    // 見出し要素で、下層に表示する内容がない場合、見出しごと非表示
    if (
      isSubHeading &&
      (!children || !children.some((item) => item !== null)) // ≒.every(i => i === null)
    ) {
      return null;
    }

    const menuClassName = isSubHeading
      ? `${ROOT}__tree-menu-item ${ROOT}__tree-menu-item--group`
      : `${ROOT}__tree-menu-item`;
    const selectedClassName =
      this.props.selectedKey === menuItem.key
        ? `${ROOT}__tree-menu-item--selected`
        : '';
    const openerHiddenClassName = isSubHeading ? '' : 'slds-is-disabled';

    const isOpen = _.includes(this.state.openKeyList, menuItem.key);

    let menuClickEvent;
    if (isSubHeading) {
      menuClickEvent = (event) => this.onClickTreeOpener(event, menuItem.key);
    } else {
      menuClickEvent = (event) =>
        this.onClickMenuItem(
          event,
          menuItem.key,
          msg()[menuItem.name] || menuItem.name
        );
    }

    return (
      <li
        key={currentId}
        id={currentId}
        role="treeitem"
        aria-level={depth}
        aria-expanded={isOpen}
        className={`${menuClassName}`}
        onClick={menuClickEvent}
        data-filter={childFilter}
      >
        <div className={`slds-tree__item ${selectedClassName}`}>
          <button
            className={`slds-button slds-button--icon slds-m-right--x-small ${openerHiddenClassName} ${ROOT}__tree-menu-btn`}
            aria-controls={currentId}
            title="Toggle"
          >
            <Chevronright
              aria-hidden="true"
              className="slds-button__icon slds-button__icon--small"
            />

            <span className="slds-assistive-text">Toggle</span>
          </button>
          {isSubHeading
            ? this.renderMenuSubHeading(menuItem)
            : this.renderMenuLink(menuItem, currentId)}
        </div>
        {isSubHeading && children && children.length ? (
          <ul
            id={`${currentId}-child`}
            className={isOpen ? 'slds-is-expanded' : 'slds-is-collapsed'}
            role="group"
            aria-labelledby={`${currentId}__label`}
          >
            {children}
          </ul>
        ) : null}
      </li>
    );
  }

  renderMenuList(
    menuList: MenuItem[],
    groupIndex: number,
    useFunction: {
      [key: string]: any;
    },
    filter: string[],
    isInitializing: boolean
  ) {
    const children = (menuList || []).map((item, i) => {
      const groupId = `tree${groupIndex}`;
      return this.renderMenuItem(
        item,
        groupId,
        i,
        1,
        useFunction,
        filter,
        isInitializing
      );
    });

    // 内容が無い場合、ulごと非表示
    if (!children.some((item) => item !== null)) {
      return null;
    }

    return <ul className={`${ROOT}__tree-menu-list`}>{children}</ul>;
  }

  renderGroupItem(
    groupItem: MenuGroup,
    i: number,
    useFunction: {
      [key: string]: any;
    } = {},
    isInitializing: boolean
  ) {
    if (
      useFunction !== undefined &&
      groupItem.objectName !== null &&
      groupItem.objectName !== undefined &&
      ((!groupItem.objectValue &&
        useFunction[groupItem.objectName] === false) ||
        (groupItem.objectValue &&
          useFunction[groupItem.objectName] !== groupItem.objectValue))
    ) {
      return null;
    }

    if (!this.isPermissionSatisfied(groupItem)) {
      return null;
    }

    const filter = groupItem.objectName ? [groupItem.objectName] : [];

    const children = this.renderMenuList(
      groupItem.menuList,
      i,
      useFunction,
      filter,
      isInitializing
    );

    // 内容が無い場合、liごと非表示
    if (children === null) {
      return null;
    }

    return (
      <li key={i}>
        <h4 className={`${ROOT}__tree-title--caps`} id="treeheading">
          {TextUtil.getMarkedLabel(
            msg()[groupItem.name] || groupItem.name,
            this.state.searchText
          )}
        </h4>
        {this.renderMenuList(
          groupItem.menuList,
          i,
          useFunction,
          filter,
          isInitializing
        )}
      </li>
    );
  }

  renderCompanySelector() {
    if (!this.props.isCompany) {
      return null;
    }

    const options = this.props.searchCompany.map((company) => {
      return { text: company.name, value: company.id };
    });

    return (
      <div className={`${ROOT}__tree-top`}>
        <SelectField
          className={`${ROOT}__tree-top__company-selector`}
          onChange={this.props.onChangeSelectedCompany}
          options={options}
          value={this.props.selectedCompanyId}
          disabled={!this.props.hasPermission(['switchCompany'])}
        />
      </div>
    );
  }

  renderQuickFinder() {
    if (!this.props.isCompany) {
      return null;
    }
    const menuGroupListCopy = _.cloneDeep(this.props.menuGroupList);
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const data = this.filterTree(menuGroupListCopy, value);
      this.setState(
        {
          searchText: value,
          displayMenuList: data as MenuGroup[],
        },
        () =>
          this.setState({
            showNoMatchMsg: document.getElementsByTagName('li').length === 0,
          })
      );
    };
    return (
      <div className={`${ROOT}__tree-top-search`}>
        <QuickSearchField
          placeholder={msg().Com_Lbl_QuickFind}
          onChange={onChangeHandler}
          value={this.state.searchText}
          debounce={false}
        />
      </div>
    );
  }

  render() {
    const { displayMenuList } = this.state;
    if (_.isEmpty(this.props.menuGroupList)) {
      return null;
    }

    const isInitializing = _.values(this.props.getOrganizationSetting).every(
      (value) => !value
    );

    const useFunction = _.find(this.props.searchCompany, {
      id: this.props.selectedCompanyId,
    });

    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__header`}>
          <div className={`${ROOT}__header-content slds-align-middle`}>
            <div className={`${ROOT}__header-content__title slds-align-middle`}>
              {msg().Admin_Lbl_ManagementScreen}
            </div>
          </div>
        </div>
        <div
          className={`${ROOT}__tree-container slds-tree-container`}
          role="application"
        >
          {this.renderCompanySelector()}
          {this.renderQuickFinder()}
          {this.state.showNoMatchMsg && (
            <div className={`${ROOT}__no-menu`}>
              {msg().Admin_Msg_NoMatchingItem}
            </div>
          )}
          <ul
            className={`${ROOT}__tree slds-tree`}
            role="tree"
            aria-labelledby="treeheading"
          >
            {displayMenuList.map((item, i) => {
              return this.renderGroupItem(item, i, useFunction, isInitializing);
            })}
          </ul>
        </div>
      </div>
    );
  }
}
