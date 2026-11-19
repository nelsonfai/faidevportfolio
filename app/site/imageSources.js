const APPWRITE_STORAGE_PREFIX = 'https://cloud.appwrite.io/v1/storage/';

export function supportsNextImageOptimization(src) {
  return src.startsWith('/') || src.startsWith(APPWRITE_STORAGE_PREFIX);
}
