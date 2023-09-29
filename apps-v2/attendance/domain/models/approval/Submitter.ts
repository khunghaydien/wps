export type Submitter = {
  employee: {
    name: string;
    code: string;
    photoUrl: string;
    department: {
      name: string;
    };
  };
  delegator: {
    employee: {
      name: string;
    };
  };
};
