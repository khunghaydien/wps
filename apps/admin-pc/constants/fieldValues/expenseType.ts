import { FOREIGN_CURRENCY_USAGE } from '../../../domain/models/exp/foreign-currency/Currency';

const fieldValues = {
  recordType: [
    {
      label: 'Exp_Sel_GeneralExpense',
      value: 'General',
    },
    {
      label: 'Exp_Sel_FixedAmount',
      value: 'FixedAllowanceSingle',
    },
    {
      label: 'Exp_Sel_FixedAmount_Mul',
      value: 'FixedAllowanceMulti',
    },
    {
      label: 'Exp_Sel_TransitJorudanJP',
      value: 'TransitJorudanJP',
    },
    {
      label: 'Exp_Sel_IC_CARD_JP',
      value: 'TransportICCardJP',
    },
    {
      label: 'Exp_Sel_HotelFee',
      value: 'HotelFee',
    },
  ],
  recordTypeWithoutTransitJP: [
    {
      label: 'Exp_Sel_GeneralExpense',
      value: 'General',
    },
    {
      label: 'Exp_Sel_FixedAmount',
      value: 'FixedAllowanceSingle',
    },
    {
      label: 'Exp_Sel_FixedAmount_Mul',
      value: 'FixedAllowanceMulti',
    },
    {
      label: 'Exp_Sel_HotelFee',
      value: 'HotelFee',
    },
  ],
  recordTypeWithoutTransitIC: [
    {
      label: 'Exp_Sel_GeneralExpense',
      value: 'General',
    },
    {
      label: 'Exp_Sel_FixedAmount',
      value: 'FixedAllowanceSingle',
    },
    {
      label: 'Exp_Sel_FixedAmount_Mul',
      value: 'FixedAllowanceMulti',
    },
    {
      label: 'Exp_Sel_TransitJorudanJP',
      value: 'TransitJorudanJP',
    },
    {
      label: 'Exp_Sel_HotelFee',
      value: 'HotelFee',
    },
  ],
  foreignCurrencyUsage: [
    {
      label: 'Exp_Sel_ForeginCurrency_NotUsed',
      value: FOREIGN_CURRENCY_USAGE.NotUsed,
    },
    {
      label: 'Exp_Sel_ForeginCurrency_Fixed',
      value: FOREIGN_CURRENCY_USAGE.Fixed,
    },
    {
      label: 'Exp_Sel_ForeginCurrency_Flexible',
      value: FOREIGN_CURRENCY_USAGE.Flexible,
    },
  ],
  fileAttachment: [
    {
      label: 'Exp_Sel_ReceiptType_Optional',
      value: 'Optional',
    },
    {
      label: 'Exp_Sel_ReceiptType_Required',
      value: 'Required',
    },
    {
      label: 'Exp_Sel_ReceiptType_NotUsed',
      value: 'NotUsed',
    },
  ],
};

export default fieldValues;
