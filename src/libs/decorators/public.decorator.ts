import { SetMetadata } from '@nestjs/common';

import { META } from '../constants';

export const Public = (isPublic = true) => SetMetadata(META.PUBLIC, isPublic);
