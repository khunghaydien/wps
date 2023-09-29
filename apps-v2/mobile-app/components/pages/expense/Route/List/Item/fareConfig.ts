import msg from '../../../../../../../commons/languages';

const initFareTypeConfig = () => ({
  options: [
    {
      label: msg().Exp_Lbl_RouteOptionOneWay,
      value: '0',
    },
    {
      label: msg().Exp_Lbl_RouteOptionRoundTrip,
      value: '1',
    },
  ],
  labels: {
    label: msg().Admin_Lbl_JorudanFareType,
  },
});

export default initFareTypeConfig;
