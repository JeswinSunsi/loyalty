declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    APP_SECRET?: string;
    STAFF_PASSCODE?: string;
  }
}
