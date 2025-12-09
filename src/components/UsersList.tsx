"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/types/user";
import styles from "./UsersList.module.css";

interface UsersListProps {
  onUserAdded: () => void;
}

export default function UsersList({ onUserAdded }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthDate: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      setMessage("✅ Usuaria registrada exitosamente!");
      setFormData({
        name: "",
        surname: "",
        email: "",
        birthDate: "",
        description: "",
      });
      setShowForm(false);
      fetchUsers();
      onUserAdded();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error al registrar usuaria");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando usuarias...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mis Amigas ({users.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          + Añadir Amiga
        </button>
      </div>

      {message && <div className={styles.message}>{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="ej. María"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Apellido *</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                required
                placeholder="ej. García"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="ej. maria@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fecha de Nacimiento *</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Cuéntame algo sobre ti..."
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={submitting}
              className={styles.submitButton}
            >
              {submitting ? "Guardando..." : "Registrar Amiga"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {users.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Fecha de Nacimiento</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.birthDate
                      ? new Date(user.birthDate).toLocaleDateString("es-ES")
                      : "-"}
                  </td>
                  <td className={styles.description}>{user.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No hay amigas registradas aún</p>
          <p className={styles.emptySubtext}>
            Haz clic en "+ Añadir Amiga" para registrar la primera
          </p>
        </div>
      )}
    </div>
  );
}
