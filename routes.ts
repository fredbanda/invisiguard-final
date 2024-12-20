// Where we define all the routes for our app
/**
 * These are routes that do not require authentication
 * Anyone can visit them to get find more about the app
 * and get a feel for how it works.
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
    "/about",
    "/contact",
]


/**
 * These are routes that are used for authentication
 * Anyone can visit to authenticate and get a session
 * will lead to email verification to have an account authenticated.
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
]

/**
 * These routes are api routes for api authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"


/**
 * These are route IS a redirect route
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"