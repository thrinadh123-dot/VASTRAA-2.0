import mongoose from 'mongoose';
declare const Cart: mongoose.Model<{
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        items: mongoose.Types.DocumentArray<{
            product: string;
            quantity: number;
            size?: string | null | undefined;
            color?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            product: string;
            quantity: number;
            size?: string | null | undefined;
            color?: string | null | undefined;
        }, {}, {}> & {
            product: string;
            quantity: number;
            size?: string | null | undefined;
            color?: string | null | undefined;
        }>;
        userId: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: true;
    }>> & Omit<{
        items: mongoose.Types.DocumentArray<{
            product: string;
            quantity: number;
            size?: string | null | undefined;
            color?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            product: string;
            quantity: number;
            size?: string | null | undefined;
            color?: string | null | undefined;
        }, {}, {}> & {
            product: string;
            quantity: number;
            size?: string | null | undefined;
            color?: string | null | undefined;
        }>;
        userId: mongoose.Types.ObjectId;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    items: mongoose.Types.DocumentArray<{
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }, {}, {}> & {
        product: string;
        quantity: number;
        size?: string | null | undefined;
        color?: string | null | undefined;
    }>;
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Cart;
//# sourceMappingURL=Cart.d.ts.map