export const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
