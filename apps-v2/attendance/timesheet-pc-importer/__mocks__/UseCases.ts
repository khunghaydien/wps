import { UseCases } from '../UseCases';

export const service: UseCases = {
  fetchUserSetting: jest.fn(),
  fetchRestTimeReasons: jest.fn(),
  fetchRestTimeReasonsForBulk: jest.fn(),
  fetchLeaves: jest.fn(),
  fetchEarlyLeaveReasons: jest.fn(),
  fetchLateArrivalReasons: jest.fn(),
  fetchContractedWorkTimes: jest.fn(),
  saveTimesheet: jest.fn(),
  checkTimesheet: jest.fn(),
};

export default (): UseCases => service;
