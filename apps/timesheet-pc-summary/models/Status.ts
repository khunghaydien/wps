export type StatusType = {
  Approved: 'Approved';
  Pending: 'Pending';
  NotRequested: 'NotRequested';
};

export type Status = StatusType[keyof StatusType];
