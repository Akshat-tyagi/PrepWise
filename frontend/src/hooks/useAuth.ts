export function useAuth() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const logout = () => {
    localStorage.removeItem("token");
  };
  return { token, isAuthenticated, logout };
}
