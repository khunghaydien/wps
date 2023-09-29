import { Permission } from '../../../domain/models/access-control/Permission';

export type MenuItem = {
  name: string;
  key: string;
  objectName?: string;
  childMenuList?: MenuItem[];

  /** 機能利用に必要な権限：未設定であれば、チェック不要で利用を許可する */
  requiredPermission?: (keyof Permission)[];

  objectValue?: any;

  isInitialDisplay?: boolean;
};

export type MenuGroup = {
  name: string;
  menuList: MenuItem[];

  /** 機能利用に必要な権限：未設定であれば、チェック不要で利用を許可する */
  requiredPermission?: (keyof Permission)[];

  objectName?: string;
  objectValue?: any;

  isInitialDisplay?: boolean;
};

export type MenuSetting = MenuGroup[];
