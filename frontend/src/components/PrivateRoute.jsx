import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

export default function PrivateRoute({ children, allowedRoles }) {
  const token = getToken();
  const user = getUser();

  // ⛔ Nëse s'ka token ose user, dërgo në login
  if (!token || !user) return <Navigate to="/login" />;

  // ⛔ Nëse user-i s'ka një nga rolet e lejuara
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // ✅ Akses i lejuar
  return children;
}
