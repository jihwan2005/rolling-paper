import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("common/page/home-page.tsx"),
  ...prefix("/rolling-paper", [
    route("/join", "features/rollingpaper/pages/rollingpaper-join-page.tsx"),
    route(
      "/create",
      "features/rollingpaper/pages/rollingpaper-create-page.tsx"
    ),
    route("/my", "features/rollingpaper/pages/my-rollingpapers-page.tsx"),
    route(
      "/see-notification",
      "features/rollingpaper/pages/action/see-notification-page.tsx"
    ),
    route(":joinCode", "features/rollingpaper/pages/rollingpaper-page.tsx"),
    route(
      ":joinCode/my",
      "features/rollingpaper/pages/my-rollingpaper-page.tsx"
    ),
    route(
      ":joinCode/send",
      "features/rollingpaper/pages/action/rollingpaper-send-page.tsx"
    ),
  ]),
  ...prefix("/auth", [
    route("/login", "features/auth/login-page.tsx"),
    route("/join", "features/auth/join-page.tsx"),

    route("/logout", "features/auth/logout-page.tsx"),
  ]),
] satisfies RouteConfig;
