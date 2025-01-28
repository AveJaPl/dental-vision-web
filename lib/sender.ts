import axios from "axios";

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
    const res = await axios.post(
      "https://chat.lukaszszczesiak.pl/auth/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ustawienie withCredentials tutaj
      }
    );
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
    const res = await axios.post(
      "https://chat.lukaszszczesiak.pl/auth/register",
      {
        name,
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ustawienie withCredentials tutaj
      }
    );
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
    const res = await axios.post(
      "https://chat.lukaszszczesiak.pl/auth/logout",
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ustawienie withCredentials tutaj
      }
    );
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
