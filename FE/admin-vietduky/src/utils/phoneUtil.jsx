const phone = (value) => {
  if (!value) return '';
  const cleanValue = value.replace(/\D/g, '');
  const match = cleanValue.match(/^(\d{1,3})(\d{1,3})?(\d{1,4})?/);
  if (match[2]) {
    return `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
  }
  return `(${match[1]}`;
}