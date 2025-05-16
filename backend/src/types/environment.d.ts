declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRE?: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRE?: string;
    JWT_COOKIE_EXPIRE?: string;
    EMAIL_HOST?: string;
    EMAIL_PORT?: string;
    EMAIL_USERNAME?: string;
    EMAIL_PASSWORD?: string;
    EMAIL_FROM_NAME?: string;
    EMAIL_FROM_EMAIL?: string;
    EMAIL_SECURE?: string;
    FRONTEND_URL: string;
    CORS_ORIGIN?: string;
    LOG_LEVEL?: string;
  }
}