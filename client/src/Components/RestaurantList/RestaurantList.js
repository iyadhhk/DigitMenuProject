import React from "react";
import { useSelector } from "react-redux";

import RestaurantListItem from "../RestaurantListItem/RestaurantListIem";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import "./RestaurantList.css";

const RestaurantList = ({ restaurants }) => {
  const { ownerStatus, ownerErrors } = useSelector((state) => state.owner);
  return (
    <div className="restlist">
      <h3>Liste des restaurants</h3>
      <div className="restlist__list">
        {ownerStatus.getList === "loading" ? (
          <IconContext.Provider value={{ className: "spinner--large" }}>
            <div>
              <ImSpinner9 />
            </div>
          </IconContext.Provider>
        ) : ownerStatus.getList === "failed" ? (
          <h2>something went wrong</h2>
        ) : ownerStatus.getList === "succeded" && restaurants.length > 0 ? (
          restaurants.map((rest) => (
            <RestaurantListItem key={rest._id} rest={rest} />
          ))
        ) : (
          <h5> aucun restaurant n'est enregistré </h5>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
