import mongoose from 'mongoose';
declare const Wishlist: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
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
        userId: mongoose.Types.ObjectId;
        products: mongoose.Types.DocumentArray<{
            name: string;
            category: string;
            price: number;
            image: string;
            productId: string;
            brand: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name: string;
            category: string;
            price: number;
            image: string;
            productId: string;
            brand: string;
        }, {}, {}> & {
            name: string;
            category: string;
            price: number;
            image: string;
            productId: string;
            brand: string;
        }>;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: true;
    }>> & Omit<{
        userId: mongoose.Types.ObjectId;
        products: mongoose.Types.DocumentArray<{
            name: string;
            category: string;
            price: number;
            image: string;
            productId: string;
            brand: string;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            name: string;
            category: string;
            price: number;
            image: string;
            productId: string;
            brand: string;
        }, {}, {}> & {
            name: string;
            category: string;
            price: number;
            image: string;
            productId: string;
            brand: string;
        }>;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: mongoose.Types.ObjectId;
    products: mongoose.Types.DocumentArray<{
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }, {}, {}> & {
        name: string;
        category: string;
        price: number;
        image: string;
        productId: string;
        brand: string;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Wishlist;
//# sourceMappingURL=Wishlist.d.ts.map