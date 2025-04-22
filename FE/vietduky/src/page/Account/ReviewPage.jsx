import ReviewTour from "@/components/Account/ReviewTour/ReviewTour";
import LayoutAccountService from "@/layouts/LayoutAccountService";
import React from "react";

const ReviewPage = () => {
  return (
    <LayoutAccountService>
      <div className="p-6">
        <div className="space-y-6">
          <ReviewTour />
        </div>
      </div>
    </LayoutAccountService>
  );
};

export default ReviewPage;
