# ユーザー管理

React 研修修了試験の対策リポジトリ。`munakoya/library` と同じ構成（FSD・MUI）で作ったユーザー管理アプリ。

## アプリ概要

ユーザーを一覧で表示し、登録・編集・削除・選択した複数ユーザーの一括削除ができるアプリ。
データはブラウザの localStorage に保存し、ページを閉じても残る。

| 項目       | 内容                                                                 |
| ---------- | -------------------------------------------------------------------- |
| できること | ユーザーの登録・編集・削除・一括削除、一覧表示、詳細表示             |
| 使う技術   | React・TypeScript・MUI・Zustand・zod・React Hook Form・React Router |
| 保存先     | localStorage（キー：`user-management:users`）                        |

## 要件

- [x] ユーザーを一覧で表示する（**名前・メールアドレスのみ**）
- [x] ユーザーを登録できる
- [x] ユーザーを編集できる（登録と同じモーダルフォームを使い回す）
- [x] ユーザーを削除できる（削除の前に確認する）
- [x] チェックボックスで選択した複数のユーザーをまとめて削除できる
- [x] 詳細ページで全ての情報（名前・年齢・メールアドレス・趣味）を見られる
- [x] 入力チェック（[データ](#データ) の表のとおり）
- [x] 0 件・見つからないときは案内を出す
- [x] データを localStorage に保存する

## 画面と URL

| URL              | 画面                   | 内容                                                                  |
| ---------------- | ---------------------- | --------------------------------------------------------------------- |
| `/`              | —                      | `/users` へ移動                                                       |
| `/users`         | ユーザー一覧           | 表（チェックボックス・名前・メール・編集／削除）・「ユーザーを登録」 |
| `/users/:userId` | ユーザー詳細           | 全項目の表示・編集・削除（削除後は一覧へ）。見つからなければ案内     |
| （ダイアログ）   | ユーザーの登録・編集   | 一覧の「ユーザーを登録」・各行の ✏・詳細の「編集」から開く           |
| （ダイアログ）   | 削除の確認             | 各行の 🗑・詳細の「削除」・「選択した n 件を削除」から開く           |
| それ以外         | ページが見つかりません | トップページへのリンク                                                |

## データ

### ユーザー（User）

定義：[entities/user/model/user.ts](src/entities/user/model/user.ts)・入力チェック：[features/user-form/model/schema.ts](src/features/user-form/model/schema.ts)

| 項目           | 名前        | 型              | 必須 | 入力チェック                            | 備考                         |
| -------------- | ----------- | --------------- | ---- | --------------------------------------- | ---------------------------- |
| ID             | `id`        | `string`        | ○    | —                                       | 登録時に自動で付ける（UUID） |
| 名前           | `name`      | `string`        | ○    | 1〜30文字（前後の空白は除く）           |                              |
| 年齢           | `age`       | `number`        | ○    | 半角数字・0〜150 の整数                 | 入力欄は文字列 → 数値に変換  |
| メールアドレス | `email`     | `string`        | ○    | メールの形式・ほかのユーザーと重複しない |                              |
| 趣味           | `hobby`     | `string`        |      | 100文字以内                             | 未入力は `""`                |
| 登録日時       | `createdAt` | `string`（ISO） | ○    | —                                       | 自動                         |
| 更新日時       | `updatedAt` | `string`（ISO） | ○    | —                                       | 自動                         |

## 操作

| 操作     | どこから                               | 何が起きるか                                        | 実装                                                    |
| -------- | -------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| 登録     | 一覧の「ユーザーを登録」               | ダイアログで入力 → チェック → 一覧の先頭に追加      | [features/user-form](src/features/user-form/)           |
| 編集     | 一覧の各行の ✏・詳細の「編集」         | 今の値が入ったダイアログ → 更新                     | [features/user-form](src/features/user-form/)           |
| 削除     | 一覧の各行の 🗑・詳細の「削除」        | 確認ダイアログ → 消す（詳細からなら一覧へ戻る）     | [features/delete-user](src/features/delete-user/)       |
| 一括削除 | 一覧でチェック → 「選択した n 件を削除」 | 確認ダイアログ → 選んだユーザーをまとめて消す       | [features/delete-user](src/features/delete-user/)       |
| 詳細     | 一覧の名前のリンク                     | `/users/:userId` で全項目を表示                     | [pages/user-detail](src/pages/user-detail/)             |

## フォルダ構成

FSD（Feature-Sliced Design）。**上の層から下の層だけを import する**（`app → pages → widgets → features → entities → shared`）。

```text
src/
├── main.tsx
├── app/                           アプリ全体の設定
│   ├── App.tsx                    URL とページの対応（ルーティング）
│   ├── layouts/RootLayout.tsx     ヘッダー ＋ <Outlet />
│   ├── providers/AppProviders.tsx テーマ・CssBaseline・Router
│   └── styles/theme.ts            MUI のテーマ
├── pages/
│   ├── user-list/                 ユーザー一覧（見出し ＋ 表 ＋ 登録・編集ダイアログ）
│   ├── user-detail/               ユーザー詳細（全項目 ＋ 編集・削除）
│   └── not-found/                 ページが見つかりません
├── widgets/
│   └── user-table/                一覧表（チェックボックスで選択・一括削除・行の編集／削除）
├── features/
│   ├── user-form/                 登録・編集のモーダルフォーム（React Hook Form ＋ zod）
│   │   ├── model/schema.ts        入力チェック（重複チェックつき）とフォームの初期値
│   │   └── ui/UserFormDialog.tsx
│   └── delete-user/               削除ボタン・一括削除ボタン ＋ 確認ダイアログ
├── entities/
│   └── user/                      ユーザーの型（zod）と store（Zustand ＋ persist）
│       ├── model/user.ts
│       └── model/userStore.ts
└── shared/                        業務に関係しない共通のもの
    ├── ui/                        FormTextField・ConfirmDialog・EmptyState
    ├── lib/                       mergeWithSchema・useFormDialog・formatDate
    └── config/                    storageKey（localStorage のキー）
```

## 学習ポイント

- **選択の state は表（widgets）が持つ**：`useState<string[]>` で選んだ id を持つ。行の削除で消えた id は、state を直さずに表示のたびに `filter` で取り除く（計算できる値は保存しない）
- **見出しのチェックボックス**：全部選択なら `checked`、一部なら `indeterminate`
- **一括削除の action**：`removeUsers(ids)` は `filter((user) => !ids.includes(user.id))`
- **年齢は文字列で受け取って数値に**：`refine`（半角数字か）→ `transform(Number)` → `pipe(z.number().min().max())`
- **重複チェック**：スキーマを関数にして、自分以外のメールアドレスを渡す（編集で自分のメールのまま保存できるように）
- **詳細ページ**：`useParams` で id を受け取り、`find` で 1 件選ぶ。見つからないときの表示、削除後は `navigate("/users", { replace: true })`

## 動かし方

```bash
npm install
npm run dev      # 開発サーバー（http://localhost:5173）
npm run build    # 型チェック ＋ 本番用ビルド
npm run lint     # oxlint
```
