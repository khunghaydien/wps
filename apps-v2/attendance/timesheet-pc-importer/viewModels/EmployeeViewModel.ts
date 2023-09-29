/**
 * OwnerInfoViewModel
 *
 * これは ViewModel です。
 * State と Component、それを繋ぐ Container 以外では使用しないでください。
 */

export type EmployeeViewModel = {
  id: string;
  name: string;
  code: string;
  department: {
    name: string;
  };
  delegated: boolean;
};
