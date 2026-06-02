// 宣告登入後 session 裡 user 的形狀（nuxt-auth-utils 型別擴充）
// 這樣 useUserSession().user 與 server 端取到的 user 都有型別。

declare module '#auth-utils' {
  interface User {
    id: number;
    email: string;
    name: string;
  }

  interface UserSession {
    // 需要時可在此放額外 session 資料（如登入時間）
  }
}

export {};
