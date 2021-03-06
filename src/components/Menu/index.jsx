import React, { useState, useEffect } from "react";
import HeaderDropdown from "../HeaderDropdown";
import Cart from "../../assets/icons/cart";
import CloseIcon from "../../assets/icons/closeIcon";
import MenuIcon from "../../assets/icons/menuIcon";
import globalState from "../../globalStore/globalState";
import { useDispatch, useGlobal } from "reactn";
import useReactRouter from "use-react-router";
import Account from "../../assets/icons/person";
import DropdownMenu from "../DropdownMenu";
import DropdownMenuItem from "../DropdownMenuItem";
import MyAccount from "../../assets/icons/my_account";
import SignOut from "../../assets/icons/log_out";
import { getSneakersSize } from "../../utils/productModifiers";
import RemoveShopping from "../../assets/icons/remove_shopping";
import Button from "../Button";
import './index.scss';
import {checkIfMobile} from "../../utils/mobile";
import {calculateTotalAmount, getCartItems} from "../../utils/cart";
import notify from "../../utils/toast";
import builton from "../../utils/builton";

const Menu = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [user] = useGlobal("user");
  const [cart, setCart] = useGlobal("cart");
  const removeItemFromCart = useDispatch('removeItemFromCart');

  const { history } = useReactRouter();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  const removeItem = (prod, ev) => {
    ev.stopPropagation();
    removeItemFromCart(prod);
  };

  useEffect(() => {
    const setCartItems = async () => {
      try {
        const prods = await getCartItems();
        setCart(prods);
      } catch(err) {
        notify('Failed to fetch cart items', {
          type: 'error'
        })
      }
    };
    const builtonCart = builton.cart.get();

    if (builtonCart.length && !cart.length) {
      setCartItems();
    }
  }, []);

  const renderLogoutContainer = () => {
    return (
      <>
        <button
          className="header-box-hyperlink"
          onClick={e => {
            if (!user) history.push('/auth');
            user && e.preventDefault();
          }}
          onMouseEnter={() => {
            user && setUserMenuOpen(true);
          }}
          onMouseLeave={() => {
            user && setUserMenuOpen(false);
          }}
        >
          <span>
            {user ? (
              <div>{user.email}</div>
            ) : (
              <Account width={18} height={18} color="black" />
            )}
          </span>
        </button>
        <button
          type="button"
          className="header-box-hyperlink cart"
          onClick={() => checkIfMobile() && setCartOpen(!cartOpen)}
          onMouseEnter={() => !checkIfMobile() && setCartOpen(true)}
          onMouseLeave={() => !checkIfMobile() && setCartOpen(false)}
        >
          <span>
            <Cart width={18} height={18} color="black" />{" "}
            <span className="cart-count">{(cart && cart.length) || 0}</span>
          </span>
        </button>
        <HeaderDropdown open={userMenuOpen}>
          <DropdownMenu>
            <DropdownMenuItem
              onClick={() => {
                history.push("/my-account/my-profile");
              }}
            >
              <span>My Account</span>
              <MyAccount color="#c5c5c5" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                globalState.logout();
                // Force refresh of the header
                history.push("/");
              }}
            >
              <span>Logout</span>
              <SignOut color="#c5c5c5" />
            </DropdownMenuItem>
          </DropdownMenu>
        </HeaderDropdown>
      </>
    );
  };

  const renderCartContainer = () => {
    return (
      <DropdownMenu>
        {cart && cart.length > 0 ? (
          <>
            {cart.map((prod, index) => (
              <DropdownMenuItem
                key={`cart-product-${prod.size._id.$oid}${index}`}
                onClick={() =>
                  history.push(
                    `/product_list/${prod.category}/${prod.product._id.$oid}`
                  )
                }
              >
                <div className="cart-product-row">
                  <div>{prod.product.name}</div>
                  <div>{`Size ${getSneakersSize(prod.size)}`}</div>
                  <div>
                    {prod.product.final_price} {prod.product.currency}
                  </div>
                  <div
                    className="remove-cart-item"
                    onClick={ev => removeItem(prod, ev)}
                  >
                    <RemoveShopping color="#c5c5c5" />
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <div className="header-checkout-container">
              <Button
                onClick={() => {
                  history.push("/checkout/cart");
                }}
                type="button"
                className="button round"
                title="Proceed to checkout"
                style={{
                  padding: "4px 12px",
                  height: 40,
                  fontSize: "0.72rem"
                }}
              />
              <div className="header-cart-amount">
                {calculateTotalAmount(cart)} {cart[0].product.currency}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart-container">No items in the cart.</div>
        )}
      </DropdownMenu>
    );
  };

  const renderResponsiveMenu = () => {
    return (
      <>
        <div className="responsive-actions-container">
          <button
            type="button"
            className="header-box-hyperlink cart"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
          <span>
            <Cart width={18} height={18} color="black" />{" "}
            <span className="cart-count">{(cart && cart.length) || 0}</span>
          </span>
          </button>
          <HeaderDropdown open={cartOpen}>{renderCartContainer()}</HeaderDropdown>
          <div className="menu-button-container">
            <div className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </div>
          </div>
        </div>
        <div
          className={`responsive-menu ${
            menuOpen ? "responsive-menu-open" : "responsive-menu-closed"
          }`}
        >
          {user &&
            <div className="internal-menu-items">
              <div className="header-title">{user.email}</div>
              <button
                className="header-box-hyperlink"
                onClick={e => {
                  e.preventDefault();
                  setMenuOpen(false);
                  history.push("/my-account/my-profile");
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>My Account</span>
              </button>
              <button
                className="header-box-hyperlink"
                onClick={e => {
                  e.preventDefault();
                  setMenuOpen(false);
                  globalState.logout();
                  history.push("/");
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Log out</span>
              </button>
            </div>
          }
          {!user &&
            <div className="internal-menu-items">
              <button
                 className="header-box-hyperlink"
                 onClick={(e) => {
                e.preventDefault();
                history.push('/auth')
              }}
              >
              Log in
              </button>
            </div>
          }
          <div className="external-menu-items">
            <div>
              <a
                href="https://builton.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Website</span>
              </a>
            </div>
            <div>
              <a
                href="https://docs.builton.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Docs</span>
              </a>
            </div>
            <div>
              <a
                href="https://dashboard.builton.dev/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Dashboard</span>
              </a>
            </div>
            <div>
              <a
                href="https://github.com/BuiltonDev/builton-demo-store"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Github</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className={`responsive-menu-backdrop ${
            menuOpen ? "backdrop-open" : "backdrop-close"
          }`}
          onClick={() => setMenuOpen(false)}
        />
      </>
    )
  };

  const renderMenu = () => {
    return (
      <div className="top-header-menu-container">
        <a
          className="header-box-hyperlink"
          href="https://builton.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Website</span>
        </a>
        <a
          className="header-box-hyperlink"
          href="https://docs.builton.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Docs</span>
        </a>
        <a
          className="header-box-hyperlink"
          href="https://dashboard.builton.dev/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Dashboard</span>
        </a>
        <a
          className="header-box-hyperlink"
          href="https://github.com/BuiltonDev/builton-demo-store"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Github</span>
        </a>
        <span className="dropdown-container">{renderLogoutContainer()}</span>
        <HeaderDropdown open={cartOpen}>{renderCartContainer()}</HeaderDropdown>
      </div>
    );
  };

  return (
    <div className="main-menu-container">
      {renderMenu()}
      {renderResponsiveMenu()}
    </div>
  );
};

export default Menu;
