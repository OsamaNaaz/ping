import { usernameRegex, passwordRegex, emailRegex, nameRegex } from './constants.js';
export function logOut () {
    localStorage.removeItem("user");
    window.location.href = "/";
}
export function currentUser() {
    return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
}
export function validateUser({ username, password, confirmPassword, email, name }) {
  const errors = {};

  if (!usernameRegex.test(username)) {
    errors.username = "Username must be 3–20 chars, letters/numbers/underscores only";
  }

  if (!passwordRegex.test(password)) {
    errors.password = "Password must contain at least 6 chars, one letter and one number";
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!nameRegex.test(name.trim())) {
    errors.name = "Name should be 3–50 characters, letters only";
  }

  return errors;
}
export function isEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}

export const validate = (field,validators,value) => {
  const regexMap = {
          username: usernameRegex,
          password: passwordRegex,
          email: emailRegex,
          name: nameRegex
      };
    const validation = regexMap[field].test(value);
    return {
        ...validators,
        [field]: validation
    };
}