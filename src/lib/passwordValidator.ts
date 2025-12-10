/**
 * Password strength requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 */

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "good" | "strong";
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Special characters: !@#$%^&* (as documented)
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)"
    );
  }

  const isValid = errors.length === 0;

  // Calculate strength
  let strength: "weak" | "fair" | "good" | "strong" = "weak";
  if (isValid) {
    if (password.length >= 12) {
      strength = "strong";
    } else if (password.length >= 10) {
      strength = "good";
    } else {
      strength = "fair";
    }
  }

  return {
    isValid,
    errors,
    strength,
  };
}

export function getPasswordStrengthColor(
  strength: "weak" | "fair" | "good" | "strong"
): string {
  switch (strength) {
    case "weak":
      return "#e74c3c"; // Red
    case "fair":
      return "#f39c12"; // Orange
    case "good":
      return "#3498db"; // Blue
    case "strong":
      return "#27ae60"; // Green
    default:
      return "#95a5a6"; // Gray
  }
}
