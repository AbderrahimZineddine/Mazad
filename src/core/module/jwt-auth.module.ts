import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

const jwtModule = JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '24h' },
})

@Module({})
export class JwtAuthModule {

    static register(): DynamicModule {
        return jwtModule;
    }
}