import React, { useState } from 'react';
import { Users, Plus, Search, Filter, UserCheck, Shield, MoreVertical, Edit2, Ban, Eye } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockData';
import { User, UserRole } from '../../types';
import { Badge } from '../../components/ui/Badge';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState<User | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('FIELD_OFFICER');
  const [newRegion, setNewRegion] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${(users.length + 1).toString().padStart(3, '0')}`,
      name: newName,
      email: newEmail,
      role: newRole,
      region: newRegion,
      status: 'Active',
      lastActive: 'Just now',
    };
    setUsers([newUser, ...users]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewRegion('');
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;
    setUsers(
      users.map((u) => (u.id === selectedUserForEdit.id ? selectedUserForEdit : u))
    );
    setSelectedUserForEdit(null);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: (u.status === 'Active' ? 'Inactive' : 'Active') as 'Active' | 'Inactive' }
          : u
      )
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
            User &amp; Access Control Directory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage government administrators, GIS nodal officers, and field personnel.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold transition shadow-lg shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or regional jurisdiction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Official Name</th>
                <th className="py-3 px-4">Role Designation</th>
                <th className="py-3 px-4">Jurisdiction / Watershed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{user.name}</span>
                        <span className="text-[10px] text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold text-[10px]">
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {user.region}
                    {user.assignedWatershedName && (
                      <span className="block text-[10px] text-emerald-400">
                        {user.assignedWatershedName}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={user.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-400">{user.lastActive}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedUserForView(user)}
                      className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                      title="View details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedUserForEdit(user)}
                      className="p-1 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                      title="Edit user"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`p-1 transition cursor-pointer ${
                        user.status === 'Active'
                          ? 'text-slate-400 hover:text-rose-400'
                          : 'text-amber-400 hover:text-emerald-400'
                      }`}
                      title={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                    >
                      <Ban className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Details Modal */}
      {selectedUserForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm font-sans">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Official User Profile</h3>
              <button
                onClick={() => setSelectedUserForView(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Name &amp; ID</span>
                  <strong className="text-white text-sm">{selectedUserForView.name}</strong>
                  <span className="text-slate-400 block text-[11px]">ID: {selectedUserForView.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Email Address</span>
                  <span className="text-emerald-400">{selectedUserForView.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Role Designation</span>
                  <span className="text-slate-200 font-bold">{selectedUserForView.role.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Assigned Jurisdiction</span>
                  <span className="text-slate-300">{selectedUserForView.region}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Account Status</span>
                  <Badge status={selectedUserForView.status} size="sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUserForView(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm font-sans">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 font-mono">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Edit User &bull; {selectedUserForEdit.name}
            </h3>
            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.name}
                  onChange={(e) =>
                    setSelectedUserForEdit({ ...selectedUserForEdit, name: e.target.value })
                  }
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Role Type</label>
                <select
                  value={selectedUserForEdit.role}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="NORMAL_ADMIN">Normal Admin</option>
                  <option value="FIELD_OFFICER">Field Officer</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Regional Jurisdiction</label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.region}
                  onChange={(e) =>
                    setSelectedUserForEdit({ ...selectedUserForEdit, region: e.target.value })
                  }
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-mono border-b border-slate-800 pb-3">
              Add New User / Field Personnel
            </h3>
            <form onSubmit={handleAddUser} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. ramesh.c@rajasthan.gov.in"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Role Type</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="NORMAL_ADMIN">Normal Admin</option>
                  <option value="FIELD_OFFICER">Field Officer</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Regional Jurisdiction</label>
                <input
                  type="text"
                  required
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  placeholder="e.g. Rajasthan — Alwar Catchment"
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
