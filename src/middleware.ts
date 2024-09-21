import {
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
  convexAuthNextjsMiddleware,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware((request) => {
  if (!isPublicPage(request) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
  if (isPublicPage(request) && isAuthenticatedNextjs()) {
    console.log("user is authe");
    return nextjsMiddlewareRedirect(request, "/");
  }
  //TODO: redirect user away from "/auth" if authenticated
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
