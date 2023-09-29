import * as CommonStyle from '@apps/core/styles';

export const Color = {
  ...CommonStyle.Color,
  /**
   * Status
   */
  notRequested: CommonStyle.Color.notRequested,

  pending: CommonStyle.Color.pending,

  approved: CommonStyle.Color.approved,

  rejected: CommonStyle.Color.rejected,

  recalled: CommonStyle.Color.rejected,

  canceled: CommonStyle.Color.rejected,
};

export const Font = {
  ...CommonStyle.Font,
};
