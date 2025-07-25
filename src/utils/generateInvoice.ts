export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  return `INV${year}${month}${day}${hours}${minutes}-${randomNum}`;
};