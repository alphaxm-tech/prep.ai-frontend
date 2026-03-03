"use client";

import React, { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  X,
  ChevronDown,
  CheckCircle2,
  UserPlus,
  AlertCircle,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */
type RoleStatus = "Active" | "Inactive";

interface Role {
  id: string;
  name: string;
  description: string;
  assignedCount: number;
  status: RoleStatus;
  isDefault?: boolean;
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  department: string;
}

/* ─────────────────────────── Mock Data ─────────────────────── */
const defaultRoles: Role[] = [
  {
    id: "r1",
    name: "Faculty",
    description: "Teaching staff with access to student academic records and attendance management.",
    assignedCount: 42,
    status: "Active",
    isDefault: true,
  },
  {
    id: "r2",
    name: "Placement Officer",
    description: "Manages company drives, student applications, offer letters and recruiter coordination.",
    assignedCount: 5,
    status: "Active",
    isDefault: true,
  },
  {
    id: "r3",
    name: "Placement Assistant",
    description: "Assists placement officer with data entry, scheduling and student communication.",
    assignedCount: 3,
    status: "Active",
    isDefault: true,
  },
  {
    id: "r4",
    name: "HOD",
    description: "Head of Department — oversees branch-level academics and placement eligibility approvals.",
    assignedCount: 8,
    status: "Active",
    isDefault: true,
  },
  {
    id: "r5",
    name: "Dean",
    description: "Executive authority over inter-department placement policies and MoU approvals.",
    assignedCount: 2,
    status: "Active",
    isDefault: true,
  },
  {
    id: "r6",
    name: "Lab Coordinator",
    description: "Manages lab sessions, technical assessments and infrastructure for placement drives.",
    assignedCount: 0,
    status: "Inactive",
  },
];

const staffUsers: StaffUser[] = [
  { id: "u1", name: "Dr. Anjali Mehta", email: "anjali.mehta@college.edu", department: "CSE" },
  { id: "u2", name: "Prof. Rajesh Sharma", email: "rajesh.sharma@college.edu", department: "IT" },
  { id: "u3", name: "Priya Nair", email: "priya.nair@college.edu", department: "Placement Cell" },
  { id: "u4", name: "Suresh Kumar", email: "suresh.kumar@college.edu", department: "ECE" },
  { id: "u5", name: "Dr. Kavita Patel", email: "kavita.patel@college.edu", department: "Mechanical" },
  { id: "u6", name: "Amit Joshi", email: "amit.joshi@college.edu", department: "Placement Cell" },
  { id: "u7", name: "Neha Singh", email: "neha.singh@college.edu", department: "CSE" },
  { id: "u8", name: "Dr. Ravi Desai", email: "ravi.desai@college.edu", department: "Civil" },
];

/* ─────────────────────── Sub-components ──────────────────────── */

function StatusBadge({ status }: { status: RoleStatus }) {
  return status === "Active" ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 text-xs font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      Inactive
    </span>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-yellow-400" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ─────────────────────── Assign Modal ──────────────────────── */
function AssignRoleModal({
  role,
  onClose,
}: {
  role: Role;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(["u3", "u6"]);
  const [saved, setSaved] = useState(false);

  const filtered = staffUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-xl">
              <UserPlus className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Assign Role</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                <span className="font-semibold text-yellow-700">{role.name}</span> — select staff members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Currently Assigned Chips */}
        {selected.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Assigned ({selected.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.map((id) => {
                const user = staffUsers.find((u) => u.id === id);
                if (!user) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-xl text-xs font-semibold border border-yellow-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      {user.name[0]}
                    </span>
                    {user.name.split(" ")[0]} {user.name.split(" ").at(-1)?.[0]}.
                    <button onClick={() => toggle(id)} className="ml-0.5 hover:text-yellow-900 transition">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or department..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
            />
          </div>
        </div>

        {/* User List */}
        <div className="px-6 py-3 max-h-60 overflow-y-auto space-y-1">
          {filtered.map((user) => {
            const isSelected = selected.includes(user.id);
            return (
              <button
                key={user.id}
                onClick={() => toggle(user.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
                  isSelected
                    ? "bg-yellow-50 border border-yellow-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">
                  {user.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-medium">
                    {user.department}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-400">No staff found</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">{selected.length} user(s) selected</p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                saved
                  ? "bg-emerald-400 text-white"
                  : "bg-yellow-400 hover:bg-yellow-300 text-yellow-900"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Assign Role
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Delete Confirm Modal ──────────────── */
function DeleteModal({
  role,
  onConfirm,
  onCancel,
}: {
  role: Role;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Delete Role?</h3>
        <p className="text-sm text-gray-500 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">{role.name}</span>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);

  /* Create form state */
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [formError, setFormError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  /* Edit inline */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  /* Modals */
  const [assignRole, setAssignRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  /* Search */
  const [tableSearch, setTableSearch] = useState("");

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) {
      setFormError("Role name is required.");
      return;
    }
    if (roles.some((r) => r.name.toLowerCase() === newName.trim().toLowerCase())) {
      setFormError("A role with this name already exists.");
      return;
    }
    const newRole: Role = {
      id: `r${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || "No description provided.",
      assignedCount: 0,
      status: newActive ? "Active" : "Inactive",
    };
    setRoles((prev) => [newRole, ...prev]);
    setNewName("");
    setNewDesc("");
    setNewActive(true);
    setFormError("");
    setCreateSuccess(true);
    setTimeout(() => setCreateSuccess(false), 2000);
  };

  const handleDelete = (role: Role) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    setDeleteRole(null);
  };

  const startEdit = (role: Role) => {
    setEditingId(role.id);
    setEditName(role.name);
    setEditDesc(role.description);
  };

  const saveEdit = (id: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, name: editName.trim() || r.name, description: editDesc.trim() || r.description } : r
      )
    );
    setEditingId(null);
  };

  const toggleStatus = (id: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-yellow-600 uppercase mb-1">
              Access Control
            </p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Role Management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Create and assign college-specific roles to internal staff members
            </p>
          </div>

          {/* Summary chips */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-xl text-sm">
              <Shield className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-yellow-800">{roles.length}</span>
              <span className="text-yellow-600">Total Roles</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-sm">
              <Users className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-emerald-800">
                {roles.reduce((s, r) => s + r.assignedCount, 0)}
              </span>
              <span className="text-emerald-600">Staff Assigned</span>
            </div>
          </div>
        </div>

        {/* ── CREATE ROLE CARD ── */}
        <div className="bg-white/70 backdrop-blur-xl border border-yellow-100/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-xl">
              <Plus className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Create New Role</h2>
              <p className="text-xs text-gray-400">Define a custom role for your institution</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Role Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Role Name <span className="text-red-400">*</span>
              </label>
              <input
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setFormError(""); }}
                placeholder="e.g. Placement Coordinator"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Status
                </label>
                <div className="flex items-center gap-3 h-10">
                  <Toggle checked={newActive} onChange={() => setNewActive((v) => !v)} />
                  <span className={`text-sm font-semibold ${newActive ? "text-emerald-600" : "text-gray-400"}`}>
                    {newActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Description
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Briefly describe the responsibilities and access permissions for this role..."
                rows={3}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition resize-none"
              />
            </div>
          </div>

          {formError && (
            <p className="mt-3 text-xs font-medium text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {formError}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Predefined roles: Faculty, Placement Officer, Placement Assistant, HOD, Dean
            </p>
            <button
              onClick={handleCreate}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                createSuccess
                  ? "bg-emerald-400 text-white"
                  : "bg-yellow-400 hover:bg-yellow-300 text-yellow-900"
              }`}
            >
              {createSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Role Created
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Save Role
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── ROLES TABLE ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100">
                <Shield className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">Existing Roles</h2>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                {roles.length}
              </span>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Role Name", "Description", "Assigned Users", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Role Name */}
                    <td className="py-4 px-5">
                      {editingId === role.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 text-sm rounded-lg border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 w-full max-w-[180px]"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                            {role.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{role.name}</p>
                            {role.isDefault && (
                              <span className="text-[10px] text-yellow-600 font-medium">System Default</span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-4 px-5 max-w-xs">
                      {editingId === role.id ? (
                        <input
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="px-2 py-1 text-sm rounded-lg border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 w-full"
                        />
                      ) : (
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {role.description}
                        </p>
                      )}
                    </td>

                    {/* Assigned Count */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => setAssignRole(role)}
                        className="flex items-center gap-2 group/assign"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-800 group-hover/assign:text-yellow-700 transition-colors">
                          {role.assignedCount}
                        </span>
                        <span className="text-xs text-gray-400 group-hover/assign:text-yellow-500 transition-colors">
                          users
                        </span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={role.status === "Active"}
                          onChange={() => toggleStatus(role.id)}
                        />
                        <StatusBadge status={role.status} />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {editingId === role.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(role.id)}
                              className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-xs font-semibold transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setAssignRole(role)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-medium border border-yellow-100 transition"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              Assign
                            </button>
                            <button
                              onClick={() => startEdit(role)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteRole(role)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRoles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                      No roles match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {filteredRoles.length} of {roles.length} roles
            </p>
            <p className="text-xs text-gray-400">
              Click <strong className="text-gray-600">Assign</strong> or the user count to manage assignments
            </p>
          </div>
        </div>

      </div>

      {/* ── MODALS ── */}
      {assignRole && (
        <AssignRoleModal role={assignRole} onClose={() => setAssignRole(null)} />
      )}
      {deleteRole && (
        <DeleteModal
          role={deleteRole}
          onConfirm={() => handleDelete(deleteRole)}
          onCancel={() => setDeleteRole(null)}
        />
      )}
    </div>
  );
}
