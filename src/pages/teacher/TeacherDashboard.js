import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/teachers/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then(setDashboard);
  }, []);

  if (!dashboard) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {dashboard.teacherName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s what’s happening in your classes today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Subjects"
          value={dashboard.subjectCount}
          icon="📘"
          color="bg-blue-50"
        />
        <StatCard
          title="Students"
          value={dashboard.studentCount}
          icon="👩‍🎓"
          color="bg-green-50"
        />
        <StatCard
          title="School"
          value={dashboard.schoolName}
          icon="🏫"
          color="bg-purple-50"
        />
      </div>

      {/* Subjects */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          My Subjects
        </h2>

        {dashboard?.subjects?.length === 0 ? (
          <p className="text-gray-500">No subjects assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dashboard?.subjects?.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-lg shadow-sm p-5 border hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📘</span>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {s.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500">Assigned subject</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-lg p-5 ${color} border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
