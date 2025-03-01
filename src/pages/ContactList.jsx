import { useState } from "react";
import { Link } from "react-router-dom";
import { useContacts } from "../hooks/useContacts";
import { contactService } from "../services/contactService";
import ConfirmationModal from "../components/ConfirmationModal";
import "./ContactList.css";

const ContactList = () => {
  const {
    contacts,
    loading,
    searchLoading,
    error,
    searchTerm,
    setSearchTerm,
    setContacts,
  } = useContacts();
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedField, setSortedField] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleSort = () => {
    const sortedContacts = [...contacts].sort((a, b) => {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();
      return sortOrder === "asc"
        ? emailA.localeCompare(emailB)
        : emailB.localeCompare(emailA);
    });

    setContacts(sortedContacts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortedField("email");
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteConfirm = async () => {
    try {
      await contactService.delete(deleteId);
      setContacts(contacts.filter((contact) => contact.id !== deleteId));
      setModalOpen(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <>
      <div className="contact-list margin-top">
        <div className="d-flex align-items-center mb-3">
          <Link to="/add" className="btn btn-primary">
            Add Contact
          </Link>
          <div className="search-container">
            <input
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className={`form-control search-input ${searchLoading ? "pe-5" : ""
                }`}
              aria-label="Search contacts"
            />
            {searchLoading && (
              <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                  style={{ width: "1rem", height: "1rem" }}
                >
                  <span className="visually-hidden">Searching...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {contacts.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>
                    Email{" "}
                    <button
                      onClick={handleSort}
                      className="sort-button"
                    >
                      {sortedField === "email"
                        ? sortOrder === "asc"
                          ? "↑"
                          : "↓"
                        : "↑↓"}
                    </button>
                  </th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>
                      <Link to={`/edit/${contact.id}`} className="edit-btn">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(contact.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert-message">
            {searchTerm
              ? `No contacts found matching "${searchTerm}"`
              : "No contacts available. Click 'Add Contact' to create one."}
          </div>
        )}


        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Contact"
          message="Are you sure you want to delete this contact?"
        />
      </div>
    </>
  );
};

export default ContactList;







