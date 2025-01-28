import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginData) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    if (res) {
      const { data, message, status } = res.data;
      return {
        data,
        message,
        status,
      };
    } else {
      return {
        data: null,
        message: "Nie udało się zalogować.",
        status: 400,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Coś poszło nie tak.",
      status: 400,
    };
  }
};

export const register = async ({ name, email, password }: RegisterData) => {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    if (res) {
      const { data, message, status } = res.data;
      return {
        data,
        message,
        status,
      };
    } else {
      return {
        data: null,
        message: "Nie udało się zarejestrować.",
        status: 500,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Coś poszło nie tak.",
      status: 400,
    };
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    const { data, message, status } = res.data;
    return {
      data,
      message,
      status,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Coś poszło nie tak.",
      status: 400,
    };
  }
};

export const checkAuth = async () => {
  try {
    const res = await axios.get("https://chat.lukaszszczesiak.pl/auth/check", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Ustawienie withCredentials tutaj
    });
    const { data, message, status } = res.data;
    console.log("checkAuth", { data, message, status });
    return {
      data,
      message,
      status,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Coś poszło nie tak.",
      status: 400,
    };
  }
};
