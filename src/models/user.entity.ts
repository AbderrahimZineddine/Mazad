import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../core/models/abstract-schema";
import { UserRoles } from "../core/enums/user-roles.enum";
import { AccountTypes } from "src/core/enums/account-types.enum";



@KScheam({
    timestamps: true,
})
export class User extends AbstractSchema {
    @Prop()
    name: string;

    @Prop({ select: false })
    password: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop({ default: UserRoles.USER })
    role: UserRoles;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop()
    industries?: string[];

    @Prop({
        select: false, type: {
            regions: { type: [String], default: [] }
        }
    })
    notificationSettings: {
        regions: string[];
    }

    @Prop({ default: AccountTypes.freeTrial })
    accountType: AccountTypes


    @Prop({ default: () => new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000) })
    expiryDate: Date;
}