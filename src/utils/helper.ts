export const transformValidationMessage = (
  message: string,
  field?: string,
  constraints: any[] = [],
) => {
  const msgSplit = message.split(':');
  if (msgSplit.length > 1) {
    const params = msgSplit[1].split(',');
    params.forEach((key, idx) => {
      if (constraints[idx]) {
        message = message.replace(key.trim(), constraints[idx]);
      }
    });
  }
  return { message, field };
};
