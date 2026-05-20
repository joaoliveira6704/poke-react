import { password } from "bun";

/**
 * Compares a plain text password with a hashed password, specifying the algorithm.
 * @param candidatePassword - The plain text password.
 * @param hashedPassword - The hashed password stored in the database.
 * @returns A promise that resolves to true if the passwords match, or false otherwise.
 */
export const verifyPassword = async (
  candidatePassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  // Normalize the hash prefix from $2a$ to $2b$
  const normalizedHash = hashedPassword.startsWith("$2a$")
    ? hashedPassword.replace("$2a$", "$2b$")
    : hashedPassword;

  // Verify the password using Bun.js's password.verify
  const result = await password.verify(
    candidatePassword,
    normalizedHash,
    "bcrypt",
  );
  return result;
};
