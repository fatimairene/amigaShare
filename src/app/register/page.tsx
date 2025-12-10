"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validatePasswordStrength } from "@/lib/passwordValidator";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "fair" | "good" | "strong" | null
  >(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate password strength when password field changes
    if (name === "password" && value) {
      const validation = validatePasswordStrength(value);
      setPasswordErrors(validation.errors);
      setPasswordStrength(validation.strength);
    } else if (name === "password" && !value) {
      setPasswordErrors([]);
      setPasswordStrength(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate password strength
    const validation = validatePasswordStrength(formData.password);
    if (!validation.isValid) {
      setError("Password does not meet security requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Redirigir a login
      router.push("/login?message=Account created successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            {formData.password && (
              <div className={styles.passwordFeedback}>
                <div
                  className={styles.strengthBar}
                  style={{
                    backgroundColor:
                      passwordStrength === "weak"
                        ? "#e74c3c"
                        : passwordStrength === "fair"
                        ? "#f39c12"
                        : passwordStrength === "good"
                        ? "#3498db"
                        : "#27ae60",
                    width:
                      passwordStrength === "weak"
                        ? "25%"
                        : passwordStrength === "fair"
                        ? "50%"
                        : passwordStrength === "good"
                        ? "75%"
                        : "100%",
                  }}
                />
              </div>
            )}
            {passwordErrors.length > 0 && (
              <div className={styles.passwordErrors}>
                {passwordErrors.map((error, index) => (
                  <p key={index} className={styles.errorItem}>
                    ✗ {error}
                  </p>
                ))}
              </div>
            )}
            {formData.password && passwordErrors.length === 0 && (
              <p className={styles.successMessage}>
                ✓ Password strength: {passwordStrength}
              </p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            {formData.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <p className={styles.successMessage}>✓ Passwords match</p>
              )}
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className={styles.errorMessage}>✗ Passwords do not match</p>
              )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
