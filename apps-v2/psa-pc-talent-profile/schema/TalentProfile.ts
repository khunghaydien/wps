import * as Yup from 'yup';

const talentProfileFormSchema = Yup.lazy(() => {
  return Yup.object().shape({
    userLinks: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Common_Err_Required'),
        url: Yup.string()
          .required('Common_Err_Required')
          .test(
            'is-link-valid',
            'Admin_Err_LinkInvalid',
            function checkStatusValidity() {
              const urlRegex =
                /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
              const { parent } = this;

              return urlRegex.test(parent && parent.url);
            }
          ),
      })
    ),
  });
});

export default talentProfileFormSchema;
