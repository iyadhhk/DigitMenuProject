import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import {
  createOrder,
  updateOrder,
  getOrderById,
  deletePreOrder,
} from "../../features/orderSlice";
import ClientMenuItem from "../../Components/ClientMenuItem/ClientMenuItem";
import "./ClientMenu.css";

const ClientMenu = ({ menu }) => {
  const [values, setValues] = useState({
    orderId: null,
    items: [],
    total: 0,
    numberOfItems: 0,
    categorie: "entree",
  });
  const { items, total, categorie, numberOfItems } = values;
  const dispatch = useDispatch();
  const { preOrder, order, orderStatus } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(deletePreOrder());
    return () => {
      dispatch(deletePreOrder());
    };
  }, []);
  useEffect(() => {
    setValues({ ...values, items: preOrder });
  }, [preOrder]);
  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      dispatch(getOrderById(id));
      setValues({ ...values, orderId: id });
    }
  }, []);
  useEffect(() => {
    if (items.length > 0) {
      let totalCost = items.reduce(
        (acc, curv) => Number(acc) + Number(curv.price),
        0
      );
      let totalNumber = items.reduce(
        (acc, curv) => Number(acc) + Number(curv.quantity),
        0
      );

      setValues({ ...values, total: totalCost, numberOfItems: totalNumber });
    } else {
      setValues({ ...values, total: 0, numberOfItems: 0 });
    }
  }, [items]);

  const history = useHistory();
  const restId = localStorage.getItem("restId");
  const tableNumber = localStorage.getItem("tableNumber");

  const handleButton = () => {
    const orderId = localStorage.getItem("id");
    if (items.length > 0) {
      if (orderId && order && !order.order.paid) {
        dispatch(updateOrder({ data: { items, total, orderId }, history }));
      } else {
        dispatch(
          createOrder({ data: { items, total, restId, tableNumber }, history })
        );
      }
    }
  };

  const orderLink = order && !order.order.paid && (
    <Link
      to={{
        pathname: "/client-page/order",

        state: { orderId: order.order._id },
      }}
    >
      <span className="client-menu__link">Mes choix</span>
    </Link>
  );
  const menuItems =
    menu && menu.menu.items ? (
      <Fragment>
        {menu.menu.items.filter((item) => item.categorie === categorie).length >
          0 && (
          <Fragment>
            <p className="client-menu__categorie">{categorie}</p>
            <div className="client-menu__sub">
              {menu.menu.items
                .filter((item) => item.categorie === categorie)
                .map((item) => (
                  <ClientMenuItem key={item._id} item={item} />
                ))}
            </div>
          </Fragment>
        )}
      </Fragment>
    ) : (
      <h5>Loading...</h5>
    );
  const handleChoice = (choice) => {
    setValues({ ...values, categorie: choice });
  };
  return (
    <div className="client-menu">
      <div className="client-menu__menu">
        <button
          className={
            categorie === "entree" ? "active-categorie" : "inactive-categorie"
          }
          onClick={() => handleChoice("entree")}
        >
          entrée
        </button>
        <button
          className={
            categorie === "plat" ? "active-categorie" : "inactive-categorie"
          }
          onClick={() => handleChoice("plat")}
        >
          plat
        </button>
        <button
          className={
            categorie === "boisson" ? "active-categorie" : "inactive-categorie"
          }
          onClick={() => handleChoice("boisson")}
        >
          boisson
        </button>
        <button
          className={
            categorie === "Dessert" ? "active-categorie" : "inactive-categorie"
          }
          onClick={() => handleChoice("Dessert")}
        >
          dessert
        </button>
      </div>
      <div className="client-menu__items">{menuItems}</div>
      <div className="client-menu__nav">
        {orderLink}
        <p className="client-menu__total">
          <span style={{ color: "white" }}>{total} DT</span>
          <span style={{ color: "white" }}>({numberOfItems} élements)</span>
        </p>
        <button onClick={() => handleButton()}>Commander</button>
      </div>
    </div>
  );
};

export default ClientMenu;
