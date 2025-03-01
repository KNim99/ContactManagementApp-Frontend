import axios from "axios";
import config from "../config/config";

const { API_URL } = config;

export const contactService = {
  async getAll(searchTerm = "", signal) {
    try {
      const response = await axios.get(
        API_URL + (searchTerm ? `?search=${searchTerm}` : ""),
        { signal }
      );
      return response.data.data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw error;
      }
      throw new Error("Failed to fetch contacts");
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch contact");
    }
  },

  async create(contact) {
    try {
      const response = await axios.post(API_URL, contact);
      return response.data;
    } catch (error) {
      throw new Error("Failed to create contact");
    }
  },

  async update(id, contact) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, contact);
      return response.data;
    } catch (error) {
      throw new Error("Failed to update contact");
    }
  },

  async delete(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw new Error("Failed to delete contact");
    }
  },
};
