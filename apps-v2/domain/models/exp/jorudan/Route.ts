import Api from '../../../../commons/api';

import { Station } from './Station';
// import { type ViaList } from '../Record';

export type SearchRouteParam = {
  arrival: Station;
  empHistoryId?: string;
  empId?: string;
  option: {
    fareType: number;
    routeSort: number;
    seatPreference: number;
    useChargedExpress: number;
    useExReservation: boolean;
  };
  origin: Station;
  roundTrip: boolean;
  targetDate: string;
  //  viaList: ViaList,
  viaList: any;
};

export type Path = {
  airLine: string;
  distance: number;
  expressKey: string;
  fareKey: string;
  fromName: string;
  key: string;
  lineName: string;
  lineType: string;
  requiredTime: number;
  seatCode: string;
  seatList: Array<{
    airLine: string;
    airLineFare: string;
    code: string;
    name: string;
  }>;
  seatName: string;
  toName: string;
  transfer: boolean;
  travelTime: number;
};
export type RouteItemStatus = {
  isCheapest: boolean;
  isEarliest: boolean;
  isMinTransfer: boolean;
};

export type RouteItem = {
  cost: number;
  distance: number;
  existsIcCost: boolean;
  expressMap: {
    fee: number;
    green: number;
    isConnectionDiscount: number;
    key: string;
    roundTripFee: number;
    roundTripGreen: number;
    roundTripSleeping: number;
    season: number;
    sleeping: number;
  };
  fare1?: number;
  fare3?: number;
  fare6?: number;
  fareMap: {
    exceptCommuterRoute: boolean;
    fare: number;
    isIcFare: boolean;
    isRoundDiscount: string;
    key: string;
    roundTripFare: number;
  };
  key: string;
  pathList: Array<Path>;
  pathNumber: number;
  requiredTime: number;
  roundTripCost: number;
  status: RouteItemStatus;
  transferNumber: number;
};

export type RouteList = Array<RouteItem>;

export type Route = {
  commuter: {
    routeList: any;
    routeNumber: number;
  };
  route: {
    routeList: RouteList;
    routeNumber: number;
  };
};

export const initialStateRoute = {
  route: {
    routeNumber: 0,
    routeList: [],
  },
  commuter: {
    routeNumber: 0,
    routeList: [],
  },
};

export const searchRoute = (param: SearchRouteParam): Promise<Route> =>
  Api.invoke({
    path: '/exp/jorudan/route/search',
    param,
  }).then((res) => res.data);

export const isEXReservation = (seatCode: string): boolean =>
  ['ICS', 'ICF', 'ICG'].includes(seatCode);

export const includeEXReservation = (item: RouteItem): boolean =>
  item.pathList.map((p) => isEXReservation(p.seatCode)).includes(true);
