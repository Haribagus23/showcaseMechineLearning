// Single canonical API helper for all backend calls
const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';

function getBase(path: string) {
  const base = BACKEND_BASE.replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}

export async function analyzeFormData(formData: FormData) {
  const res = await fetch(getBase('/analyze'), {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(`API ${res.status} ${res.statusText} ${txt || ''}`);
  }

  return res.json();
}

// DEPRECATED: Any usage of lib/apis.ts should be removed.
