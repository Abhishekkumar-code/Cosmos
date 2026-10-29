import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register as registerApi, login as loginApi } from "../service/auth.service.js";
import { setUser, setError } from "../auth.slice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, error: reduxError } = useSelector((state) => state.auth || {});
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async ({ username, email, password, isAdmin }) => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      setSuccess(false);
      dispatch(setError(null));

      const data = await registerApi({ username, email, password, isAdmin });

      const userData = data?.user || data;
      setLocalLoading(false);
      setSuccess(true);
      return { success: true, user: userData, data };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.err ||
        err?.message ||
        "Registration failed. Please try again.";
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      setLocalLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      setSuccess(false);
      dispatch(setError(null));

      const data = await loginApi({ email, password });

      const userData = data?.user || data;
      dispatch(setUser(userData));
      setLocalLoading(false);
      setSuccess(true);
      return { success: true, user: userData, data };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.err ||
        err?.message ||
        "Login failed. Please enter valid credentials.";
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
      setLocalLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    loading: localLoading,
    error: localError || reduxError,
    success,
    handleRegister,
    handleLogin,
    clearError: () => {
      setLocalError(null);
      dispatch(setError(null));
    },
  };
};

export default useAuth;
