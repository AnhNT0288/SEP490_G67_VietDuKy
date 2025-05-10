import { useLocation } from "react-router-dom";

export const LockedAuth = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const locked = params.get("locked");

  return (
    <>
      {locked && <p className="text-red-600">Tài khoản của bạn đã bị khóa vĩnh viễn</p>}
      {/* Form login */}
    </>
  );
};
