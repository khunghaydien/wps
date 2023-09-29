import React from 'react';

import '../../../commons/components/exp/Form/Dialog/RouteSelect/RecordHeader/index.scss';
import '../../../commons/components/exp/Form/Dialog/RouteSelect/index.scss';
import '../../../commons/components/exp/Form/Dialog/RouteSelect/ContentsHeader/index.scss';
import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
// common components
import msg from '../../../commons/languages';

import { Route } from '../../../domain/models/exp/jorudan/Route';
// prop types
import { StationInfo } from '../../../domain/models/exp/jorudan/Station';

import Content from './Content';
// custom components
import Form from './Form';
import RecordBody from './RecordBody';
import RecordHeader from './RecordHeader';

// styles
import './index.scss';

const ROOT = 'ts-expenses-modal-route';
const SELECTED_ROUTE_KEY = 'jorudanRoute';

type Props = {
  // states
  disabled: boolean;
  errorArrival: string;
  errorOrigin: string;
  errorViaList: Array<string>;
  route: Route;
  tmpArrival: string;
  tmpOrigin: string;
  tmpViaList: Array<string>;
  useChargedExpress: string;
  // event handlers
  onClickDeleteViaButton: (arg0: number) => void;
  onClickAddViaButton: () => void;
  onClickSearchRouteButton: () => void;
  onChangeUseChargedExpress: (arg0: string) => void;
  onChangeOrigin: (arg0: StationInfo) => void;
  onChangeTmpOrigin: (arg0: string, arg1: boolean) => void;
  onChangeArrival: (arg0: StationInfo) => void;
  onChangeTmpArrival: (arg0: string, arg1: boolean) => void;
  onChangeViaList: (arg0: StationInfo, arg1: number) => void;
  onChangeTmpViaList: (arg0: string, arg1: number, arg2: boolean) => void;
  onClickResetRouteButton: () => void;
  // admin methods
  tmpEditRecordHistory: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

type State = {
  visible: boolean;
  selectedRoute: any;
};

export default class CommuterRoute extends React.Component<Props, State> {
  state = {
    visible: false,
    selectedRoute: this.props.tmpEditRecordHistory.jorudanRoute || null,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const isSelectedRouteChanged =
      this.props.tmpEditRecordHistory !== nextProps.tmpEditRecordHistory;

    if (isSelectedRouteChanged) {
      this.setState({
        selectedRoute: nextProps.tmpEditRecordHistory.jorudanRoute || null,
      });
    }
  }

  componentWillUnmount() {
    this.resetRouteInfo();
  }

  toggleDialogVisibility = () => {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  };

  resetRouteInfo = () => {
    this.props.onClickResetRouteButton();
    this.props.onChangeDetailItem(SELECTED_ROUTE_KEY, null);
    this.setState({
      selectedRoute: null,
    });
  };

  handleRouteSelectClick = (item: any) => {
    const selectedRoute = item;

    this.props.onChangeDetailItem(SELECTED_ROUTE_KEY, item);
    // set selected state and hide dialog
    this.setState({
      selectedRoute,
      visible: false,
    });
  };

  renderDialog() {
    if (!this.state.visible) {
      return null;
    } else {
      return (
        <DialogFrame
          title={msg().Exp_Lbl_CommuterPassSearch}
          className={ROOT}
          hide={this.toggleDialogVisibility}
          footer={
            <div className={`${ROOT}-btn-close`}>
              <Button onClick={this.toggleDialogVisibility}>
                {msg().Com_Btn_Close}
              </Button>
            </div>
          }
        >
          <div className={`${ROOT}-contents`}>
            <Form
              useChargedExpress={this.props.useChargedExpress}
              tmpOrigin={this.props.tmpOrigin}
              errorOrigin={this.props.errorOrigin}
              onChangeOrigin={this.props.onChangeOrigin}
              onChangeTmpOrigin={this.props.onChangeTmpOrigin}
              tmpViaList={this.props.tmpViaList}
              errorViaList={this.props.errorViaList}
              onChangeViaList={this.props.onChangeViaList}
              onChangeTmpViaList={this.props.onChangeTmpViaList}
              onClickAddViaButton={this.props.onClickAddViaButton}
              tmpArrival={this.props.tmpArrival}
              errorArrival={this.props.errorArrival}
              onChangeArrival={this.props.onChangeArrival}
              onChangeTmpArrival={this.props.onChangeTmpArrival}
              onChangeUseChargedExpress={this.props.onChangeUseChargedExpress}
              onClickSearchRouteButton={this.props.onClickSearchRouteButton}
              onDeleteVia={this.props.onClickDeleteViaButton}
            />
            <Content
              route={this.props.route}
              onClickRouteSelectListItem={this.handleRouteSelectClick}
            />
          </div>
        </DialogFrame>
      );
    }
  }

  renderSelectedRoute() {
    if (this.state.selectedRoute) {
      return (
        <div className="commuter-route__selected">
          <RecordBody item={this.state.selectedRoute} />
          <RecordHeader item={this.state.selectedRoute} />
          <Button disabled={this.props.disabled} onClick={this.resetRouteInfo}>
            {msg().Admin_Lbl_CommuterResetButton}
          </Button>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <Button
            disabled={this.props.disabled}
            type="secondary"
            onClick={this.toggleDialogVisibility}
          >
            {msg().Admin_Lbl_SearchRoute}
          </Button>
          {this.renderDialog()}
        </React.Fragment>
      );
    }
  }

  render() {
    return <div className="commuter-route">{this.renderSelectedRoute()}</div>;
  }
}
