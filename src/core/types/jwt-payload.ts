import { Types } from "mongoose";
import { UserRoles } from "../enums/user-roles.enum";
import { User } from "src/modules/users/schemas/user.schema";


export class JwtPayload {
    id: Types.ObjectId;
    role?: UserRoles;
    isVerified: boolean;
    industries?: string[];

    constructor(user: User) {
        this.id = user._id;
        // this.role = user.role;
        this.isVerified = user.isVerified;
        // this.industries = user.industries;
    }

    // toPlainObject for jwt payload
    toPlainObject() {
        return {
            id: this.id,
            role: this.role,
            isVerified: this.isVerified,
            industries: this.industries,
        }
    }

}