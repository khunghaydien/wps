// @ts-nocheck
import Common from '../../../commons/api/local/index';

import AdminCommon from './AdminCommon';

export default class Admin {
  constructor() {
    this.common = new Common();
    this.adminCommon = new AdminCommon();
  }
}
