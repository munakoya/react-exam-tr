// entities/user の窓口（Public API）
//
// 外（features・widgets・pages）からは、このファイル経由で読み込む。
//   import { useUserStore, type User } from "@/entities/user";
export { userSchema, type User, type UserInput } from "./model/user";
export { useUserStore } from "./model/userStore";
