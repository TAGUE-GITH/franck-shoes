import { Link } from 'react-router-dom'

import {
  formatPrice
} from '../utils/formatPrice'

import './Cart.css'


function Cart({
  cart,
  onIncrease,
  onDecrease,
  onRemove
}) {
  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
        item.quantity,

      0
    )


  return (
    <section className="cart-section">

      <div className="cart-header">

        <div>

          <span className="cart-eyebrow">
            Votre sélection
          </span>

          <h2>
            Mon panier
          </h2>

        </div>


        <span className="cart-items-count">
          {cart.length}

          {' '}

          produit
          {cart.length > 1
            ? 's'
            : ''}
        </span>

      </div>


      {cart.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛍
          </div>

          <h3>
            Votre panier est vide
          </h3>

          <p>
            Découvrez notre collection
            et trouvez votre prochaine paire.
          </p>

          <Link to="/products">
            Découvrir les chaussures
          </Link>

        </div>

      ) : (

        <div className="cart-layout">

          <div className="cart-products">

            {cart.map(
              (item) => (

                <article
                  className="cart-item"
                  key={
                    `${item.id}-${item.size}`
                  }
                >

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />

                  ) : (

                    <div className="cart-item-image">
                      👟
                    </div>

                  )}


                  <div className="cart-item-content">

                    <div className="cart-item-top">

                      <div>

                        <span className="cart-item-brand">
                          {item.brand}
                        </span>

                        <h3>
                          {item.name}
                        </h3>

                        <p className="cart-item-size">
                          Pointure :
                          {' '}
                          {item.size}
                        </p>

                      </div>


                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          onRemove(
                            item.id,
                            item.size
                          )
                        }
                      >
                        Supprimer
                      </button>

                    </div>


                    <div className="cart-item-bottom">

                      <div className="quantity-control">

                        <button
                          type="button"
                          onClick={() =>
                            onDecrease(
                              item.id,
                              item.size
                            )
                          }
                        >
                          −
                        </button>


                        <span>
                          {item.quantity}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            onIncrease(
                              item.id,
                              item.size
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                        >
                          +
                        </button>

                      </div>


                      <strong>
                        {formatPrice(
                          Number(item.price) *
                          item.quantity
                        )}
                      </strong>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>


          <aside className="cart-summary">

            <span className="summary-label">
              Résumé
            </span>

            <h3>
              Votre commande
            </h3>


            <div className="summary-row">

              <span>
                Sous-total
              </span>

              <span>
                {formatPrice(total)}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Livraison
              </span>

              <span>
                Calculée plus tard
              </span>

            </div>


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(total)}
              </strong>

            </div>


            <button
              type="button"
              className="checkout-button"
            >
              Commander
            </button>


            <p className="secure-payment">
              Paiement sécurisé
            </p>

          </aside>

        </div>

      )}

    </section>
  )
}


export default Cart