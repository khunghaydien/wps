import STATUS, { Status } from '../approval/request/Status';

export type Request = Readonly<{
  requestId: string | null | undefined;
  status: Status;
  approvalId: string | null | undefined;
  approverCode: string | null | undefined;
  approverName: string | null | undefined;
  actorId: string | null | undefined;
  actorCode: string | null | undefined;
  actorName: string | null | undefined;
}>;

const defaultRequest: Request = {
  requestId: null,
  status: STATUS.NotRequested,
  approvalId: null,
  approverCode: null,
  approverName: null,
  actorId: null,
  actorCode: null,
  actorName: null,
};
export default defaultRequest;
