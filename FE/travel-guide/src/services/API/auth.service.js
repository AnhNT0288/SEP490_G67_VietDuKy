import restClient from "../restClient";

export async function login(email, password) {
  return restClient({
    url: "auth/login",
    method: "POST",
    data: {
      email,
      password,
    },
  });
}

export async function register(email, password) {
  return restClient({
    url: "auth/register",
    method: "POST",
    data: {
      email,
      password,
    },
  });
}

export async function forgotPassword(email) {
  return restClient({
    url: "auth/forgot-password",
    method: "POST",
    data: {
      email,
    },
  });
}

export async function verifyOtp(email, resetCode) {
  return restClient({
    url: "auth/verify-otp",
    method: "POST",
    data: {
      email,
      resetCode,
    },
  });
}

export async function resetPassword(email, newPassword, confirmPassword) {
  return restClient({
    url: "auth/reset-password",
    method: "POST",
    data: {
      email,
      newPassword,
      confirmPassword,
    },
  });
}

