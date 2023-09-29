import * as Yup from 'yup';

export default Yup.object().shape({
  targetDate: Yup.string().required('Common_Err_Required'),
  expenseTypeId: Yup.string().required('Common_Err_Required'),
  origin: Yup.object().shape({
    name: Yup.string().required('Common_Err_Required'),
  }),
  arrival: Yup.object().shape({
    name: Yup.string().required('Common_Err_Required'),
  }),
});
