import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .refine(
    (password) => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);

      return hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
    },
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
    }
  );
