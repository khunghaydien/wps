import { ILegalAgreementRequestRepository } from '@attendance/domain/models/LegalAgreementRequest';

export default {
  fetchList: jest.fn(),
  fetchOverTime: jest.fn(),
  submit: jest.fn(),
  cancelRequest: jest.fn(),
  cancelApproval: jest.fn(),
  remove: jest.fn(),
  reapply: jest.fn(),
} as ILegalAgreementRequestRepository;
