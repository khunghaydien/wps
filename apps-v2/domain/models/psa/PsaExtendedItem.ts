import Api from '@apps/commons/api';

export type PsaExtendedItem = {
  code: string;
  companyId: string;
  defaultValueText: string;
  description?: string;
  enabled: boolean;
  id: string;
  inputType: string;
  limitLength: number;
  name: string;
  objectType: string;
  order: number;
  picklistLabel?: string;
  picklistValue?: string;
  readOnly: boolean;
  required: boolean;
  categoryType?: string;
};

export type PsaExtendedItemList = Array<PsaExtendedItem>;

export const initialPsaExtendedItemList = [];

export const searchExtendedItem = (
  companyId: string,
  objectType: string
): Promise<PsaExtendedItemList> => {
  return Api.invoke({
    path: '/psa/extended-item/search',
    param: {
      companyId,
      objectType,
    },
  }).then((response) => response.records);
};
