export const isTeacher = (userId?: string | null) => {
  // TODO: Implement actual DB role check or env var
  // For MVP, we will allow any logged in user to see the Teacher mode to test it.
  // Later we will restrict this to your specific Clerk User ID.
  return true;
}
