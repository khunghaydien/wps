import React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';

import { StationInfo } from '../../../../../../../domain/models/exp/jorudan/Station';
import {
  Record,
  RouteInfo,
} from '../../../../../../../domain/models/exp/Record';

import btnOpen from '../../../../../../images/btnDetailClose.png';
import btnClose from '../../../../../../images/btnDetailOpen.png';
import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import IconButton from '../../../../../buttons/IconButton';
import AddViaButton from './AddViaButton';
import Condition from './Condition';
import Radio from './Radio';
import RouteOption from './RouteOption';
import Via from './Via';

import './index.scss';

const ROOT = 'ts-route-form';

type Props = {
  errorArrival: string;
  errorOrigin: string;
  errorViaList: Array<string>;
  errors: { recordDate?: string };
  expPreRecord?: Record;
  expRecord: Record;
  highwayBus: string;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  jorudanUseChargedExpress: string;
  readOnly: boolean;
  roundTrip: string;
  routeInfo: RouteInfo;
  routeSort: string;
  seatPreference: string;
  // components
  suggest: any;
  targetDate: string;
  tmpArrival: string;
  tmpOrigin: string;
  tmpViaList: Array<string>;
  touched: { recordDate?: string };
  useChargedExpress: string;
  useExReservation: string;
  onChangeArrival: (arg0: StationInfo) => void;
  onChangeHighwayBus: (arg0: string) => void;
  onChangeOrigin: (arg0: StationInfo) => void;
  onChangeRoundTrip: (arg0: string) => void;
  onChangeRouteSort: (arg0: string) => void;
  onChangeSeatPreference: (arg0: string) => void;
  onChangeTmpArrival: (arg0: string, arg1: boolean) => void;
  onChangeTmpOrigin: (arg0: string, arg1: boolean) => void;
  onChangeTmpViaList: (arg0: string, arg1: number, arg2: boolean) => void;
  onChangeUseChargedExpress: (arg0: string) => void;
  onChangeUseExReservation: (arg0: string) => void;
  onChangeViaList: (arg0: StationInfo, arg1: number) => void;
  onClickAddViaButton: () => void;
  onClickDeleteViaButton: (arg0: number) => void;
  onClickSearchRouteButton: () => void;
  onReverseOriginArrival: () => void;
  onReverseViaList: () => void;
};

type State = {
  inputArrival: string;
  inputOrigin: string;
  inputViaList: Array<string>;
  isOpen: boolean;
};

export default class RouteForm extends React.Component<Props, State> {
  state = {
    isOpen: false,
    inputOrigin: '',
    inputViaList: [],
    inputArrival: '',
  };

  componentDidMount() {
    this.setState({
      inputOrigin: this.props.tmpOrigin || '',
      inputArrival: this.props.tmpArrival || '',
      inputViaList: this.props.tmpViaList || [],
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (!_.isEqual(this.props.tmpOrigin, nextProps.tmpOrigin)) {
      this.setState({ inputOrigin: nextProps.tmpOrigin });
    }
    if (!_.isEqual(this.props.tmpArrival, nextProps.tmpArrival)) {
      this.setState({ inputArrival: nextProps.tmpArrival });
    }
    if (!_.isEqual(this.props.tmpViaList, nextProps.tmpViaList)) {
      this.setState({ inputViaList: nextProps.tmpViaList });
    }
  }

  onClickToggleButton = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  onClickAddViaButton = () => {
    this.setState((prevState) => {
      const newViaList = [...prevState.inputViaList];
      newViaList.push('');
      return {
        inputViaList: newViaList,
      };
    });
    this.props.onClickAddViaButton();
  };

  onClickDeleteViaButton = (idx: number) => {
    this.setState((prevState) => {
      const newViaList = [...prevState.inputViaList];
      newViaList.splice(idx, 1);
      return {
        inputViaList: newViaList,
      };
    });
    this.props.onClickDeleteViaButton(idx);
  };

  onChangeTmpOrigin = (value: string, isClear: boolean) => {
    this.setState({ inputOrigin: value });
    this.props.onChangeTmpOrigin(value, isClear);
  };

  onChangeTmpViaList = (value: string, idx: number, isClear: boolean) => {
    this.setState((prevState) => {
      const newViaList = prevState.inputViaList;
      newViaList[idx] = value;
      return {
        inputViaList: newViaList,
      };
    });
    this.props.onChangeTmpViaList(value, idx, isClear);
  };

  onChangeTmpArrival = (value: string, isClear: boolean) => {
    this.setState({ inputArrival: value });
    this.props.onChangeTmpArrival(value, isClear);
  };

  getDiffValues = (): DifferenceValues => {
    let diffValues = {};
    const { expRecord, expPreRecord, isHighlightDiff, isHighlightNewRecord } =
      this.props;
    if (!isHighlightNewRecord && isHighlightDiff && expPreRecord) {
      const diffMapping = {
        'routeInfo.roundTrip': 'routeInfo.roundTrip',
        'routeInfo.origin.name': 'routeInfo.origin.name',
        'routeInfo.arrival.name': 'routeInfo.arrival.name',
      };
      diffValues = convertDifferenceValues(
        diffMapping,
        expRecord,
        expPreRecord
      );
    }
    return diffValues;
  };

  render() {
    const roundTrip = [
      { key: false, value: msg().Exp_Lbl_RouteOptionOneWay },
      { key: true, value: msg().Exp_Lbl_RouteOptionRoundTrip },
    ];
    const useChargedExpress = [
      { key: '0', value: msg().Exp_Lbl_RouteOptionUseChargedExpress_Use },
      { key: '1', value: msg().Exp_Lbl_RouteOptionUseChargedExpress_DoNotUse },
    ];
    const useExReservation = [
      { key: '0', value: msg().Exp_Lbl_RouteOptionUseExReservation_Use },
      { key: '1', value: msg().Exp_Lbl_RouteOptionUseExReservation_NotUse },
    ];
    const routeSort = [
      { key: '0', value: msg().Exp_Lbl_RouteOptionRouteSort_TimeRequired },
      { key: '1', value: msg().Exp_Lbl_RouteOptionRouteSort_Cheap },
      { key: '2', value: msg().Exp_Lbl_RouteOptionRouteSort_NumberOfTransfers },
    ];
    const seatPreference = [
      { key: '0', value: msg().Exp_Lbl_RouteOptionSeatPreference_ReservedSeat },
      { key: '1', value: msg().Exp_Lbl_RouteOptionSeatPreference_FreeSeat },
      { key: '2', value: msg().Exp_Lbl_RouteOptionSeatPreference_GreenSeat },
    ];
    const highwayBus = [
      { key: '0', value: msg().Exp_Lbl_RouteOptionHighWayBusUse },
      { key: '1', value: msg().Exp_Lbl_RouteOptionHighWayBusNotUse },
    ];

    const readOnly =
      this.props.readOnly || !!this.props.routeInfo.selectedRoute;
    const hrClass = classNames(`${ROOT}-hr`, {
      [`${ROOT}-hr--hidden`]: readOnly,
    });
    const searchNameLabelClass = classNames(`${ROOT}-snLabel`, {
      [`${ROOT}-snLabel--hidden`]: readOnly,
    });
    const searchClass = classNames(`${ROOT}-search`, {
      [`${ROOT}-search--hidden`]: readOnly,
    });
    const optionGridClass = classNames(`${ROOT}-option-grid`, {
      [`${ROOT}-option-grid--hidden`]: readOnly,
    });

    const {
      errors,
      touched,
      expPreRecord,
      isHighlightDiff,
      isHighlightNewRecord,
    } = this.props;
    const selectedRouteError = _.get(errors, 'routeInfo.selectedRoute');
    const isSelectedRouteTouched = _.get(touched, 'routeInfo.selectedRoute');
    const diffValues = this.getDiffValues();
    const preChecked = _.get(
      expPreRecord,
      'routeInfo.roundTrip',
      this.props.roundTrip
    );
    const preViaList = _.get(expPreRecord, 'routeInfo.viaList');

    return (
      <div className={ROOT} data-testid={ROOT}>
        <div className={`${ROOT}-trip-type-container`}>
          <div className={`${ROOT}-round-trip`}>
            <Radio
              name="roundTrip"
              items={roundTrip}
              checked={this.props.roundTrip}
              onChange={this.props.onChangeRoundTrip}
              readOnly={this.props.readOnly}
              isHighlightDiff={isHighlightDiff}
              isDifferent={isDifferent('routeInfo.roundTrip', diffValues)}
              isHighlightNewRecord={isHighlightNewRecord}
              preChecked={preChecked}
            />
          </div>
          <div className={`${ROOT}-trip-reversal-container`}>
            <Button
              className={`${ROOT}-item__actions__cancel`}
              data-testid={`${ROOT}-trip-reverse-button`}
              onClick={this.props.onReverseOriginArrival}
              disabled={
                this.props.readOnly || !!this.props.routeInfo.selectedRoute
              }
            >
              {msg().Exp_Lbl_ReverseTrip}
            </Button>
          </div>
        </div>
        <Condition
          title={msg().Exp_Lbl_DepartFrom}
          inputType="origin"
          placeholder={msg().Exp_Lbl_RoutePlaceholder}
          onChange={this.props.onChangeOrigin}
          onChangeTmp={this.onChangeTmpOrigin}
          readOnly={this.props.readOnly || !!this.props.routeInfo.selectedRoute}
          error={this.props.errorOrigin}
          value={this.state.inputOrigin}
          targetDate={this.props.targetDate}
          suggest={this.props.suggest}
          className={classNames({
            'highlight-bg':
              isHighlightNewRecord ||
              isDifferent('routeInfo.origin.name', diffValues),
          })}
        />
        <Via
          onChange={this.props.onChangeViaList}
          onChangeTmp={this.onChangeTmpViaList}
          readOnly={this.props.readOnly || !!this.props.routeInfo.selectedRoute}
          error={this.props.errorViaList}
          tmpViaList={this.state.inputViaList}
          preViaList={preViaList}
          isHighlightDiff={isHighlightDiff}
          targetDate={this.props.targetDate}
          suggest={this.props.suggest}
          withDelete={
            !(this.props.readOnly || !!this.props.routeInfo.selectedRoute)
          }
          onDeleteVia={this.onClickDeleteViaButton}
        />
        <AddViaButton
          onClickAddViaButton={this.onClickAddViaButton}
          readOnly={readOnly}
          tmpViaList={this.props.tmpViaList}
        />

        <Condition
          title={msg().Exp_Lbl_Destination}
          inputType="arrival"
          placeholder={msg().Exp_Lbl_RoutePlaceholder}
          onChange={this.props.onChangeArrival}
          onChangeTmp={this.onChangeTmpArrival}
          readOnly={this.props.readOnly || !!this.props.routeInfo.selectedRoute}
          error={this.props.errorArrival}
          value={this.state.inputArrival}
          targetDate={this.props.targetDate}
          suggest={this.props.suggest}
          className={classNames({
            'highlight-bg':
              isHighlightNewRecord ||
              isDifferent('routeInfo.arrival.name', diffValues),
          })}
        />
        {selectedRouteError && isSelectedRouteTouched && (
          <div className={`${ROOT}-route-selected-error`}>
            {msg()[selectedRouteError]}
          </div>
        )}

        <div className={searchClass}>
          <Button
            type="primary"
            className={`${ROOT}-search-button`}
            data-testid={`${ROOT}-search-button`}
            onClick={this.props.onClickSearchRouteButton}
          >
            {msg().Exp_Btn_RouteSearch}
          </Button>
        </div>
        <hr className={hrClass} />
        <div className={searchNameLabelClass}>
          <IconButton
            className={`${ROOT}-option-grid-toggle-button`}
            data-testid={`${ROOT}-option-grid-toggle-button`}
            src={this.state.isOpen ? btnOpen : btnClose}
            onClick={this.onClickToggleButton}
          />
          {msg().Exp_Lbl_RouteSearchCondition}
        </div>
        {this.state.isOpen && (
          <div>
            <div className={optionGridClass}>
              <div className={`${ROOT}-option-grid-displayOrder`}>
                <RouteOption
                  title={msg().Exp_Lbl_RouteOptionRouteSort}
                  name="routeSort"
                  items={routeSort}
                  checked={this.props.routeSort}
                  onChange={this.props.onChangeRouteSort}
                  readOnly={readOnly}
                />
              </div>
              <div className={`${ROOT}-option-grid-highwayBus`}>
                <RouteOption
                  title={msg().Exp_Lbl_RouteOptionHighWayBus}
                  name="highwayBus"
                  items={highwayBus}
                  checked={this.props.highwayBus}
                  onChange={this.props.onChangeHighwayBus}
                  readOnly={readOnly}
                />
              </div>
            </div>

            <RouteOption
              title={msg().Exp_Lbl_RouteOptionSeatPreference}
              name="seatPreference"
              items={seatPreference}
              checked={this.props.seatPreference}
              onChange={this.props.onChangeSeatPreference}
              readOnly={readOnly}
            />

            {this.props.jorudanUseChargedExpress === '2' ? null : (
              <RouteOption
                title={msg().Exp_Lbl_RouteOptionUseChargedExpress}
                name="useChargedExpress"
                items={useChargedExpress}
                checked={this.props.useChargedExpress}
                onChange={this.props.onChangeUseChargedExpress}
                readOnly={readOnly}
              />
            )}

            <RouteOption
              title={msg().Exp_Lbl_RouteOptionUseExReservation}
              name="useExReservation"
              items={useExReservation}
              checked={this.props.useExReservation}
              onChange={this.props.onChangeUseExReservation}
              readOnly={readOnly}
            />
          </div>
        )}
      </div>
    );
  }
}
