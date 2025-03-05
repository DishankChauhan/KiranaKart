export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateQuantity = (quantity: number): boolean => {
  return quantity >= 0 && Number.isInteger(quantity);
};

export const validatePrice = (price: number): boolean => {
  return price >= 0;
};