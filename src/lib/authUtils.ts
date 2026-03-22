export type UserRole = "STUDENT" | "OWNER" | "ADMIN";

export const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export const PUBLIC_ROUTES = ["/", "/listings"];

export const isAuthRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
};

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some((route) => pathname === route) ||
    pathname.startsWith("/listings");
};

export const getRouteOwner = (
  pathname: string
): UserRole | "COMMON" | null => {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/owner")) return "OWNER";
  if (pathname.startsWith("/student")) return "STUDENT";
  if (
    pathname.startsWith("/my-profile") ||
    pathname.startsWith("/change-password")
  )
    return "COMMON";
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "OWNER":
      return "/owner/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/";
  }
};