"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieOptionsRefresh = exports.cookieOptionsAccess = void 0;
exports.cookieOptionsAccess = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
};
exports.cookieOptionsRefresh = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
//# sourceMappingURL=cookieOptions.js.map