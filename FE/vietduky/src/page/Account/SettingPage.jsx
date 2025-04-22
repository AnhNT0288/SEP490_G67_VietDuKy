import AccountSettings from "@/components/Account/AccountSetting/AccountSetting";
import ReviewTour from "@/components/Account/ReviewTour/ReviewTour";
import LayoutAccountService from "@/layouts/LayoutAccountService";
import React from "react";

const SettingPage = () => {
  return (
    <LayoutAccountService>
      <div className="p-6">
        <div className="space-y-6">
          <AccountSettings />
        </div>
      </div>
    </LayoutAccountService>
  );
};

export default SettingPage;
