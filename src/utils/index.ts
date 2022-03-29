export * from './buildQueryOption';

export const encodeBase64 = (payload: any): string => {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const decodeBase64 = (code: string): any => {
  return Buffer.from(code, 'base64').toString();
};
