import { Permission as DomainPermissionSet } from '../../../domain/models/access-control/Permission';

export type Permission = DomainPermissionSet & {
  id: string;
  code: string;
  name: string;
  // eslint-disable-next-line camelcase
  name_L0: string;
  // eslint-disable-next-line camelcase
  name_L1: string;
  // eslint-disable-next-line camelcase
  name_L2: string;
  companyId: string;
};
