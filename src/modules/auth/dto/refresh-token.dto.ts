import { IsString } from "class-validator";


export class RefreshTokenQueryDto {
    /**
     * The refresh token of the user
     * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZDQ4MzYzN'
     */
    @IsString()
    refreshToken: string;

}
