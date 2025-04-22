import BreadCrumbProfile from "@/components/BreadCrumb/BreadCrumbProfile";
import ProfileDetail from "@/components/Account/Profile/ProfileDetail";
import SidebarProfile from "@/components/Sidebar/SidebarProfile";
import Layout from "@/layouts/LayoutAccountService";

const ProfileCustomer = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="space-y-6">
          <ProfileDetail />
        </div>
      </div>
    </Layout>
  );
};

export default ProfileCustomer;
