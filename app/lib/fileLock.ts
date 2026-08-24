/**
 * Simple file-based write lock to prevent race conditions
 * when concurrent requests read-modify-write JSON files.
 */

import fs from 'fs/promises';

const locks = new Map<string, Promise<void>>();

/**
 * Execute a callback while holding an in-process lock on the given key.
 * This serializes concurrent writes to the same file within a single
 * Node.js process (which is the common case for Next.js dev/production).
 */
export async function withFileLock<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  // Wait for any existing lock on this key
  while (locks.has(key)) {
    await locks.get(key);
  }

  let resolve: () => void;
  const lockPromise = new Promise<void>((r) => {
    resolve = r;
  });
  locks.set(key, lockPromise);

  try {
    return await fn();
  } finally {
    locks.delete(key);
    resolve!();
  }
}

/**
 * Safely read a JSON array from a file, returning [] if the file
 * doesn't exist or is corrupt.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readJsonArray(filePath: string): Promise<any[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Safely append an entry to a JSON array file, creating the
 * directory and file if they don't exist.
 */
export async function appendToJsonArray(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entry: any
): Promise<void> {
  const dir = filePath.substring(0, filePath.lastIndexOf('/'));
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  const data = await readJsonArray(filePath);
  data.push(entry);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
