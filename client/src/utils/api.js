export const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});
