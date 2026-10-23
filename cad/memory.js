export const MEMORY_LIMITS = Object.freeze({
  historyBytes: 8 * 1024 * 1024,
  historyEntries: 12,
  moldStrokes: 5,
  strokePoints: 9,
  moldInputTriangles: 6000,
  moldOutputTriangles: 8000,
  moldProjectTriangles: 20000,
  moldTimeoutMs: 8000
});

export function historyBytes(history, future = []) {
  // Count UTF-16 storage conservatively, including both Undo and Redo.
  return [...history, ...future].reduce((bytes, state) => bytes + state.length * 2, 0);
}

export function trimHistory(history, future, preferred = history) {
  const other = preferred === history ? future : history;
  let bytes = historyBytes(history, future);
  while (history.length + future.length > MEMORY_LIMITS.historyEntries || bytes > MEMORY_LIMITS.historyBytes) {
    const stack = other.length ? other : preferred;
    if (!stack.length) break;
    bytes -= stack.shift().length * 2;
  }
}
