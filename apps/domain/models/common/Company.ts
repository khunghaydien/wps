import Api from '../../../commons/api';

export type Country = {
  name: string;
};

export type Company = {
  id: string;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  code: string;
  countryId: string;
  language: string;
  useAttendance: boolean;
  useWorkTime: boolean;
  useExpense: boolean;
  useCompanyTaxMaster: boolean;
  usePsa: boolean;
  useTimeTrackingChargeTransfer: boolean;
  plannerDefaultView: string;
  country: Country;
};

export type CompanyList = Array<Company>;
export type CompanyResult = { records: CompanyList };

export const initialStateCountry = {
  name: '',
};

export const initialStateConpany = {
  id: '',
  name: '',
  name_L0: '',
  name_L1: '',
  name_L2: '',
  code: '',
  countryId: '',
  language: '',
  useAttendance: false,
  useWorkTime: false,
  useExpense: false,
  usePsa: false,
  useCompanyTaxMaster: false,
  useTimeTrackingChargeTransfer: false,
  plannerDefaultView: '',
  country: initialStateCountry,
};

// search company
export const searchCompanyList = (): Promise<CompanyList> => {
  return Api.invoke({
    path: '/company/search',
  })
    .then((response: CompanyResult) => {
      return response.records;
    })
    .catch((err) => {
      throw err;
    });
};
