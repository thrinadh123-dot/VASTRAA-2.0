import mongoose from 'mongoose';
declare const Order: mongoose.Model<{
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
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
        user: mongoose.Types.ObjectId;
        items: mongoose.Types.DocumentArray<{
            size: string;
            product: string;
            quantity: number;
            priceAtPurchase: number;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            size: string;
            product: string;
            quantity: number;
            priceAtPurchase: number;
        }, {}, {}> & {
            size: string;
            product: string;
            quantity: number;
            priceAtPurchase: number;
        }>;
        paymentMethod: string;
        itemsPrice: number;
        shippingPrice: number;
        taxPrice: number;
        totalAmount: number;
        paymentStatus: "Pending" | "Paid";
        deliveryStatus: "Pending" | "Shipped" | "Delivered";
        razorpayOrderId?: string | null | undefined;
        razorpayPaymentId?: string | null | undefined;
        razorpaySignature?: string | null | undefined;
        paidAt?: NativeDate | null | undefined;
        transactionId?: string | null | undefined;
        shippingAddress?: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        } | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: true;
    }>> & Omit<{
        user: mongoose.Types.ObjectId;
        items: mongoose.Types.DocumentArray<{
            size: string;
            product: string;
            quantity: number;
            priceAtPurchase: number;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
            size: string;
            product: string;
            quantity: number;
            priceAtPurchase: number;
        }, {}, {}> & {
            size: string;
            product: string;
            quantity: number;
            priceAtPurchase: number;
        }>;
        paymentMethod: string;
        itemsPrice: number;
        shippingPrice: number;
        taxPrice: number;
        totalAmount: number;
        paymentStatus: "Pending" | "Paid";
        deliveryStatus: "Pending" | "Shipped" | "Delivered";
        razorpayOrderId?: string | null | undefined;
        razorpayPaymentId?: string | null | undefined;
        razorpaySignature?: string | null | undefined;
        paidAt?: NativeDate | null | undefined;
        transactionId?: string | null | undefined;
        shippingAddress?: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        } | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: mongoose.Types.ObjectId;
    items: mongoose.Types.DocumentArray<{
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }, {}, {}> & {
        size: string;
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }>;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    paymentStatus: "Pending" | "Paid";
    deliveryStatus: "Pending" | "Shipped" | "Delivered";
    razorpayOrderId?: string | null | undefined;
    razorpayPaymentId?: string | null | undefined;
    razorpaySignature?: string | null | undefined;
    paidAt?: NativeDate | null | undefined;
    transactionId?: string | null | undefined;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    } | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default Order;
//# sourceMappingURL=Order.d.ts.map