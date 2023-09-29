import * as Yup from 'yup';

const newFinanceDetailDialogFormSchema = (languageSettings) => {
  let nameJpSchema = Yup.string().nullable().max(80, 'Common_Err_Max').trim();
  let nameEnSchema = Yup.string()
    .nullable()
    .required('Common_Err_Required')
    .max(80, 'Common_Err_Max')
    .trim();
  if (languageSettings.language0 === 'ja') {
    nameJpSchema = Yup.string()
      .nullable()
      .required('Common_Err_Required')
      .max(80, 'Common_Err_Max')
      .trim();
    nameEnSchema = Yup.string().nullable().max(80, 'Common_Err_Max').trim();
  }
  return Yup.lazy(() => {
    return Yup.object().shape({
      name: nameEnSchema,
      nameJp: nameJpSchema,
      code: Yup.string()
        .nullable()
        .required('Common_Err_Required')
        .max(80, 'Common_Err_Max')
        .trim(),
    });
  });
};

export default newFinanceDetailDialogFormSchema;
