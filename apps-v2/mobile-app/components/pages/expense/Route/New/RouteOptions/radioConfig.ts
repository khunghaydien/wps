import msg from '../../../../../../../commons/languages';

// needs to be a function so that the japanese localization works.
const initRadioConfig = () => ({
  routeSort: {
    options: [
      {
        label: msg().Exp_Lbl_RouteOptionRouteSort_TimeRequired,
        value: '0',
      },
      {
        label: msg().Exp_Sel_JorudanRouteSortOption1,
        value: '1',
      },
      {
        label: msg().Exp_Sel_JorudanRouteSortOption2,
        value: '2',
      },
    ],
    labels: {
      label: msg().Exp_Lbl_RouteOptionRouteSort,
    },
  },
  highwayBus: {
    options: [
      {
        label: msg().Exp_Sel_JorudanHighwayBusOption0,
        value: '0',
      },
      {
        label: msg().Exp_Sel_JorudanHighwayBusOption1,
        value: '1',
      },
    ],
    labels: {
      label: msg().Exp_Lbl_TransTypeNameHighwayBus,
    },
  },
  seatPreference: {
    options: [
      {
        label: msg().Exp_Sel_JorudanSeatPreferenceOption0,
        value: '0',
      },
      {
        label: msg().Exp_Sel_JorudanSeatPreferenceOption1,
        value: '1',
      },
      {
        label: msg().Exp_Sel_JorudanSeatPreferenceOption2,
        value: '2',
      },
    ],
    labels: {
      label: msg().Exp_Lbl_RouteOptionSeatPreference,
    },
  },
  useChargedExpress: {
    options: [
      {
        label: msg().Exp_Sel_JorudanUseChargedExpressOption0,
        value: '0',
      },
      {
        label: msg().Exp_Sel_JorudanUseChargedExpressOption1,
        value: '1',
      },
    ],
    labels: {
      label: msg().Exp_Lbl_RouteOptionUseChargedExpress,
    },
  },
  useExReservation: {
    options: [
      {
        label: msg().Exp_Lbl_RouteOptionUseExReservation_Use,
        value: '0',
      },
      {
        label: msg().Exp_Lbl_RouteOptionUseExReservation_NotUse,
        value: '1',
      },
    ],
    labels: {
      label: msg().Exp_Lbl_RouteOptionUseExReservation,
    },
  },
});

export default initRadioConfig;
