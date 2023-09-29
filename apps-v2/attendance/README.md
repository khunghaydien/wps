# package.json の問題

当初は attendance 配下に package.json を置いていたが、
テストで root の package.json ではなく `attendance/node_modules/react-datepicker` の `date-fns` が使われてしまう問題があったため移動した。
もともとパッケージとして大きすぎたので今後は以下のように修正した後で削除したい。

※ prefix について

Level-1: ドメイン領域を区切る

- general: 汎用（ドメイン外）
- vendor: 外部
- core: ドメイン
- sub: サブドメイン

Level-2: 関心毎で区切る

- entity: エンティティ
- useCase: ユースケース
- repository: レポジトリ
  - sf
- ui: 画面依存
- ui-page: 実際の画面

## 汎用系

- @attendance/general
  - 汎用的なもの。どのパッケージにも依存しない。
  - フォルダ構成
    - Event
    - compare.ts
    - Collection.ts
    - FirstSerialProcessExecutor.ts

## 外部系

- @attendance/vendor
  - 勤怠ドメイン以外に依存する共通部品。
    - AccessControlService.ts

## コアドメインパッケージ

- @attendance/core-entity
  - どのパッケージにも依存しない。
  - フォルダ構成
    - models/
    - services/
    - utilities/
      - Records
- @attendance/core-useCase-interfaces
  - 依存パッケージ
    - @attendance/core-entity
  - フォルダ構成
    - combined/
    - primitive/
- @attendance/core-useCase-utilities
  - 依存パッケージ
    - @attendance/utilities
  - フォルダ構成
    - useCaseFactory.ts
    - useCaseCollection.ts
- @attendance/core-useCase-interactors
  - 依存パッケージ
    - @attendance/general
    - @attendance/core-entity
    - @attendance/core-useCase-interfaces
    - @attendance/core-useCase-utilities
  - フォルダ構成
    - src
      - combined/
      - primitive/
- @attendance/core-repository-sf-models
  - 依存パッケージ
    - @attendance/core-entity
- @attendance/core-repository-sf-interactors
  - repositories だけを捨てられるように実態は別パッケージにしておく。
  - 依存パッケージ
    - @attendance/core-entity
    - @attendance/core-repository-sf-models
- @attendance/core-ui-common
  - 画面の共通部品で React など外部パッケージに依存するものが多いので別パッケージにしておく。
  - フォルダ構成
    - src
      - types

## サブドメインパッケージ

- @attendance/sub-approval
  - 依存パッケージ
    - @attendance/general
    - @attendance/core-entity
    - @attendance/core-useCase-utilities
    - @attendance/core-repository-sf-models
- @attendance/sub-importer
  - 依存パッケージ
    - @attendance/general
    - @attendance/core-entity
    - @attendance/core-useCase-interface
    - @attendance/core-useCase-utilities
    - @attendance/core-repository-sf-models

## 画面パッケージ（実装の実態）

- @attendance/core-ui-page-timesheet-pc など
  - 依存パッケージ
    - @attendance/general
    - @attendance/vendor
    - @attendance/core-entity
    - @attendance/core-useCase-interface
    - @attendance/core-useCase-utilities
    - @attendance/core-useCase-interactors
    - @attendance/core-repository-sf-interactors
    - @attendance/core-ui-common
- @attendance/sub-importer-ui-page-timesheet-pc-importer
  - 依存パッケージ
    - @attendance/general
    - @attendance/vendor
    - @attendance/sub-importer

## 別ドメインパッケージ

- approval
  - 依存パッケージ
    - @attendance/sub-approval

# 今後のディレクトリ

- packages
  - general
    - utilities
  - vendor
    - utilities
  - core
    - entity
    - useCase
      - interface
      - utilities
      - interactors
    - repository
      - sf
        - models
        - interactors
    - ui
      - common
      - page
        - timesheet-pc ...
  - sub
    - approval
      - entity
    - importer
      - entity
      - useCase
      - repository
      - ui
        - page
          - timesheet-importer

2023-01-27 naito.kaoru@teamspirit.com
