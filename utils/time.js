export function format(from, step) {
  const year = from + ~~(step / 12);
  const month = step % 12 + 1;
  return `${year}/${month < 10 ? '0' + month : month}`;
}

export function before(a, b) {
  return a < b || a === b;
}