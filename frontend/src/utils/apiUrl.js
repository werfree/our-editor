const IS_PROD_ENV = import.meta.env.MODE === "production";
console.log("IS_PROD_ENVIRONMENT", IS_PROD_ENV, import.meta.env);
const API_URL = IS_PROD_ENV ? `/api/` : import.meta.env.VITE_APP_API_URL;
const WS_URL = IS_PROD_ENV
  ? `ws://${window.location.host}/webSocket`
  : VITE_APP_WS_URL;
const APP_URL = import.meta.env.VITE_APP_URL;

export { API_URL, WS_URL, APP_URL };
