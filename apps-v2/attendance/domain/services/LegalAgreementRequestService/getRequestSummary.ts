import {
  LegalAgreementRequest,
  STATUS,
  Status,
} from '@attendance/domain/models/LegalAgreementRequest';

export const ORDER_OF_STATUS = [
  STATUS.REMOVED,
  STATUS.CANCELED,
  STATUS.REJECTED,
  STATUS.APPROVAL_IN,
  STATUS.APPROVED,
  STATUS.REAPPLYING,
];

export default (requests: LegalAgreementRequest[]): { status: Status } => {
  if (!requests) {
    return null;
  }

  const statuses = requests.map((item) => item.status);

  const status =
    ORDER_OF_STATUS.find((key) => statuses.includes(key)) ||
    STATUS.NOT_REQUESTED;

  return {
    status,
  };
};
