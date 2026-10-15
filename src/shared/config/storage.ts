// localStorage に保存するときのキーの接頭辞（アプリ名）
const STORAGE_PREFIX = "user-management";

export const storageKey = (name: string) => `${STORAGE_PREFIX}:${name}`;
