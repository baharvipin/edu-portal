import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex">
      <Sidebar role={user?.role} />
      <main className="flex-1 bg-gray-100 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
