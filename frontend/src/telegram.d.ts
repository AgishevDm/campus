// telegram.d.ts
declare global {
    interface Window {
      Telegram: {
        WebApp: {
          ready: () => void;
          initDataUnsafe: {
            user?: {
              id: number;
              username?: string;
              first_name?: string;
              last_name?: string;
            };
          };
        };
      };
    }
  }
  
  export {};