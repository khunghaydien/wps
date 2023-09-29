import React from 'react';

import moment from 'moment';

import Button from '../../../commons/components/buttons/Button';
import AddViaButton from '../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm/AddViaButton';
// reusable components
import Condition from '../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm/Condition';
import RouteOption from '../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm/RouteOption';
import Via from '../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteForm/Via';
import MultiColumnsGrid from '../../../commons/components/MultiColumnsGrid';
// common components
import msg from '../../../commons/languages';

// prop types
import { StationInfo } from '../../../domain/models/exp/jorudan/Station';

import SuggestContainer from '../../../expenses-pc/containers/Expenses/SuggestContainer';

type Props = {
  // states
  tmpOrigin: string;
  errorOrigin: string;
  tmpViaList: Array<string>;
  errorViaList: Array<string>;
  tmpArrival: string;
  errorArrival: string;
  useChargedExpress: string;
  // event handlers
  onDeleteVia: (arg0: number) => void;
  onClickSearchRouteButton: () => void;
  onChangeUseChargedExpress: (arg0: string) => void;
  onClickAddViaButton: () => void;
  onChangeOrigin: (arg0: StationInfo) => void;
  onChangeTmpOrigin: (arg0: string, arg1: boolean) => void;
  onChangeArrival: (arg0: StationInfo) => void;
  onChangeTmpArrival: (arg0: string, arg1: boolean) => void;
  onChangeViaList: (arg0: StationInfo, arg1: number) => void;
  onChangeTmpViaList: (arg0: string, arg1: number, arg2: boolean) => void;
};

const ROOT = 'commuter-route__form';

const CommuterRouteForm = (props: Props) => {
  const targetDate = moment().format('YYYY-MM-DD');
  const useChargedExpress = [
    { key: '0', value: msg().Exp_Lbl_RouteOptionUseChargedExpress_Use },
    { key: '1', value: msg().Exp_Lbl_RouteOptionUseChargedExpress_DoNotUse },
  ];

  return (
    <div className={ROOT}>
      <MultiColumnsGrid alignments={['top', 'top', 'top']} sizeList={[4, 4, 4]}>
        <Condition
          title={msg().Exp_Lbl_DepartFrom}
          inputType="origin"
          placeholder={msg().Exp_Lbl_RoutePlaceholder}
          onChange={props.onChangeOrigin}
          onChangeTmp={props.onChangeTmpOrigin}
          readOnly={false}
          error={props.errorOrigin}
          value={props.tmpOrigin}
          targetDate={targetDate}
          suggest={SuggestContainer}
        />
        <div className={`${ROOT}__middle-component`}>
          <Via
            onChange={props.onChangeViaList}
            onChangeTmp={props.onChangeTmpViaList}
            readOnly={false}
            error={props.errorViaList}
            tmpViaList={props.tmpViaList}
            targetDate={targetDate}
            suggest={SuggestContainer}
            withDelete
            onDeleteVia={props.onDeleteVia}
          />
          <AddViaButton
            onClickAddViaButton={props.onClickAddViaButton}
            readOnly={false}
            tmpViaList={props.tmpViaList}
          />
          <Button
            className={`${ROOT}__search-button`}
            type="primary"
            onClick={props.onClickSearchRouteButton}
          >
            {msg().Exp_Btn_RouteSearch}
          </Button>
          <RouteOption
            title={msg().Exp_Lbl_RouteOptionUseChargedExpress}
            name="useChargedExpress"
            items={useChargedExpress}
            checked={props.useChargedExpress}
            onChange={props.onChangeUseChargedExpress}
            readOnly={false}
          />
        </div>
        <Condition
          title={msg().Exp_Lbl_Destination}
          inputType="arrival"
          placeholder={msg().Exp_Lbl_RoutePlaceholder}
          onChange={props.onChangeArrival}
          onChangeTmp={props.onChangeTmpArrival}
          readOnly={false}
          error={props.errorArrival}
          value={props.tmpArrival}
          targetDate={targetDate}
          suggest={SuggestContainer}
        />
      </MultiColumnsGrid>
    </div>
  );
};

export default CommuterRouteForm;
