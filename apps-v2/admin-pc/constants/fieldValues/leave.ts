const fieldValues = {
  leaveType: [
    {
      label: 'Att_Lbl_Paid',
      value: 'Paid',
    },
    {
      label: 'Att_Lbl_Unpaid',
      value: 'Unpaid',
    },
    {
      label: 'Att_Lbl_AnnualPaidLeave',
      value: 'Annual',
    },
    {
      label: 'Att_Lbl_SubstituteLeave',
      value: 'Substitute',
    }, // FIXME: GENIE-4863
    //    {
    //      label: 'Att_Lbl_Compensatory',
    //      value: 'Compensatory',
    //    },
  ],
  leaveTypeWithChangeToHoliday: [
    {
      label: 'Att_Lbl_Paid',
      value: 'Paid',
    },
    {
      label: 'Att_Lbl_Unpaid',
      value: 'Unpaid',
    },
  ],
  leaveRanges: [
    {
      label: 'Att_Lbl_FullDayLeave',
      value: 'Day',
    },
    {
      label: 'Att_Lbl_AMLeave',
      value: 'AM',
    },
    {
      label: 'Att_Lbl_PMLeave',
      value: 'PM',
    },
    {
      label: 'Att_Lbl_HalfDayLeave',
      value: 'Half',
    },
    {
      label: 'Att_Lbl_HourlyDesignatedLeave',
      value: 'Time',
    },
  ],
  leaveRangesWithChangeToHoliday: [
    {
      label: 'Att_Lbl_FullDayLeave',
      value: 'Day',
    },
  ],
  countType: [
    {
      label: 'Att_Lbl_CountedAsAttendance',
      value: 'Attendance',
    },
    {
      label: 'Att_Lbl_CountedAsAbsence',
      value: 'Absence',
    },
    {
      label: 'Att_Lbl_NotWorkDay',
      value: 'NotWorkDay',
    },
  ],
  availableSex: [
    {
      label: 'Att_Lbl_AllEmployees',
      value: 'All',
    },
    {
      label: 'Att_Lbl_MaleSex',
      value: 'Male',
    },
    {
      label: 'Att_Lbl_FemaleSex',
      value: 'Female',
    },
  ],
};

export default fieldValues;
