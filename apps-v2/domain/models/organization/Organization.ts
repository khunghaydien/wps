/**
 * The model representing information of Salesforce organization
 */
export type Organization = {
  /**
   * Salesforce Org Id
   */
  id: string;

  /**
   * Indicates whether apps run on sandbox or not
   */
  isSandbox: boolean;

  /**
   * Indicates whether error tracking is enabled or not in the organization
   */
  enableErrorTracking: boolean;
};
