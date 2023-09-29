/**
 * configuration for moment.locale
 * see: http://momentjs.com/docs/#/customization/
 */
// @ts-nocheck
import moment from 'moment';

import 'moment/locale/ja';
import 'moment/locale/en-sg';
import 'moment/locale/vi';

moment.defineLocale('en_US', {
  parentLocale: 'en',
  longDateFormat: {
    L: 'MMM D, YYYY',
    LL: 'MMM D (ddd)',
  },
});

moment.updateLocale('ja', {
  months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  longDateFormat: {
    LL: 'MM/DD(ddd)',
  },
});
