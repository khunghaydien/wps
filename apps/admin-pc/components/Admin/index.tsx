import React from 'react';

import _ from 'lodash';

import tabType, { TabType } from '../../../commons/constants/tabType';
import {
  MenuGroup,
  MenuItem,
  MenuSetting,
} from '../../constants/Setting/types';

import '../../../commons/styles/modal-transition-slideleft.css';
import GlobalHeader from '../../../commons/components/GlobalHeader';
import Tab from '../../../commons/components/Tab';
import GlobalContainer from '../../../commons/containers/GlobalContainer';
import msg from '../../../commons/languages';

// import AdminUtil from '../../../commons/utils/AdminUtil';
import { Permission } from '../../../domain/models/access-control/Permission';

import ContentsSelectorContainer from '../../containers/ContentsSelectorContainer';

import ImgIconHeaderAdmin from '../../images/Admin.svg';
import ImgMenuIconCompanyRequest from '../../images/menuIconCompanyRequest.png';
import ImgMenuIconOrganizationRequest from '../../images/menuIconOrganizationRequest.png';
import MenuPane from './MenuPane';

import './index.scss';

const ROOT = 'admin-pc';

type Props = {
  actions: {
    [key: string]: Function;
  };
  userSetting: {
    companyId: string;
  };
  getOrganizationSetting: {
    [key: string]: string | null | undefined;
  };
  searchCompany: Array<{
    [key: string]: any;
  }>;
  selectedTab: TabType;
  hasPermission: (arg0: (keyof Permission)[]) => boolean;
  onSelectMenuItem: (arg0: string) => void;
  onChangeCompany: (arg0: string) => void;
  companySettings: MenuGroup[];
  orgSettings: MenuSetting;
};

type State = {
  selectedKey: string;
  selectedCompanyId: string;
  title: string;
  selectedMenuFilter: string[];
};

/**
 * [Helper] メニュー項目を受け取り、再帰的に有効な項目のみ抽出して、フラットな配列として返却する
 * returns flatten valid menu items.
 */
const extractValidMenuItemsRecursively = (
  menuItem: MenuItem,
  hasPermission: (arg0: (keyof Permission)[]) => boolean,
  useFunction: {
    [key: string]: any;
  }
): MenuItem[] => {
  if (menuItem.objectName && !useFunction[menuItem.objectName]) {
    return [];
  }

  if (
    menuItem.requiredPermission &&
    !hasPermission(menuItem.requiredPermission)
  ) {
    return [];
  }

  return menuItem.childMenuList === undefined
    ? [menuItem]
    : menuItem.childMenuList.reduce(
        (acc, childMenuItem) =>
          acc.concat(
            extractValidMenuItemsRecursively(
              childMenuItem,
              hasPermission,
              useFunction
            )
          ),
        []
      );
};

/**
 * [Helper] メニュー設定を受け取って、有効な項目のみ抽出して返却する
 * returns flatten valid menu items.
 */
const extractValidMenuItemsFromMenuMenuSetting = (
  menuSetting: MenuSetting,
  hasPermission: (arg0: (keyof Permission)[]) => boolean,
  useFunction: {
    [key: string]: any;
  }
): MenuItem[] => {
  const menuItems: MenuItem[] = [];
  menuSetting.forEach((menuGroup) => {
    if (menuGroup.objectName && !useFunction[menuGroup.objectName]) {
      return;
    }

    if (
      menuGroup.requiredPermission &&
      !hasPermission(menuGroup.requiredPermission)
    ) {
      return;
    }

    menuGroup.menuList.forEach((menuItem) => {
      menuItems.push(
        ...extractValidMenuItemsRecursively(
          menuItem,
          hasPermission,
          useFunction
        )
      );
    });
  });
  return menuItems;
};

/**
 * 管理画面コンテンツ部
 * 管理画面の左ペインで選択された内容を元に各機能のコンテナーを作成して右ペインに描画する
 */
export default class Admin extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedKey: '',
      selectedCompanyId: '',
      title: '',
      selectedMenuFilter: [],
    };

    this.onClickMenuItem = this.onClickMenuItem.bind(this);
    this.onChangeSelectedCompany = this.onChangeSelectedCompany.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.props.actions.getLanguagePickList(),
      this.props.actions.getUserSetting(),
      this.props.actions.getOrganizationSetting(),
      this.props.actions.searchCompany(),
    ]).then(() => {
      // FIXME: 先行する非同期処理の結果を、then内でthis.props経由に参照するのは適切でないはず
      if (
        this.props.userSetting.companyId &&
        this.detectDefaultMenuItem(this.props.companySettings) !== null
      ) {
        this.selectTab(tabType.ADMIN_COMPANY_REQUEST);
      } else {
        this.selectTab(tabType.ADMIN_ORGANIZATION_REQUEST);
      }
    });
  }

  onClickMenuItem(
    event: React.SyntheticEvent<HTMLElement>,
    key: string,
    title: string,
    type: string | null | undefined = null
  ) {
    if (this.state.selectedKey === key) {
      return;
    }
    // FIXME: モック用として先頭"a"から始まるものは標準画面に遷移する
    if ((key || '').substring(0, 1) === 'a') {
      // @ts-ignore
      if (window.sforce) {
        // @ts-ignore
        window.sforce.one.navigateToURL(`/${key}`);
      } else {
        // @ts-ignore
        window.location = `/${key}`;
      }
    }
    const currentTarget = event !== null ? event.currentTarget : undefined;
    const filter =
      currentTarget !== undefined ? currentTarget.dataset.filter : '';

    // NOTE:
    // Don't move this methods to after `this.props.actions.selectTab(type)`
    // Organization Page initialize `tmpRecord`
    //   when Rendering(this.props.actions.selectTab(type) is executed.)
    // But if `this.props.actions.initializeEditRecord()` is called, `tmpRecord` will be empty.
    // https://teamspiritdev.atlassian.net/browse/GENIE-13712
    // ---
    // この関数を `this.props.actions.selectTab(type)` の後に移動しないでください。
    // 全体設定ページはレンダリング時に `tmpRecord` を初期化しておりますが、
    // `this.props.actions.initializeEditRecord()` が呼ばれると `tmpRecord` が空になってしまいます。
    // https://teamspiritdev.atlassian.net/browse/GENIE-13712
    this.props.actions.initializeEditRecord();
    this.props.actions.initializeDetailPane();

    // FIXME Set both local state and redux state. This should be fixed.
    this.setState({
      selectedKey: key,
      title,
      selectedMenuFilter: filter.split(','),
    });
    this.props.onSelectMenuItem(key);

    if (type) {
      this.props.actions.selectTab(type);
    }
  }

  onChangeSelectedCompany(event: React.SyntheticEvent<HTMLSelectElement>) {
    let newCompanyId;
    if (event && event.currentTarget) {
      // FIXME Set both local state and redux state. This should be fixed.
      newCompanyId = event.currentTarget.value;
      this.setState({ selectedCompanyId: newCompanyId });
      this.props.onChangeCompany(event.currentTarget.value);
    }
    const useFunction =
      _.find(this.props.searchCompany, {
        id: newCompanyId,
      }) || {};
    this.state.selectedMenuFilter.map((item) => {
      if (useFunction[item] === false) {
        const defaultMenu = this.detectDefaultMenuItem(
          this.props.companySettings,
          useFunction
        );
        if (defaultMenu) {
          this.onClickMenuItem(
            null,
            defaultMenu.key,
            msg()[defaultMenu.name],
            tabType.ADMIN_COMPANY_REQUEST
          );
        }
      }
      return item;
    });
  }

  detectDefaultMenuItem(
    menuSetting: MenuSetting,
    nextUseFunction?: {
      [key: string]: any;
    }
  ): MenuItem | null {
    const validUseFunction =
      nextUseFunction ||
      this.props.searchCompany.find(
        (company) => company.id === this.state.selectedCompanyId
      ) ||
      {};

    const validMenuItems = extractValidMenuItemsFromMenuMenuSetting(
      menuSetting,
      this.props.hasPermission,
      validUseFunction
    );

    return (
      validMenuItems.find((menuItem) => menuItem.key === 'Emp') ||
      validMenuItems[0] ||
      null
    );
  }

  selectTab(type: TabType | null | undefined) {
    if (type === tabType.ADMIN_ORGANIZATION_REQUEST) {
      const defaultMenu = this.detectDefaultMenuItem(this.props.orgSettings);
      if (defaultMenu) {
        this.onClickMenuItem(
          null,
          defaultMenu.key,
          msg()[defaultMenu.name],
          type
        );
      }
    } else if (
      !this.state.selectedCompanyId ||
      !_.find(this.props.searchCompany, { id: this.state.selectedCompanyId })
    ) {
      let selectedCompanyId;
      if (
        this.props.userSetting &&
        this.props.userSetting.companyId &&
        _.find(this.props.searchCompany, {
          id: this.props.userSetting.companyId,
        })
      ) {
        selectedCompanyId = this.props.userSetting.companyId;
      } else {
        selectedCompanyId = this.props.searchCompany[0].id;
      }

      this.props.onChangeCompany(selectedCompanyId);

      const defaultMenu = this.detectDefaultMenuItem(
        this.props.companySettings
      );
      this.setState({ selectedCompanyId }, () => {
        if (defaultMenu) {
          this.onClickMenuItem(
            null,
            defaultMenu.key,
            msg()[defaultMenu.name],
            type
          );
        }
      });
    } else {
      const defaultMenu = this.detectDefaultMenuItem(
        this.props.companySettings
      );
      if (defaultMenu) {
        this.onClickMenuItem(
          null,
          defaultMenu.key,
          msg()[defaultMenu.name],
          type
        );
      }
    }
  }

  renderHeaderContent() {
    if (_.isEmpty(this.props.searchCompany)) {
      return null;
    }

    const tabItemList = [];

    if (this.props.hasPermission(['manageOverallSetting'])) {
      tabItemList.push({
        icon: ImgMenuIconOrganizationRequest,
        label: msg().Admin_Lbl_Organization,
        onSelect: () => this.selectTab(tabType.ADMIN_ORGANIZATION_REQUEST),
        type: tabType.ADMIN_ORGANIZATION_REQUEST,
      });
    }

    tabItemList.push({
      icon: ImgMenuIconCompanyRequest,
      label: msg().Admin_Lbl_Tab_Company,
      onSelect: () => this.selectTab(tabType.ADMIN_COMPANY_REQUEST),
      type: tabType.ADMIN_COMPANY_REQUEST,
    });

    return (
      <div className={`${ROOT}__header slds`}>
        <div className="slds-align-middle">
          {tabItemList.map((item, i) => {
            return (
              <Tab
                icon={item.icon}
                key={i}
                label={item.label}
                onSelect={item.onSelect}
                selected={this.props.selectedTab === item.type}
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderMainContents(selectedCompanyId: string) {
    if (_.isEmpty(this.props.userSetting)) {
      return null;
    }
    const useFunction =
      _.find(this.props.searchCompany, { id: this.state.selectedCompanyId }) ||
      {};

    return (
      <ContentsSelectorContainer
        key="main"
        companyId={selectedCompanyId}
        selectedKey={this.state.selectedKey}
        title={this.state.title}
        useFunction={useFunction}
      />
    );
  }

  render() {
    let menuGroupList = [];
    let selectedCompanyId = '';
    if (this.props.selectedTab === tabType.ADMIN_COMPANY_REQUEST) {
      menuGroupList = this.props.companySettings;
      selectedCompanyId = this.state.selectedCompanyId;
    } else {
      menuGroupList = this.props.orgSettings;
    }

    return (
      <GlobalContainer>
        <GlobalHeader
          content={this.renderHeaderContent()}
          iconAssistiveText={msg().Admin_Lbl_ManagementScreen}
          iconSrc={ImgIconHeaderAdmin}
          iconSrcType="svg"
          showPersonalMenuPopoverButton={false}
          showProxyIndicator={false}
        />
        <div className={`${ROOT}`}>
          {this.props.selectedTab !== tabType.NONE
            ? [
                <MenuPane
                  key="menu"
                  searchCompany={this.props.searchCompany}
                  selectedCompanyId={selectedCompanyId}
                  selectedKey={this.state.selectedKey}
                  isCompany={
                    this.props.selectedTab === tabType.ADMIN_COMPANY_REQUEST
                  }
                  menuGroupList={menuGroupList}
                  getOrganizationSetting={this.props.getOrganizationSetting}
                  hasPermission={this.props.hasPermission}
                  onChangeSelectedCompany={this.onChangeSelectedCompany}
                  onClickMenuItem={this.onClickMenuItem}
                />,
                this.renderMainContents(selectedCompanyId),
              ]
            : null}
        </div>
      </GlobalContainer>
    );
  }
}
