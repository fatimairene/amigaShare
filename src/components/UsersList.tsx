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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      const sortedUsers = sortByUpcomingBirthday(data.data || []);
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortByUpcomingBirthday = (usersList: User[]) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    return usersList.sort((a, b) => {
      if (!a.birthDate || !b.birthDate) return 0;

      const aDate = new Date(a.birthDate);
      const bDate = new Date(b.birthDate);

      // Crear fechas de cumpleaños para este año
      let aThisYear = new Date(currentYear, aDate.getMonth(), aDate.getDate());
      let bThisYear = new Date(currentYear, bDate.getMonth(), bDate.getDate());

      // Si el cumpleaños ya pasó, usar el próximo año
      if (aThisYear < today) {
        aThisYear = new Date(
          currentYear + 1,
          aDate.getMonth(),
          aDate.getDate()
        );
      }
      if (bThisYear < today) {
        bThisYear = new Date(
          currentYear + 1,
          bDate.getMonth(),
          bDate.getDate()
        );
      }

      return aThisYear.getTime() - bThisYear.getTime();
    });
  };

  const calculateDaysUntilBirthday = (birthDate: Date) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    // Crear la fecha de cumpleaños para este año
    let birthdayThisYear = new Date(
      currentYear,
      birthDate.getMonth(),
      birthDate.getDate()
    );

    // Si el cumpleaños ya pasó, usar el próximo año
    if (birthdayThisYear < today) {
      birthdayThisYear = new Date(
        currentYear + 1,
        birthDate.getMonth(),
        birthDate.getDate()
      );
    }

    // Calcular la diferencia en días
    const timeDifference = birthdayThisYear.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
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
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { _id: editingId, ...formData } : formData;

      const response = await fetch("/api/users", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          editingId ? "Failed to update user" : "Failed to register user"
        );
      }

      setMessage(
        editingId
          ? "✅ Usuaria actualizada exitosamente!"
          : "✅ Usuaria registrada exitosamente!"
      );
      setFormData({
        name: "",
        surname: "",
        email: "",
        birthDate: "",
        description: "",
      });
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
      onUserAdded();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        editingId
          ? "❌ Error al actualizar usuaria"
          : "❌ Error al registrar usuaria"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setFormData({
      name: user.name,
      surname: user.surname,
      email: user.email,
      birthDate: user.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : "",
      description: user.description || "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      surname: "",
      email: "",
      birthDate: "",
      description: "",
    });
  };

  const handleDeleteClick = (userId: string) => {
    setDeletingId(userId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      setSubmitting(true);
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: deletingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setMessage("✅ Usuaria eliminada exitosamente!");
      setDeletingId(null);
      fetchUsers();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error al eliminar usuaria");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Friends ({users.length})</h2>
        <button
          onClick={() => {
            if (editingId) handleCancel();
            setShowForm(!showForm);
          }}
          className={styles.addButton}
        >
          {editingId ? "✕ Cancel Edit" : "+ Add Friend"}
        </button>
      </div>

      {message && <div className={styles.message}>{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>First Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Maria"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Last Name *</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                required
                placeholder="e.g. Garcia"
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
                placeholder="e.g. maria@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Birth Date *</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell me something about you..."
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
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                ? "Update Friend"
                : "Register Friend"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Delete confirmation modal */}
      {deletingId && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Confirm Deletion</h3>
            <p className={styles.modalMessage}>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={handleCancelDelete}
                className={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={submitting}
                className={styles.modalDeleteButton}
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {users.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Birth Date</th>
                <th>Next Birthday</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const daysUntilBirthday = user.birthDate
                  ? calculateDaysUntilBirthday(new Date(user.birthDate))
                  : null;

                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.birthDate
                        ? new Date(user.birthDate).toLocaleDateString("es-ES")
                        : "-"}
                    </td>
                    <td className={styles.birthdayCell}>
                      {daysUntilBirthday !== null ? (
                        <span
                          className={
                            daysUntilBirthday <= 7 ? styles.birthdaySoon : ""
                          }
                        >
                          {daysUntilBirthday === 0
                            ? "Today! 🎉"
                            : `${daysUntilBirthday} days`}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className={styles.description}>{user.description}</td>
                    <td className={styles.actions}>
                      <button
                        onClick={() => handleEdit(user)}
                        className={styles.editButton}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className={styles.deleteButton}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No friends registered yet</p>
          <p className={styles.emptySubtext}>
            Click on "+ Add Friend" to register the first one
          </p>
        </div>
      )}
    </div>
  );
}
