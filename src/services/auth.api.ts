const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

export async function registerPlatformUser(payload: {
  firstName: string;
  lastName: string;
  dobMonth: number;
  dobYear: number;
  city?: string;
  stateRegion?: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function loginPlatformUser(payload: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function verifyPlatformUserOtp(payload: {
  email: string;
  otpCode: string;
}) {
  const response = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function getMyPlatformProfile(token: string) {
  const response = await fetch(`${API_BASE}/auth/me/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Profile request failed with status ${response.status}.`);
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to load profile.');
  }

  return data;
}

export async function updateMyPlatformProfile(
  token: string,
  payload: {
    firstName: string;
    lastName: string;
    dobMonth: number;
    dobYear: number;
    city?: string;
    stateRegion?: string;
  }
) {
  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Profile update failed with status ${response.status}.`);
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update profile.');
  }

  return data;
}