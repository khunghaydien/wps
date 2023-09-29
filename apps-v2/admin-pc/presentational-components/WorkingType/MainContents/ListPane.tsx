import * as React from 'react';

import _ from 'lodash';

import styled from 'styled-components';

import displayType from '../../../constants/displayType';
import fieldType from '../../../constants/fieldType';
import { FunctionTypeList } from '../../../constants/functionType';

import DateField from '../../../../commons/components/fields/DateField';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { Condition as SearchCondition } from '../../../modules/workingType/ui/searchCondition';

import * as ConfigUtil from '../../../utils/ConfigUtil';

import ListSearchForm, {
  FIELD_TYPE,
  Props as ListSearchFormProps,
} from '../../../components/ListSearchFormWithType';
import $ListPagingLayout, {
  Props as $ListPagingLayoutProps,
} from '../../../components/MainContents/ListPagingLayout';
import ListPaneHeader from '../../../components/MainContents/ListPaneHeader';

import './ListPane.scss';

const ROOT = 'admin-pc-contents-list-pane';

export type WorkingType = {
  code: string;
  name: string;
};
type ListPagingLayoutProps = $ListPagingLayoutProps<WorkingType>;

type Props = {
  configList: ConfigUtil.ConfigListMap;
  selectedCode: string;
  itemList: Array<{
    [key: string]: any;
  }>;
  historyTargetDate: string;
  selectedRowIndex: number;
  searchCondition: SearchCondition;
  sortCondition: ListPagingLayoutProps['sort'];
  pageCondition: {
    currentPage: number;
    limitPerPage: number;
    limit: number;
    total: number;
    isOverLimit: boolean;
  };
  onChangeHistoryTargetDate: (arg0: string) => void;
  onClickCreateNewButton: () => void;
  onChangeSearchValue: ListSearchFormProps['onChange'];
  onClickSearchButton: ListSearchFormProps['onSubmit'];
  onClickPagerLink: ListPagingLayoutProps['onClickPagerLink'];
  onClickListHeaderCell: ListPagingLayoutProps['onClickListHeaderCell'];
  onClickListRow: (
    arg0: {
      [key: string]: any;
    },
    arg1: number
  ) => void;
  title: string;
  value2msgkey: {
    [key: string]: any;
  };
  useFunction: FunctionTypeList;
};

type State = {
  rows: Array<{
    [key: string]: any;
  }>;
  columns: Array<{
    [key: string]: any;
  }>;
};

const ListPaneWrapper = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: $color-bg-pane-second;
  text-align: left;
`;
const ListPagingLayout = styled($ListPagingLayout)`
  height: calc(100% - 83px);
`;

export default class ListPane extends React.PureComponent<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      rows: [],
      columns: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({
      columns: this.convertConfigListToColumns(),
      rows: this.convertItemListToRows(this.props.itemList),
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.itemList !== nextProps.itemList ||
      this.props.selectedCode !== nextProps.selectedCode
    ) {
      this.setState((prevState) => {
        const rows = this.convertItemListToRows(nextProps.itemList);
        const selectedCode = _.isNil(nextProps.selectedCode)
          ? prevState.rows.find((x) => x.isSelected)?.code || ''
          : nextProps.selectedCode;
        if (selectedCode) {
          const row = rows.find((x) => x.code === selectedCode);
          if (row) {
            row.isSelected = true;
          }
        }
        return { rows };
      });
    }
  }

  getAllConfigList() {
    const { base, history } = this.props.configList;
    const allConfigList = [];
    this.getConfigList(base, allConfigList);
    if (history) {
      this.getConfigList(history, allConfigList);
    }
    return allConfigList;
    // return history ? base.concat(history) : base;
  }

  getConfigList(
    configList: ConfigUtil.ConfigList,
    allConfigList: Array<ConfigUtil.Config>
  ) {
    if (!configList) {
      return;
    }
    configList.forEach((config) => {
      if (config.section) {
        this.getConfigList(config.configList, allConfigList);
      } else if (config.key) {
        allConfigList.push(config);
      }
    });
  }

  convertConfigListToColumns() {
    return this.getAllConfigList()
      .filter((config) => {
        return (
          config.type !== fieldType.FIELD_HIDDEN &&
          config.type !== fieldType.FIELD_USER_NAME &&
          config.display !== displayType.DISPLAY_DETAIL &&
          ConfigUtil.isAllowedFunction(config, this.props.useFunction)
        );
      })
      .map((config) => {
        return {
          key: config.key,
          name: msg()[config.msgkey],
          filterable: true,
          sortable: true,
          resizable: true,
        };
      });
  }

  convertItemListToRows(
    itemList: Array<{
      [key: string]: any;
    }>
  ) {
    return itemList.map<{
      [key: string]: any;
    }>((item, index) => {
      const row = {};
      this.getAllConfigList().forEach((config) => {
        if (
          !config.listHidden &&
          ConfigUtil.isAllowedFunction(config, this.props.useFunction)
        ) {
          switch (config.type) {
            case fieldType.FIELD_HIDDEN:
            case fieldType.FIELD_USER_NAME:
            case fieldType.FIELD_VALID_DATE:
              break;
            case fieldType.FIELD_SELECT:
            case fieldType.FIELD_AUTOSUGGEST_TEXT:
            case fieldType.FIELD_SELECT_WITH_PLACEHOLDER:
              if (item[config.dependent]) {
                row[config.key] = item[config.dependent].name || '';
              } else if (config.multiLanguageValue) {
                if (_.isArray(item[config.key])) {
                  row[config.key] = item[config.key]
                    .map((i) => {
                      if (
                        this.props.value2msgkey[config.key] &&
                        this.props.value2msgkey[config.key][i]
                      ) {
                        return (
                          msg()[this.props.value2msgkey[config.key][i]] || i
                        );
                      } else {
                        return i;
                      }
                    })
                    .join(',');
                } else {
                  let msgkey;
                  if (
                    this.props.value2msgkey[config.key] &&
                    this.props.value2msgkey[config.key][item[config.key]]
                  ) {
                    msgkey =
                      this.props.value2msgkey[config.key][item[config.key]];
                    row[config.key] = msg()[msgkey];
                  } else {
                    row[config.key] = item[config.key];
                  }
                }
              } else {
                row[config.key] = item[config.key] || '';
              }

              break;
            case fieldType.FIELD_CHECKBOX:
              row[config.key] =
                item[config.key] === true ? msg()[config.label] : '';
              break;
            case fieldType.FIELD_TEXT:
              if (config.charType === 'numeric' && !item[config.key]) {
                row[config.key] = 0;
              } else {
                row[config.key] = item[config.key] || '';
              }

              break;
            case fieldType.FIELD_DATE:
              row[config.key] = item[config.key]
                ? DateUtil.formatDateStrToSlashes(item[config.key])
                : '';
              break;
            case fieldType.FIELD_CUSTOM:
              if (item[config.dependent]) {
                row[config.key] = item[config.dependent].name || '';
              }

              break;
            default:
              row[config.key] = item[config.key] || '';
              break;
          }
        }
      });
      // @ts-ignore
      row.originIndex = index;
      return row;
    });
  }

  renderHistoryArea() {
    if (_.isNil(this.props.configList.history)) {
      return null;
    }

    return (
      <div className={`${ROOT}__header-area__history`}>
        <div className={`${ROOT}__header-area__history-label`}>
          {msg().Admin_Lbl_TargetDate}：
        </div>
        <div className={`${ROOT}__header-area__history-date_field`}>
          <DateField
            onChange={(value: string) => {
              this.props.onChangeHistoryTargetDate(value);
            }}
            value={this.props.historyTargetDate}
          />
        </div>
      </div>
    );
  }

  render() {
    const fields = [
      {
        key: 'code',
        label: msg().Admin_Lbl_Code,
        value: this.props.searchCondition.code,
        disabledSort: false,
        fieldType: FIELD_TYPE.TEXT,
      },
      {
        key: 'name',
        label: msg().Admin_Lbl_Name,
        value: this.props.searchCondition.name,
        disabledSort: true,
        fieldType: FIELD_TYPE.TEXT,
      },
    ];
    return (
      <ListPaneWrapper>
        <ListPaneHeader
          title={this.props.title}
          historyArea={this.renderHistoryArea()}
          onClickCreateNewButton={this.props.onClickCreateNewButton}
        />
        <ListPagingLayout
          hiddenRefresh={true}
          maxLimit={this.props.pageCondition.limit}
          renderForm={() => (
            <ListSearchForm
              fields={fields.map(
                ({ disabledSort: _disabledSort, ...field }) => field
              )}
              onChange={this.props.onChangeSearchValue}
              onSubmit={this.props.onClickSearchButton}
            />
          )}
          fields={fields.map(
            ({ value: _value, fieldType: _fieldType, ...field }) => field
          )}
          records={this.props.itemList}
          renderField={(value) => {
            return value;
          }}
          sort={this.props.sortCondition}
          currentPage={this.props.pageCondition.currentPage}
          pageSize={this.props.pageCondition.limitPerPage}
          limit={this.props.pageCondition.limit}
          totalNum={this.props.pageCondition.total}
          isOverLimit={this.props.pageCondition.isOverLimit}
          emptyMessage={msg().Com_Msg_NotFound}
          selectedRowIndex={this.props.selectedRowIndex}
          onClickListRow={this.props.onClickListRow}
          onClickRefreshButton={() => {}}
          onClickListHeaderCell={this.props.onClickListHeaderCell}
          onClickPagerLink={this.props.onClickPagerLink}
        />
      </ListPaneWrapper>
    );
  }
}
