import React from 'react';

import RouteMap from '../../../../../../../commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteMap';
import msg from '../../../../../../../commons/languages';
import ViewItem from '../../../../../molecules/commons/ViewItem';

import { ExpRequestRecord } from '../../../../../../../domain/models/exp/request/Report';

import JorudanAmountSummary from '../../../../../molecules/expense/JorudanAmountSummary';

import './Route.scss';

const ROOT = 'mobile-app-pages-approval-page-expense-record-route';

export type Props = {
  record: ExpRequestRecord;
  baseCurrencySymbol: string;
};

const ReportRecordRoute = (props: Props) => {
  const { record, baseCurrencySymbol } = props;
  if (!record.routeInfo || !record.routeInfo.selectedRoute) {
    return null;
  }

  return (
    <div className={ROOT}>
      <ViewItem
        label={`${msg().Exp_Lbl_RouteOptionOneWay} / ${
          msg().Exp_Lbl_RouteOptionRoundTrip
        }`}
      >
        {record.routeInfo.roundTrip
          ? msg().Exp_Lbl_RouteOptionRoundTrip
          : msg().Exp_Lbl_RouteOptionOneWay}
      </ViewItem>
      <ViewItem
        className={`${ROOT}__route-map block`}
        label={msg().Com_Lbl_Route}
      >
        <JorudanAmountSummary
          route={record.routeInfo.selectedRoute}
          isRoundTrip={record.routeInfo.roundTrip}
          baseCurrencySymbol={baseCurrencySymbol}
        />
        <RouteMap
          routeInfo={record.routeInfo}
          baseCurrencySymbol={baseCurrencySymbol}
          mobile
        />
      </ViewItem>
    </div>
  );
};

export default ReportRecordRoute;
