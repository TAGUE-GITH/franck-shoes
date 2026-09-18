const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000/api'


const ACCESS_TOKEN_KEY = 'franck_shoes_access'
const REFRESH_TOKEN_KEY = 'franck_shoes_refresh'


export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}


export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}


export function saveTokens(access, refresh) {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    access
  )

  localStorage.setItem(
    REFRESH_TOKEN_KEY,
    refresh
  )
}


export function clearTokens() {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY
  )

  localStorage.removeItem(
    REFRESH_TOKEN_KEY
  )
}


async function readResponse(response) {
  const contentType =
    response.headers.get('content-type')

  if (
    contentType &&
    contentType.includes('application/json')
  ) {
    return response.json()
  }

  return null
}


function extractErrorMessage(data) {
  if (!data) {
    return 'Une erreur est survenue.'
  }

  if (data.message) {
    return data.message
  }

  if (data.detail) {
    return data.detail
  }

  const firstKey = Object.keys(data)[0]

  if (!firstKey) {
    return 'Une erreur est survenue.'
  }

  const value = data[firstKey]

  if (Array.isArray(value)) {
    return value[0]
  }

  if (typeof value === 'object') {
    const nestedKey = Object.keys(value)[0]

    if (nestedKey) {
      const nestedValue = value[nestedKey]

      if (Array.isArray(nestedValue)) {
        return nestedValue[0]
      }

      return String(nestedValue)
    }
  }

  return String(value)
}


export async function loginUser(
  email,
  password
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/login/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email,
        password
      })
    }
  )

  const data = await readResponse(
    response
  )

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data)
    )
  }

  saveTokens(
    data.access,
    data.refresh
  )

  return data
}


export async function registerUser(
  userData
) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirm_password:
          userData.confirmPassword
      })
    }
  )

  const data = await readResponse(
    response
  )

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data)
    )
  }

  saveTokens(
    data.access,
    data.refresh
  )

  return data
}


async function refreshAccessToken() {
  const refresh =
    getRefreshToken()

  if (!refresh) {
    return null
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/token/refresh/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        refresh
      })
    }
  )

  const data = await readResponse(
    response
  )

  if (!response.ok) {
    clearTokens()

    return null
  }

  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    data.access
  )

  return data.access
}


export async function authenticatedRequest(
  path,
  options = {},
  retry = true
) {
  const accessToken =
    getAccessToken()

  const headers = {
    ...options.headers
  }

  if (
    !(options.body instanceof FormData)
  ) {
    headers['Content-Type'] =
      headers['Content-Type'] ||
      'application/json'
  }

  if (accessToken) {
    headers.Authorization =
      `Bearer ${accessToken}`
  }

  let response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers
    }
  )

  if (
    response.status === 401 &&
    retry
  ) {
    const newAccessToken =
      await refreshAccessToken()

    if (newAccessToken) {
      headers.Authorization =
        `Bearer ${newAccessToken}`

      response = await fetch(
        `${API_BASE_URL}${path}`,
        {
          ...options,
          headers
        }
      )
    }
  }

  return response
}


export async function getCurrentUser() {
  const response =
    await authenticatedRequest(
      '/auth/me/'
    )

  const data = await readResponse(
    response
  )

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data)
    )
  }

  return data
}


export function logoutUser() {
  clearTokens()
}