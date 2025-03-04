import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CryptHelper } from 'src/core/helpers/crypt.helper';
import { AuthToken } from 'src/core/types/auth-token';
import { JwtPayload } from 'src/core/types/jwt-payload';
import { AccountVerificationOtp, RefreshToken, RestPasswordOtp } from 'src/models/auth.entity';
import { v4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshToken>,
        @InjectModel(RestPasswordOtp.name) private restPasswordOtpModel: Model<RestPasswordOtp>,
        @InjectModel(AccountVerificationOtp.name) private accountVerificationOtpModel: Model<AccountVerificationOtp>,
        private jwtService: JwtService

    ) { }

    private DEFFAULT_SELECT = 'password role isVerified';

    register = async (
        data: { region: string, phone: string, password?: string, name: string },
    ) => {

        const { region, phone, password: nonHashedPass, name } = data;

        const isLoginExist = await this.userModel
            .exists({ phone });

        if (isLoginExist) {
            throw new HttpException('This phone number is already registered', 400);
        }

        const password = nonHashedPass ? await CryptHelper.hash(nonHashedPass) : undefined;

        const user = await this.userModel.create({ region, phone, password, name });

        await this.generateAccountVerificationOtp(user);

        return this.generateToken(user);
    }

    login = async (data: {
        login: string,
        password?: string
    },
        options?: {
            withoutPassword?: boolean
        }
    ) => {
        const { login, password } = data;
        const { withoutPassword } = options || {};

        const user = await this.userModel.findOne({
            $or: [{ email: login }, { phone: login }]
        }).select(this.DEFFAULT_SELECT);

        if (!user) {
            throw new HttpException('This email or phone number is not registered', 404);
        }

        const isPasswordMatch = password &&
            await CryptHelper.compare(password, user.password);

        if (withoutPassword || isPasswordMatch) return this.generateToken(user);

        throw new HttpException('Password is incorrect', 400);


    }

    refreshToken = async (refreshToken: string) => {
        const token = await this.refreshTokenModel.
            findOne({ token: refreshToken, expires: { $gte: new Date() } })
            .populate({
                path: 'user',
                select: this.DEFFAULT_SELECT
            });

        if (!token) {
            throw new HttpException('Invalid refresh token', 400);
        }

        return this.generateToken(token.user);

    }

    forgotPassword = async (login: string) => {
        const user = await this.userModel.findOne({
            $or: [{ email: login }, { phone: login }]
        });

        if (!user) {
            throw new HttpException('This email or phone number is not registered', 404);
        }

        const otp = await this.generateRestPasswordOtp(user);

        //TODO: Send OTP to user email or phone number
    }

    resetPassword = async (login: string, otp: number, password: string) => {
        const user = await this.userModel.findOne({
            $or: [{ email: login }, { phone: login }]
        }).select(this.DEFFAULT_SELECT);

        if (!user) {
            throw new HttpException('This email or phone number is not registered', 404);
        }

        const token = await this.verifyRestPasswordOtp(user, otp);



        user.password = await CryptHelper.hash(password);
        await Promise.all([user.save(), token.deleteOne()]);

        return this.generateToken(user);
    }

    verifyAccount = async (id: Types.ObjectId, otp: number) => {
        const token = await this.verifyAccountOtp(id, otp);


        await token.deleteOne();


        const user = await this.userModel.findByIdAndUpdate(id, { isVerified: true }, { new: true })
            .select(this.DEFFAULT_SELECT);

        if (!user) {
            throw new HttpException('User not found', 404);
        }

        return this.generateToken(user);
    }

    private async generateToken(user: User): Promise<AuthToken> {
        const payload = (new JwtPayload(user)).toPlainObject()

        const accessToken = this.jwtService.sign(payload)
        const refreshToken = v4()
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)

        await this.refreshTokenModel.create(
            { token: refreshToken, expires, user },
        )

        return { accessToken, refreshToken }
    }

    private async generateRestPasswordOtp(user: User): Promise<number> {
        const otp = Math.floor(100000 + Math.random() * 900000)

        const expires = new Date(Date.now() + 1000 * 60 * 5)

        await this.restPasswordOtpModel.create(
            { otp, expires, user },
        )

        return otp
    }

    async verifyRestPasswordOtp(user: User | string, otp: number) {
        if (typeof user === 'string') {
            user = await this.userModel.findOne({
                $or: [{ email: user }, { phone: user }]
            }).select(this.DEFFAULT_SELECT);
        }

        const token = await this.restPasswordOtpModel.
            findOne({ otp, user, expires: { $gte: new Date() } })

        if (!token)
            throw new HttpException('Invalid code', 400)

        return token

    }

    private async verifyAccountOtp(user: User | Types.ObjectId, otp: number) {
        const token = await this.accountVerificationOtpModel.
            findOne({ otp, user, expires: { $gte: new Date() } })

        if (!token) throw new HttpException('Invalid code', 400)

        return token
    }

    async generateAccountVerificationOtp(user: User | Types.ObjectId): Promise<number> {
        const otp = Math.floor(100000 + Math.random() * 900000)

        const expires = new Date(Date.now() + 1000 * 60 * 5)

        await this.accountVerificationOtpModel.create(
            { otp, expires, user },
        )

        // TODO: Send OTP to user email or phone number

        return otp
    }









}


