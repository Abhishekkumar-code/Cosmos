export function isAdmin(user) {
  return String(user?.role || "").toLowerCase() === "admin";
}

export function getUserHomePath(user) {
  return isAdmin(user) ? "/admin" : "/";
}
