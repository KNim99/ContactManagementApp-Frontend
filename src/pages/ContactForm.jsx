import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contactService } from "../services/contactService";
import "./ContactForm.css";
import { validateContact } from "../utils/validationUtils";

const INITIAL_STATE = { name: "", email: "", phone: "" };

export default function ContactForm() {
  const [contact, setContact] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchContact = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setApiError(null);
        const data = await contactService.getById(id);
        setContact(data);
      } catch (error) {
        setApiError("Failed to fetch contact details");
        console.error("Error fetching contact:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError(null);
  };

  const validateForm = () => {
    const { isValid, errors: newErrors } = validateContact(contact);
    setErrors(newErrors);
    return isValid;
  };

  const sanitizeContact = (data) => {
    const { id: _, createdAt, phone, ...sanitizedData } = data;
    return phone?.trim()
      ? { ...sanitizedData, phone: phone.trim() }
      : sanitizedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);
      const sanitizedData = sanitizeContact(contact);

      if (id) {
        await contactService.update(id, sanitizedData);
      } else {
        await contactService.create(sanitizedData);
      }
      navigate("/");
    } catch (error) {
      setApiError(error.message || "Failed to save contact");
      console.error("Error saving contact:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <div className="card p-4">
        <h4>{id ? "Edit Contact" : "Add Contact"}</h4>
        {apiError && (
          <div className="alert alert-danger mb-3" role="alert">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={contact.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              disabled={loading}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              disabled={loading}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={contact.phone}
              onChange={handleChange}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              disabled={loading}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  {id ? "Updating..." : "Adding..."}
                </>
              ) : id ? (
                "Update Contact"
              ) : (
                "Add Contact"
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
