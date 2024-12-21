export default async function fetchUserDataFromBackend(token: string) {
  try {
    const response = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      console.error(
        "Error fetching user data from backend:",
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data from backend:", error);
    return null;
  }
}
