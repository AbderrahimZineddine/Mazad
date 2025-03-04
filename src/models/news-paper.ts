import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../core/models/abstract-schema";

@KScheam({
    timestamps: true,
})
export class NewsPaper extends AbstractSchema {
    @Prop()
    name: string;

    @Prop()
    imageUri: string;

}