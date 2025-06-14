export const getMenuByRole = (role) => {
  const userMenu = [
    { label: "Home", route: "/dashboard" },
    { label: "My Projects", route: "/dashboard/myprojects" },
    { label: "Reports", route: "/dashboard/reports" },
    { label: "Expenses", route: "/dashboard/expenses" },
    { label: "Messages", route: "/dashboard/messages" },
    { label: "Support", route: "/dashboard/support" },
  ];

  const adminMenu = {
    systemAdmin: [
      { label: "Dashboard Overview", route: "/admin-dashboard" },
      { label: "User Management", route: "/admin-dashboard/users" },
      { label: "Staff Management", route: "/admin-dashboard/staff" },
      { label: "Support Tools", route: "/admin-dashboard/support" },
    ],
    consultantAdmin: [
      { label: "Consultant Dashboard Overview", route: "/admin-dashboard" },
      { label: "Project Timelines", route: "/admin-dashboard/projects" },
      { label: "Submit Deliverables", route: "/admin-dashboard/deliverables" },
      { label: "Messages", route: "/admin-dashboard/messages" },
    ],
    agentAdmin: [
      { label: "Agent Dashboard Overview", route: "/admin-dashboard" },
      { label: "Assigned Clients", route: "/admin-dashboard/clients" },
      { label: "Timeline View", route: "/admin-dashboard/timeline" },
      { label: "My Projects", route: "/admin-dashboard/projects" },
      { label: "Messages", route: "/admin-dashboard/messages" },
    ],
  };

  return role === "user" ? userMenu : adminMenu[role] || [];
};