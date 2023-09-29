import React, { ChangeEvent } from 'react';

import classNames from 'classnames';

import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import {
  Record,
  RECORD_TYPE,
  RecordItem,
} from '@apps/domain/models/exp/Record';

import GridDetailCellGeneral from './GridDetailCellGeneral';
import GridDetailCellICCard from './GridDetailCellICCard';
import GridDetailCellJorudan from './GridDetailCellJorudan';
import GridDetailCellMileage from './GridDetailCellMileage';

type Props = {
  className?: string;
  expMileageUnit?: MileageUnit;
  record: Record;
  recordIdx: number;
  onChangeEditingExpReport: (
    field: string,
    value: string | number | Record | Array<RecordItem>,
    touched?: boolean,
    shouldValidate?: boolean
  ) => void;
};
const GridDetailCell = (props: Props): React.ReactElement => {
  const {
    record,
    recordIdx,
    expMileageUnit,
    onChangeEditingExpReport,
    className,
  } = props;
  const expenseType = record.recordType;
  const detailCellParentClass = `${className}-cell-detail`;

  const targetRecord = `records[${recordIdx}]`;

  const onChangeRemarks = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    const remarksKey = `report.${targetRecord}.items.0.remarks`;
    onChangeEditingExpReport(remarksKey, value, true, true);
  };

  const onChangeJorudanDetail = (key: string, value: any) => {
    const routeInfoKey = `report.${targetRecord}.${key}`;
    onChangeEditingExpReport(routeInfoKey, value, true, true);
  };

  const onChangeMileageDetail = (key: string, value: any) => {
    const mileageInfoKey = `report.${targetRecord}.${key}`;
    onChangeEditingExpReport(mileageInfoKey, value, true, true);
  };

  const isCellDetailGeneral = [
    RECORD_TYPE.General,
    RECORD_TYPE.FixedAllowanceMulti,
    RECORD_TYPE.FixedAllowanceSingle,
  ].includes(expenseType);
  const isCellMileage = expenseType === RECORD_TYPE.Mileage;
  const isCellJorudan = expenseType === RECORD_TYPE.TransitJorudanJP;
  const isCellICCard = expenseType === RECORD_TYPE.TransportICCardJP;
  const uneditableClass = {
    'cursor-default': isCellICCard,
  };

  return (
    <div className={classNames(detailCellParentClass, uneditableClass)}>
      {isCellDetailGeneral && (
        <GridDetailCellGeneral
          record={record}
          className={detailCellParentClass}
          onChangeRemarks={onChangeRemarks}
        />
      )}
      {isCellMileage && (
        <GridDetailCellMileage
          recordIdx={recordIdx}
          record={record}
          className={detailCellParentClass}
          onChangeRemarks={onChangeRemarks}
          onChangeMileageDetail={onChangeMileageDetail}
          mileageUnit={expMileageUnit}
        />
      )}
      {isCellJorudan && (
        <GridDetailCellJorudan
          recordIdx={recordIdx}
          record={record}
          className={detailCellParentClass}
          onChangeRemarks={onChangeRemarks}
          onChangeJorudanDetail={onChangeJorudanDetail}
        />
      )}
      {isCellICCard && (
        <GridDetailCellICCard
          className={detailCellParentClass}
          record={record}
          onChangeRemarks={onChangeRemarks}
        />
      )}
    </div>
  );
};

export default GridDetailCell;
