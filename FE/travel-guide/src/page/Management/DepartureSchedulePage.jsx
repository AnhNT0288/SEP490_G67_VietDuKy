import LayoutManagement from "../../layouts/LayoutManagement";
import DepartureSchedule from "../../components/sn-travel-guide-tour/DepartureSchedule";

const DepartureSchedulePage = () => {
  return (
    <LayoutManagement title="Danh sách lịch trình còn trống">
      <DepartureSchedule />
    </LayoutManagement>
  );
};

export default DepartureSchedulePage;
