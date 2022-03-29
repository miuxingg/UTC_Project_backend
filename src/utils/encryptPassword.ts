import { TransformFnParams } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUNDS } from 'src/configs';

export const encryptPassword = async (param: string) => {
  const data = await bcrypt.hash(param, SALT_OR_ROUNDS);
  return data;
};
