import Cart from '../components/Cart'

function CartPage({
  cart,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <main>
      <Cart
        cart={cart}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />
    </main>
  )
}

export default CartPage