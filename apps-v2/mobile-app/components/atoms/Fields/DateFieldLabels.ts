const englishDateFieldLabels = {
  abbreviatedWeekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ],
  placeholder: 'dd/mm/yyyy',
  today: 'Today',
  weekDays: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
};

const japaneseDateFieldLabels = {
  abbreviatedWeekDays: ['日', '月', '火', '水', '木', '金', '土'],
  months: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  placeholder: 'yyyy/mm/dd',
  today: '今日',
  weekDays: ['日', '月', '火', '水', '木', '金', '土'],
};

export default function initDateFieldLabels() {
  if (window.empInfo && window.empInfo.language === 'ja') {
    return japaneseDateFieldLabels;
  } else {
    return englishDateFieldLabels;
  }
}
