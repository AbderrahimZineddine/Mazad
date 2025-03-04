import { Schema as KScheam, Prop } from "@nestjs/mongoose";
import { AbstractSchema } from "../core/models/abstract-schema";
import { Schema } from "mongoose";
import { NewsPaper } from "./news-paper";
import { Tender } from "./tender.entity";




@KScheam({
    timestamps: true,
})
export class TenderResult extends AbstractSchema {
    @Prop()
    title: string;

    @Prop()
    publishedDate: Date;

    @Prop()
    type : string;

    @Prop()
    region : string;

    @Prop({ type: Schema.Types.ObjectId, ref: Tender.name })
    tender: Tender;

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