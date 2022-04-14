import { IAddress } from 'src/modules/address/types/address.type';

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
  provice?: IAddress;
  district?: IAddress;
  wards?: IAddress;
  privateHome?: string;
  phoneNumber?: string;
  email?: string;
}

export enum IPaymentStatus {
  Pending = 'pending',
  Success = 'success',
  Rejected = 'rejected',
}

export enum IOrderStatus {
  Pending = 'pending',
  Success = 'success',
  Rejected = 'rejected',
}
