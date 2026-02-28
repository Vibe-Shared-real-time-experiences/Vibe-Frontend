/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;

  readonly VITE_ZEGO_APP_ID: string;
  readonly VITE_ZEGO_SERVER_SECRET: string;
  readonly VITE_REACT_APP_SOCKET_URL: string;
  readonly VITE_SERVER_TOPIC_PREFIX: string;
  readonly VITE_CHANNEL_TOPIC_PREFIX: string;

  readonly VITE_REACT_APP_STORAGE_DOMAIN: string;

  readonly VITE_REACT_APP_STORAGE_BUCKET_NAME: string;


}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}