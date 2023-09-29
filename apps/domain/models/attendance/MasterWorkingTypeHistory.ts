import { JPDiscretion } from './MasterWorkingTypeHistory/WorkSystem/JPDiscretion';
import { JPFix } from './MasterWorkingTypeHistory/WorkSystem/JPFix';
import { JPFlex } from './MasterWorkingTypeHistory/WorkSystem/JPFlex';
import { JPManager } from './MasterWorkingTypeHistory/WorkSystem/JPManager';
import { JPModified } from './MasterWorkingTypeHistory/WorkSystem/JPModified';

export type MasterWorkingTypeHistory =
  | JPDiscretion
  | JPFix
  | JPFlex
  | JPManager
  | JPModified;
