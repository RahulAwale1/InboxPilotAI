import Link from "next/link";
import SignOutButton from "./SignOutButton";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Jobs", href: "/jobs" },
  { label: "Logs", href: "/logs" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-[#561C24] text-[#E8D8C4] p-6 flex flex-col justify-between">
      <div>
        <div className="mb-10">
          <h1 className="text-2xl font-bold">InboxPilot AI</h1>
          <p className="text-sm text-[#C7B7A3] mt-2">
            Email workflow assistant
          </p>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-4 py-3 hover:bg-[#6D2932] transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="pt-6">
        <SignOutButton />
      </div>
    </aside>
  );
}