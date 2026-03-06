import mongoose from 'mongoose';
declare const Product: mongoose.Model<{
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
    } & mongoose.DefaultTimestampProps>;
} & mongoose.DefaultTimestampProps & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        _id: string;
        name: string;
        description: string;
        rating: number;
        category: "Men" | "Women" | "Kids";
        price: number;
        sizes: string[];
        stock: number;
        images: string[];
        isActive: boolean;
        reviews: mongoose.Types.DocumentArray<{
            comment: string;
            name: string;
            user: mongoose.Types.ObjectId;
            rating: number;
        } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            comment: string;
            name: string;
            user: mongoose.Types.ObjectId;
            rating: number;
        } & mongoose.DefaultTimestampProps, {}, {}> & {
            comment: string;
            name: string;
            user: mongoose.Types.ObjectId;
            rating: number;
        } & mongoose.DefaultTimestampProps>;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: true;
    }>> & Omit<{
        _id: string;
        name: string;
        description: string;
        rating: number;
        category: "Men" | "Women" | "Kids";
        price: number;
        sizes: string[];
        stock: number;
        images: string[];
        isActive: boolean;
        reviews: mongoose.Types.DocumentArray<{
            comment: string;
            name: string;
            user: mongoose.Types.ObjectId;
            rating: number;
        } & mongoose.DefaultTimestampProps, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            comment: string;
            name: string;
            user: mongoose.Types.ObjectId;
            rating: number;
        } & mongoose.DefaultTimestampProps, {}, {}> & {
            comment: string;
            name: string;
            user: mongoose.Types.ObjectId;
            rating: number;
        } & mongoose.DefaultTimestampProps>;
    } & mongoose.DefaultTimestampProps & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & Required<{
    _id: string;
}> & {
    __v: number;
}>, {
    _id: string;
    name: string;
    description: string;
    rating: number;
    category: "Men" | "Women" | "Kids";
    price: number;
    sizes: string[];
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: mongoose.Types.DocumentArray<{
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }, {}, {}> & {
        comment: string;
        name: string;
        user: mongoose.Types.ObjectId;
        rating: number;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & Required<{
    _id: string;
}> & {
    __v: number;
}>;
export default Product;
//# sourceMappingURL=Product.d.ts.map