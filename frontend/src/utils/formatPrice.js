export function formatPrice(price) {
  const numericPrice =
    Number(price)

  if (
    Number.isNaN(numericPrice)
  ) {
    return '0 FCFA'
  }

  return `${numericPrice.toLocaleString(
    'fr-FR'
  )} FCFA`
}