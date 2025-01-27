function pad00(n: number) {
  return `00${n}`.slice(-2);
}

export function stringifyTime(tf: number | undefined) {
  if (tf === undefined) {
    return "0:00:00.00";
  }
  const t = Number.parseFloat(tf.toFixed(2));
  const ms = t.toFixed(2).slice(-2);
  const s = (t | 0) % 60;
  const m = ((t / 60) | 0) % 60;
  const h = (t / 3600) | 0;
  return `${h}:${pad00(m)}:${pad00(s)}.${ms}`;
}
