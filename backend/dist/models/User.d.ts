import mongoose from 'mongoose';
declare const User: mongoose.Model<{
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
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
        username: string;
        email: string;
        role: "user" | "admin";
        loginAttempts: number;
        password?: string | null | undefined;
        googleId?: string | null | undefined;
        lockUntil?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
        timestamps: true;
    }>> & Omit<{
        username: string;
        email: string;
        role: "user" | "admin";
        loginAttempts: number;
        password?: string | null | undefined;
        googleId?: string | null | undefined;
        lockUntil?: NativeDate | null | undefined;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    username: string;
    email: string;
    role: "user" | "admin";
    loginAttempts: number;
    password?: string | null | undefined;
    googleId?: string | null | undefined;
    lockUntil?: NativeDate | null | undefined;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default User;
//# sourceMappingURL=User.d.ts.map