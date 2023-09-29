import * as React from 'react';

import isEmpty from 'lodash/isEmpty';

import displayType from '../../../constants/displayType';
import fieldType from '../../../constants/fieldType';
import { FunctionTypeList } from '../../../constants/functionType';

import msg from '../../../../commons/languages';

import * as ConfigUtil from '../../../utils/ConfigUtil';

import DataGrid from '../../../components/DataGrid';

import ListPaneHeader from './ListPaneHeader';

import './ListPane.scss';

const ROOT = 'admin-pc-contents-list-pane';

type Props = {
  configList: ConfigUtil.ConfigListMap;
  itemList: Array<{
    [key: string]: any;
  }>;
  onClickRow: (
    arg0: number,
    arg1: {
      [key: string]: any;
    }
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
    if (this.props.itemList !== nextProps.itemList) {
      this.setState(() => {
        const rows = this.convertItemListToRows(nextProps.itemList);
        return { rows };
      });
    }
  }

  onRowClick(rowIdx: number, selectedRow: any) {
    if (
      this.props.onClickRow !== null &&
      this.props.onClickRow instanceof Function
    ) {
      this.props.onClickRow(rowIdx, selectedRow);
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
          filterable: false,
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
      const row = { originIndex: 0 };
      this.getAllConfigList().forEach((config) => {
        if (
          !config.listHidden &&
          ConfigUtil.isAllowedFunction(config, this.props.useFunction)
        ) {
          switch (config.type) {
            case fieldType.FIELD_HIDDEN:
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
      row.originIndex = index;
      return row;
    });
  }

  render() {
    return (
      <div className={`${ROOT}`}>
        <ListPaneHeader title={this.props.title} />
        <div className={`${ROOT}__react-data-grid-wrapper`}>
          <div className={`${ROOT}__react-data-grid`}>
            {isEmpty(this.props.itemList) ? null : (
              <DataGrid
                // @ts-ignore
                columns={this.state.columns}
                rows={this.state.rows}
                onRowClick={this.props.onClickRow}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
