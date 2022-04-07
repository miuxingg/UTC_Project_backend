import { getEnv } from 'src/utils/getEnv';

export const STRIPE_SECRET_KEY = getEnv(
  'STRIPE_SECRET_KEY',
  'sk_test_51KlDUpDhimSV3G3M2v87aSAcuMst9gh1oJrh77sIp8hvh4PH12iJNPZI2WhqXp3Y5vukVS5PZxPXGImeC2aIlxTH00HiO2uWom',
);
