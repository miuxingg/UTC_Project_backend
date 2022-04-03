export enum DocumentStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export enum BookStatus {
  NONE = '',
  HOT = 'HOT',
  NEW = 'NEW',
}
export interface IIAMUser {
  id: string;
  // username: string;
  // emailVerified: boolean;
  // name?: string;
  // givenName?: string;
  // familyName?: string;
  // email?: string;
}

export enum IPaymentMethod {
  VisaCard = 'VisaCard',
  COD = 'COD',
}

export interface IShippingMethod {
  firstName?: string;
  lastName?: string;
  provice?: string;
  district?: string;
  wards?: string;
  privateHome?: string;
  phoneNumber?: string;
  email?: string;
}

export enum IPaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Rejected = 'rejected',
}
