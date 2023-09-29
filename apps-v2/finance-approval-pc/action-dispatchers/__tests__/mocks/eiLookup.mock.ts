const eiLookupRecords = {
  records: [
    {
      nameL2: 'Custom-8custom option100 L2',
      nameL1: 'Custom-8custom option100 L1',
      nameL0: 'Custom-8custom option100 L0',
      name: 'Custom-8custom option100 L0',
      id: 'a0a2v00000TChrVAAT',
      extendedItemCustomId: 'a0b2v00000OEJF9AAP',
      code: 'Custom-8-Option-100',
    },
  ],
  hasMore: false,
};

export const initMockEIs = () => {
  const totalNum = 10;
  const eIValues = {};
  for (let i = 0; i < totalNum; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemText${index}Id`] = null;
    eIValues[`extendedItemText${index}Value`] = null;
    eIValues[`extendedItemText${index}Info`] = null;
  }
  for (let i = 0; i < totalNum; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemPicklist${index}Id`] = null;
    eIValues[`extendedItemPicklist${index}Value`] = null;
    eIValues[`extendedItemPicklist${index}Info`] = null;
  }
  for (let i = 0; i < totalNum; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemLookup${index}Id`] = null;
    eIValues[`extendedItemLookup${index}Value`] = null;
    eIValues[`extendedItemLookup${index}Info`] = null;
    eIValues[`extendedItemLookup${index}SelectedOptionName`] = null;
  }
  for (let i = 0; i < totalNum; i++) {
    const index = `0${i + 1}`.slice(-2);
    eIValues[`extendedItemDate${index}Id`] = null;
    eIValues[`extendedItemDate${index}Value`] = null;
    eIValues[`extendedItemDate${index}Info`] = null;
  }
  return eIValues;
};

export default eiLookupRecords;
