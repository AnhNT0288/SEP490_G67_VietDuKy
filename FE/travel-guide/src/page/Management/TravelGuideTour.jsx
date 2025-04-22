import LayoutManagement from "../../layouts/LayoutManagement";
import InstructionSchedule from "../../components/sn-travel-guide-tour/InstructionSchedule";

const TravelGuideTour = () => {
  return (
    <LayoutManagement title="Danh sách lịch trình">
      <InstructionSchedule />
    </LayoutManagement>
  );
};

export default TravelGuideTour;
