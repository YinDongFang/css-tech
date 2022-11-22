export function formatDate(from, step) {
  const year = from + ~~(step / 12);
  const month = step % 12 + 1;
  return `${year}/${month < 10 ? '0' + month : month}`;
}

export function formatBigNumber(count) {
  if (count === undefined) return undefined;
  const ks = ~~(Math.log10(count) / 3);
  const unit = ['', 'k', 'm', 'b', 't'][ks];
  const num = count / (1000 ** ks);
  return (num >= 100 ? ~~num : Number(num.toFixed(1))) + unit;
}

export function before(a, b) {
  return a < b || a === b;
}