import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../core/models/abstract-schema";




@KScheam({
    timestamps: true,
})
export class Announcer extends AbstractSchema {
    @Prop()
    name: string;

    @Prop()
    imageUri: string;

    @Prop()
    isStartup: boolean;

}