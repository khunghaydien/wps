# 廃止予定

## 理由
* ./containers/hooks/useWorkCategoryResource.tsで定義されている作業分類の取得処理に不備があることが分かった
  * `await workCategoryList.load(param);`に失敗すると、データストアを完全クリアしてしまう
  * このとき、画面上で他にWorkCategoryDropdownを使用していると、その選択内容の参照先が消失して、エラーが発生する

## 代替方法
* apps/time-tracking/WorkCategoryDropdownは不備を改善したものなので、そちらを使用する

## 廃止までのTODO
* WorkCategoryDropdownDeprecatedを使用している箇所について、WorkCategoryDropdownに置き換えて問題がないか検証する
* 問題が無ければ、置き換えを採用して、こちらを削除する