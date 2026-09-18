import {
  authenticatedRequest
} from './authService'


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000/api'


async function readResponse(
  response
) {
  const contentType =
    response.headers.get(
      'content-type'
    )

  if (
    contentType &&
    contentType.includes(
      'application/json'
    )
  ) {
    return response.json()
  }

  return null
}


function extractError(
  data
) {
  if (!data) {
    return 'Une erreur est survenue.'
  }

  if (data.message) {
    return data.message
  }

  const firstKey =
    Object.keys(data)[0]

  if (!firstKey) {
    return 'Une erreur est survenue.'
  }

  const value =
    data[firstKey]

  if (Array.isArray(value)) {
    return value[0]
  }

  return String(value)
}


export async function getProducts() {
  const response = await fetch(
    `${API_BASE_URL}/products/`
  )

  const data =
    await readResponse(response)

  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }

  return data
}


export async function getProduct(
  productId
) {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/`
  )

  const data =
    await readResponse(response)

  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }

  return data
}


export async function getAdminProducts() {
  const response =
    await authenticatedRequest(
      '/products/admin/manage/'
    )

  const data =
    await readResponse(response)

  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }

  return data
}


export async function getAdminProduct(
  productId
) {
  const response =
    await authenticatedRequest(
      `/products/admin/manage/${productId}/`
    )

  const data =
    await readResponse(response)

  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }

  return data
}


export async function createProduct(
  productData
) {
  const response =
    await authenticatedRequest(
      '/products/admin/manage/',
      {
        method: 'POST',

        body: productData
      }
    )

  const data =
    await readResponse(response)

  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }

  return data
}


export async function updateProduct(
  productId,
  productData
) {
  const response =
    await authenticatedRequest(
      `/products/admin/manage/${productId}/`,
      {
        method: 'PATCH',

        body: productData
      }
    )

  const data =
    await readResponse(response)

  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }

  return data
}


export async function deleteProduct(
  productId
) {
  const response =
    await authenticatedRequest(
      `/products/admin/manage/${productId}/`,
      {
        method: 'DELETE'
      }
    )

  if (!response.ok) {
    const data =
      await readResponse(response)

    throw new Error(
      extractError(data)
    )
  }
}