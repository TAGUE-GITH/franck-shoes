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


  if (data.detail) {
    return data.detail
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


  if (
    value &&
    typeof value === 'object'
  ) {
    return JSON.stringify(value)
  }


  return String(value)
}


export async function getDeliveryFees() {
  const response =
    await fetch(
      `${API_BASE_URL}/orders/delivery-fees/`
    )


  const data =
    await readResponse(
      response
    )


  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }


  return data
}


export async function createOrder(
  orderData
) {
  const response =
    await authenticatedRequest(
      '/orders/',
      {
        method: 'POST',

        body: JSON.stringify(
          orderData
        )
      }
    )


  const data =
    await readResponse(
      response
    )


  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }


  return data
}


export async function getMyOrders() {
  const response =
    await authenticatedRequest(
      '/orders/'
    )


  const data =
    await readResponse(
      response
    )


  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }


  return data
}


export async function getOrder(
  orderId
) {
  const response =
    await authenticatedRequest(
      `/orders/${orderId}/`
    )


  const data =
    await readResponse(
      response
    )


  if (!response.ok) {
    throw new Error(
      extractError(data)
    )
  }


  return data
}