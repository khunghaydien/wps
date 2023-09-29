import {
  DynamicTestConditions,
  Permission,
  TotalTestConditions,
} from '@apps/domain/models/access-control/Permission';

type Rest<A, B extends Partial<A>> = {
  [K in Exclude<keyof A, keyof B>]?: A[K];
};

export type Props = Rest<
  TotalTestConditions,
  { userPermission: Permission; isByDelegate: boolean }
> & {
  conditions?: DynamicTestConditions;
  children: React.ReactNode;
};

export type IAccessControlContainer = React.FC<Props>;
