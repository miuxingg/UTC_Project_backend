import { TransformFnParams } from 'class-transformer';

export const transformListIds = (param: TransformFnParams) => {
  const listIds = param.obj;
  if (listIds?.category) {
    const data = listIds.category.map((id) => {
      return String(id);
    });
    return data;
  }
  return [];
};
