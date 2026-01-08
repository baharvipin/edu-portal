import { NavLink } from "react-router-dom";

export default function Sidebar({ role }) {
  const teacherMenu = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "My Subjects", path: "/teacher/subjects" },
    { label: "Students", path: "/teacher/students" },
    { label: "Attendance", path: "/teacher/attendance" },
    { label: "Profile", path: "/teacher/profile" },
  ];

  const menu = role === "TEACHER" ? teacherMenu : [];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Edu Portal</h2>
      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
