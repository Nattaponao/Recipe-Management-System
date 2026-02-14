export function isAdminEmail(email?: string | null) {
  if (!email) return false;

  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(e => e.trim().toLowerCase());

  return admins.includes(email.toLowerCase());
}
