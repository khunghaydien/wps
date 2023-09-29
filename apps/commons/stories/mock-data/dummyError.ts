import BaseWSPError from '../../errors/BaseWSPError';

export default new BaseWSPError(
  'データ不正エラー',
  '勤務体系が設定されていないため、勤務表を表示できませんでした',
  'システム管理者にお問い合わせください',
  undefined,
  undefined
);
