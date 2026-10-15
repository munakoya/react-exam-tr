// src/app/App.tsx（URL とページの対応）
import { Navigate, Route, Routes } from "react-router";
import { RootLayout } from "@/app/layouts/RootLayout";
import { NotFoundPage } from "@/pages/not-found";
import { UserDetailPage } from "@/pages/user-detail";
import { UserListPage } from "@/pages/user-list";

export const App = () => (
  <Routes>
    {/* RootLayout（ヘッダー）の <Outlet /> に、URL に合うページが入る */}
    <Route element={<RootLayout />}>
      {/* / に来たらユーザー一覧へ（replace：履歴に / を残さない） */}
      <Route index element={<Navigate to="/users" replace />} />
      <Route path="users" element={<UserListPage />} />
      {/* :userId … URL のこの部分を useParams で受け取れる */}
      <Route path="users/:userId" element={<UserDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
