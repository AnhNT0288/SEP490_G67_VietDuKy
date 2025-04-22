import FavouriteTourCard from "@/components/Account/FavouriteTour/FavouriteTour";
import LayoutAccountService from "@/layouts/LayoutAccountService";
import { FavouriteTourService } from "@/services/API/favourite_tour.service";
import React, { useEffect, useState } from "react";

const FavouriteTourPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [favoriteTours, setFavoriteTours] = useState([]);

  useEffect(() => {
    const fetchFavoriteTours = async () => {
      try {
        const response = await FavouriteTourService.getFavouriteTourByUserID(user.id);
        setFavoriteTours(response.data.data);
      } catch (error) {
        console.error("Error fetching favorite tours:", error);
      }
    };

    fetchFavoriteTours();
  }, [user.id]);

  console.log("Favorite tours:", favoriteTours);

  return (
    <LayoutAccountService>
      <div className="p-6">
        <div className="space-y-6">
          {favoriteTours.length > 0 ? (
            <FavouriteTourCard favoriteTours={favoriteTours} setFavoriteTours={setFavoriteTours} />
          ) : (
            <div>Không có tour yêu thích nào.</div>
          )}
        </div>
      </div>
    </LayoutAccountService>
  );
};

export default FavouriteTourPage;