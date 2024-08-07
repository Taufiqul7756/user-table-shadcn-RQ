import axios from "axios";

export const fetchUsers = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(
      `https://dummyjson.com/users?skip=${(page - 1) * limit}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Network response was not ok");
  }
};
