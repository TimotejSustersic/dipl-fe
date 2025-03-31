/**
 * public routs with no authentication
 * @type {string[]}
 */
export const publicRoutes = [""];
/**
 * authentication routs that will go to private
 * @type {string[]}
 */

// export const apiAuthPrefix = "/api/auth";

// export const ROUTE_LOGIN = "/login";
// export const ROUTE_REGISTER = "/register";

export const ROUTE_MAPS = "/home/maps";
export const ROUTE_CARS = "/home/cars";

export enum ERoutes {
  Maps = "/maps",
}

// export const authRoutes = [ROUTE_LOGIN, ROUTE_REGISTER];


// export const DEFAULT_LOGED_IN_REDIRECT = ROUTE_TRADING + EBotRoutes.Overview;
// export const DEFAULT_LOGED_OUT_REDIRECT = ROUTE_LOGIN;

export const DEFAULT_REDIRECT = ROUTE_MAPS;

export const getBotRoute = (route: ERoutes) => {
  return `${ROUTE_MAPS}${route}`;
};