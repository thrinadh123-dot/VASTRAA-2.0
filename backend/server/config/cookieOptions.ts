export const cookieOptionsAccess = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as "strict" | "lax",
    maxAge: 15 * 60 * 1000,
    path: '/',
};

export const cookieOptionsRefresh = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as "strict" | "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
};
