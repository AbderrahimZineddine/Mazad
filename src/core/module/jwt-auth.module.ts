/* eslint-disable prettier/prettier */
import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class JwtAuthModule {
  static register(): DynamicModule {
    return JwtModule.registerAsync({
      global: true, // Note: global is set here, outside useFactory!
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    });
  }
}
