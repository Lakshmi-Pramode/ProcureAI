import { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';

interface OfficerUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'officer' | 'auditor' | 'evaluator';
  department: string;
  status: 'active' | 'suspended';
  lastActive: string;
}

const initialUsers: OfficerUser[] = [
  {
    id: 'usr-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@procurement.gov.in',
    role: 'officer',
    department: 'Chennai Petroleum Corp - IT Procurement',
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: 'usr-2',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@procurement.gov.in',
    role: 'evaluator',
    department: 'Technical Evaluation Committee',
    status: 'active',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr-3',
    name: 'Anand Verma, IA&AS',
    email: 'anand.verma@cag.gov.in',
    role: 'auditor',
    department: 'Comptroller & Auditor General of India',
    status: 'active',
    lastActive: '1 day ago',
  },
  {
    id: 'usr-4',
    name: 'Suresh Ramanathan',
    email: 'suresh.r@gem.gov.in',
    role: 'admin',
    department: 'GeM Platform Administration',
    status: 'active',
    lastActive: '3 days ago',
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'officer' | 'evaluator' | 'auditor'>('officer');
  const [newUserDept, setNewUserDept] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: OfficerUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept || 'Procurement Cell',
      status: 'active',
      lastActive: 'Invited',
    };

    setUsers(prev => [newUser, ...prev]);
    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Official User Management & Access Control"
        subtitle="Manage procurement officers, committee evaluators, and CAG audit observers"
        breadcrumbs={[{ label: 'Users' }]}
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Officer
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search officer, email, department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <span className="text-xs font-semibold text-text-tertiary">
          Total: {filteredUsers.length} Officials
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase">Official</th>
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase">Role & Access</th>
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase">Department / Organization</th>
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface-secondary/50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{u.name}</p>
                        <p className="text-[11px] text-text-tertiary">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'officer' ? 'bg-primary-50 text-primary-700' :
                      u.role === 'auditor' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary">
                    {u.department}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-compliant">
                      <span className="w-2 h-2 rounded-full bg-compliant" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text-tertiary">
                    {u.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Officer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-text-primary">Add Procurement Official</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-tertiary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Official Email (.gov.in / .nic.in)</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="name@gov.in"
                  className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Assigned Role</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value="officer">Procurement Officer (Evaluate & Verify)</option>
                  <option value="evaluator">Technical Committee Evaluator</option>
                  <option value="auditor">Auditor / Vigilance Observer (Read-Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Department / Organization</label>
                <input
                  type="text"
                  value={newUserDept}
                  onChange={e => setNewUserDept(e.target.value)}
                  placeholder="e.g. CPCL Mechanical Procurement"
                  className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-secondary rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
