import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class Authenticated {
  @Expose() access_token: string;
  @Expose() refresh_token: string;
  @Expose() expires_in: number;
  @Expose() refresh_expires_in: number;
}

@Exclude()
export class ResponseDto {
  @Expose() statusCode: number;
  @Expose() message: string;
  @Expose() field?: string;
}
