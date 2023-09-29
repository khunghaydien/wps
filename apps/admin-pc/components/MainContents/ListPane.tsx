import React from 'react';

import _ from 'lodash';

import displayType from '../../constants/displayType';
import fieldType from '../../constants/fieldType';

import Button from '../../../commons/components/buttons/Button';
// import AdminUtil from '../../../commons/utils/AdminUtil';
import DateField from '../../../commons/components/fields/DateField';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';

import * as ConfigUtil from '../../utils/ConfigUtil';

import DataGrid from '../DataGrid';
import ListPaneHeader from './ListPaneHeader';

import './ListPane.scss';

// import btnSearch from '../../images/btnSearch.png';

const ROOT = 'admin-pc-contents-list-pane';

type Props = {
  configList: any;
  itemList: Array<any>;
  historyTargetDate: string;
  onChangeHistoryTargetDate: any;
  onClickCreateNewButton: any;
  onClickEditButton: any;
  onClickSearchButton: any;
  title: string;
  value2msgkey: any;
  useFunction?: any;
  hideNewButton?: any;
  editRecord?: any;
  getOrganizationSetting?: any;
  tmpEditRecord?: any;
  cellActions?: (column: any, row: any) => void;
};
export default class ListPane extends React.PureComponent<Props> {
  constructor(props) {
    super(props);

    this.state = {
      rows: [],
      columns: [],
    };

    this.onRowClick = this.onRowClick.bind(this);
    this.onClickCreateNewButton = this.onClickCreateNewButton.bind(this);
    this.deselectRow = this.deselectRow.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({
      columns: this.convertConfigListToColumns(),
      rows: this.convertItemListToRows(this.props.itemList),
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.itemList !== nextProps.itemList) {
      this.setState((prevState) => {
        const rows = this.convertItemListToRows(nextProps.itemList);
        // @ts-ignore
        const selectedIdx = prevState.rows.findIndex((x) => x.isSelected);
        if (selectedIdx > -1 && rows[selectedIdx]) {
          rows[selectedIdx].isSelected = true;
        }
        return { rows };
      });
    }
  }

  onClickCreateNewButton() {
    // AdminUtil.allowDiscardingEditingRecord(this.props.tmpEditRecord, this.props.editRecord, yes => {
    //  if (!yes) {
    //    return;
    //  }

    this.props.onClickCreateNewButton();

    // }
    // end of AdminUtil.allowDiscardingEditingRecord
  }

  onRowClick(rowIdx, selectedRow, clickEditButton = true) {
    // AdminUtil.allowDiscardingEditingRecord(this.props.tmpEditRecord, this.props.editRecord, yes => {
    //  if (!yes) {
    //    return;
    //  }

    if (selectedRow) {
      this.setState(
        (prevState) => {
          // @ts-ignore
          const rows = _.cloneDeep(prevState.rows);
          rows.forEach((row) => {
            row.isSelected = row.originIndex === selectedRow.originIndex;
          });
          return { rows };
        },
        () => {
          if (clickEditButton) {
            this.props.onClickEditButton(
              this.props.itemList[selectedRow.originIndex]
            );
          }
        }
      );
    }

    // }
    // end of AdminUtil.allowDiscardingEditingRecord
  }

  deselectRow() {
    this.setState((prevState) => {
      // @ts-ignore
      const rows = _.cloneDeep(prevState.rows);
      rows.map((row) => {
        row.isSelected = false;
        return row;
      });
      return { rows };
    });
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

  getConfigList(configList, allConfigList) {
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
          filterable: config.msgkey !== null,
          sortable: true,
          resizable: true,
        };
      });
  }

  convertItemListToRows(itemList) {
    return itemList.map((item, index) => {
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
                ? DateUtil.dateFormat(item[config.key])
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
            onChange={(value) => {
              this.props.onChangeHistoryTargetDate(value);
            }}
            value={this.props.historyTargetDate}
          />
        </div>
        <Button
          className={`${ROOT}__header-area__history-search_button`}
          onClick={this.props.onClickSearchButton}
        >
          {msg().Exp_Btn_Search}
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className={`${ROOT}`}>
        <ListPaneHeader
          title={this.props.title}
          historyArea={this.renderHistoryArea()}
          onClickCreateNewButton={this.props.onClickCreateNewButton}
          hideNewButton={this.props.hideNewButton}
        />
        <div className={`${ROOT}__react-data-grid-wrapper`}>
          <div className={`${ROOT}__react-data-grid`}>
            {_.isEmpty(this.props.itemList) ? null : (
              <DataGrid
                // @ts-ignore
                columns={this.state.columns}
                // @ts-ignore
                rows={this.state.rows}
                onRowClick={this.onRowClick}
                cellActions={this.props.cellActions}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
