import { TransformFnParams } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/configs';

export const encryptPassword = async (param: string) => {
  const data = await bcrypt.hash(param, SALT_OR_ROUNDS);
  return data;
};

export const comparePassword = async (password: string, current: string) => {
  const isMatch = await bcrypt.compare(current, password);
  return isMatch;
};
