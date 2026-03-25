import { httpClient } from "@/lib/httpClient";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Users, Search } from "lucide-react";
import AdminUserActions from "./AdminUserActions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  let users: any[] = [];

  try {
    const response = await httpClient.get<any>("/users", {
      params: {
        role: params.role || "",
        status: params.status || "",
        search: params.search || "",
        page: params.page || "1",
        limit: "20",
      },
    });
    users = response?.data?.users || response?.data || [];
  } catch {
    users = [];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          All Users
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {users.length} users found
        </p>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3">
        <input
          type="text"
          name="search"
          defaultValue={params.search || ""}
          placeholder="Search by name or email..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          name="role"
          defaultValue={params.role || ""}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="OWNER">Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          name="status"
          defaultValue={params.status || ""}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Search className="w-4 h-4" />
          Filter
        </button>
      </form>

      {/* Table */}
      {users.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    User
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Joined
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <AdminUserActions
                        userId={user.id}
                        status={user.status}
                        role={user.role}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}