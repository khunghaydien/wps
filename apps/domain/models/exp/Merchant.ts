export const MERCHANT_USAGE = Object.freeze({
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
});

export const isUseMerchant = (usage: string) => {
  const useMerchantList: readonly string[] = [
    MERCHANT_USAGE.Optional,
    MERCHANT_USAGE.Required,
  ];
  return useMerchantList.includes(usage);
};
