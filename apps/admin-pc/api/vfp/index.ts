// @ts-nocheck
import Common from '../../../commons/api/vfp/index';

import AdminCommon from './AdminCommon';

export default class Admin {
  constructor(remoting) {
    this.common = new Common(remoting);
    this.adminCommon = new AdminCommon(remoting);
  }
}
