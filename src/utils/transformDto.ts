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

export const transformId = (obj, field: string) => {
  const id = obj[field];
  if (id) return id.toString();
  return undefined;
};
