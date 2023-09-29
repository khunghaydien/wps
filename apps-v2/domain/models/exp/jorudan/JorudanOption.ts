import _ from 'lodash';

import Api from '../../../../commons/api';

import { CompanyResult } from '../../common/Company';

export const DEFAULT_ROUTE_OPTIONS = {
  highwayBus: '0',
  routeSort: '0',
  seatPreference: '0',
  useChargedExpress: '0',
  useExReservation: '1',
};

const searchRouteOption = (companyId: string): Promise<CompanyResult> =>
  Api.invoke({
    path: '/company/search',
  }).then((companies: CompanyResult) =>
    _.find(companies.records, { id: companyId })
  );

export default searchRouteOption;
