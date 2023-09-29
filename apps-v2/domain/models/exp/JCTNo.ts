export const JCT_REGISTRATION_NUMBER_USAGE = {
  Optional: 'Optional',
  Required: 'Required',
  NotUsed: 'NotUsed',
};

export const JCT_NUMBER_INVOICE = {
  Invoice: 'Invoice',
  NonInvoice: 'NonInvoice',
  NotRequired: 'NotRequired',
};

export const JCT_NUMBER_INVOICE_MSG_KEY = {
  [JCT_NUMBER_INVOICE.Invoice]: 'Exp_Clbl_JCTInvoice',
  [JCT_NUMBER_INVOICE.NonInvoice]: 'Exp_Clbl_JCTNonInvoice',
  [JCT_NUMBER_INVOICE.NotRequired]: 'Exp_Clbl_JCTNotRequired',
};

export const getOptionsInvoice = (jctRegistrationNumberUsage: string) => {
  switch (jctRegistrationNumberUsage) {
    case JCT_REGISTRATION_NUMBER_USAGE.Required:
      return [JCT_NUMBER_INVOICE.Invoice, JCT_NUMBER_INVOICE.NonInvoice];
    case JCT_REGISTRATION_NUMBER_USAGE.Optional:
      return [...Object.values(JCT_NUMBER_INVOICE)];
    default:
      return [JCT_NUMBER_INVOICE.Invoice];
  }
};

export const isUseJctNo = (usage: string) => {
  return [
    JCT_REGISTRATION_NUMBER_USAGE.Optional,
    JCT_REGISTRATION_NUMBER_USAGE.Required,
  ].includes(usage);
};
