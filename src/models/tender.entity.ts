import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../core/models/abstract-schema";
import { Schema } from "mongoose";
import { Announcer } from "./announcer.entity";
import { NewsPaper } from "./news-paper";




@KScheam({
    timestamps: true,
})
export class Tender extends AbstractSchema {
    @Prop()
    title: string;

    @Prop({ type: Schema.Types.ObjectId, ref: Announcer.name })
    announcer: Announcer;

    @Prop()
    publishedDate: Date;

    @Prop()
    closingDate: Date;

    @Prop()
    chargePrice?: number;

    @Prop()
    marketType : string;

    @Prop()
    industry : string;

    @Prop()
    region : string;

    @Prop({
        type: [{
            newsPaper: { type: Schema.Types.ObjectId, ref: NewsPaper.name },
            images: [String]
        }],
        _id: false,
    })
    sources: {
        newsPaper: NewsPaper,
        images: string[],
    }[]

}