import {
  Menu,
  Settings,
  ShoppingBag,
  Users,
  FileText,
  Video,
  FileQuestion,
  User,
  LogOut,
  CalendarCheck,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useDisclosure } from "@heroui/modal";
import ConfirmModal from "../modals/ConfirmModal";
import { useAuth } from "../../context/AuthContext";

const SIDEBAR_ITEMS = [
  { name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
  { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Employee", icon: User, color: "#10B981", href: "/employee" },
  { name: "Videos", icon: Video, color: "#3B82F6", href: "/videos" },
  { name: "DietPdf", icon: FileText, color: "#3B82F6", href: "/diet-pdf" },
  {
    name: "Questions",
    icon: FileQuestion,
    color: "#3B82F6",
    href: "/questions",
  },
  { name: "Logout", icon: LogOut, color: "#6EE7B7" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    onClose();
    navigate("/sign-in");
  };
  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.name} to={item.href}>
              <motion.div
                onClick={() => {
                  if (item.name == "Logout") {
                    onOpen();
                  }
                }}
                className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
              >
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.1, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleLogout}
        title="Are you sure you want to logout?"
      />
    </motion.div>
  );
};
export default Sidebar;
