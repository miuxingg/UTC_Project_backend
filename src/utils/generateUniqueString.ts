const crypto = require('crypto');

export const generateUniqueString = (): string => {
  const id = crypto.randomBytes(16).toString('hex') + Date.now().toString(36);
  return id;
};
