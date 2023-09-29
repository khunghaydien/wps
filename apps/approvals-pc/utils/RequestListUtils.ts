/**
 * 承認 / 却下後に選択状態になるべき申請のIDを返却する
 * @param {array} requestIdList
 * @param {array} allIds
 */
export const getNextId = (
  requestIdList: string[],
  allIds: string[],
  isBulkApprove?: boolean
): string | null => {
  const restRequestIds = allIds.filter((id) => !requestIdList.includes(id));

  // Bulk Approval
  if (isBulkApprove) {
    return restRequestIds[0] || null;
  }

  // 複数選択時はリストの最初の申請を表示する
  if (requestIdList.length > 1) {
    return restRequestIds[0] || null;
  }

  // 1件のみの場合は、次の申請を表示する
  const currentIndex = allIds.indexOf(requestIdList[0]);
  return (
    restRequestIds[Math.min(currentIndex, restRequestIds.length - 1)] || null
  );
};

export default {
  getNextId,
};
