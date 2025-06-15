import {
  Home,
  FolderKanban,
  FileText,
  Receipt,
  MessageCircle,
  LifeBuoy,
  Users,
  UserCog,
  Briefcase,
  Wrench,
  ClipboardList,
  UserCheck,
  CalendarCheck,
  FileCheck2,
  User2,
} from "lucide-react";

export const getMenuByRole = (role) => {
  const userMenu = [
    { label: "Home", route: "/dashboard", icon: Home },
    { label: "My Projects", route: "/dashboard/myprojects", icon: FolderKanban },
    { label: "Reports", route: "/dashboard/reports", icon: FileText },
    { label: "Expenses", route: "/dashboard/expenses", icon: Receipt },
    { label: "Messages", route: "/dashboard/messages", icon: MessageCircle },
    { label: "Support", route: "/dashboard/support", icon: LifeBuoy },
  ];

  const adminMenu = {
    systemAdmin: [
      { label: "Dashboard Overview", route: "/admin-dashboard", icon: Home },
      { label: "User Management", route: "/admin-dashboard/users", icon: Users },
      { label: "Staff Management", route: "/admin-dashboard/staff", icon: UserCog },
      { label: "Support Tools", route: "/admin-dashboard/support", icon: LifeBuoy },
    ],
    consultantAdmin: [
      { label: "Dashboard Overview", route: "/admin-dashboard", icon: Home },
      { label: "Project Timelines", route: "/admin-dashboard/projects", icon: ClipboardList },
      { label: "Submit Deliverables", route: "/admin-dashboard/deliverables", icon: FileCheck2 },
      { label: "Messages", route: "/admin-dashboard/messages", icon: MessageCircle },
    ],
    agentAdmin: [
      { label: "Dashboard Overview", route: "/admin-dashboard", icon: Home },
      { label: "Assigned Clients", route: "/admin-dashboard/clients", icon: UserCheck },
      { label: "Timeline View", route: "/admin-dashboard/timeline", icon: CalendarCheck },
      { label: "My Projects", route: "/admin-dashboard/projects", icon: FolderKanban },
      { label: "Messages", route: "/admin-dashboard/messages", icon: MessageCircle },
    ],
  };

  return role === "user" ? userMenu : adminMenu[role] || [];
};