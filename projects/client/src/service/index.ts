import axios from "axios";

export const baseURL = process.env.REACT_APP_API_BASE_URL;
export default axios.create({
  baseURL,
});
