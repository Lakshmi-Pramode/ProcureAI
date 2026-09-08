import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Plus, Trash2, Check } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { useToast } from '../contexts/ToastContext';

const defaultRequirements = [
  { id: '1', name: 'GST Registration', mandatory: true, verification: 'Document' },
  { id: '2', name: 'PAN Card', mandatory: true, verification: 'Document' },
  { id: '3', name: 'MSME/Udyam Registration', mandatory: false, verification: 'Document' },
  { id: '4', name: 'Minimum Annual Turnover', mandatory: true, verification: 'Financial' },
  { id: '5', name: 'Experience Certificate', mandatory: true, verification: 'Document' },
  { id: '6', name: 'Technical Compliance', mandatory: true, verification: 'Technical' },
  { id: '7', name: 'Company Registration', mandatory: true, verification: 'Document' },
  { id: '8', name: 'Income Tax Returns (3 years)', mandatory: true, verification: 'Financial' },
  { id: '9', name: 'Non-Blacklisting Declaration', mandatory: true, verification: 'Declaration' },
  { id: '10', name: 'ISO Certification', mandatory: true, verification: 'Document' },
];

import { api } from '../services/api';

export default function CreateTender() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', tenderId: '', department: '', category: 'IT', description: '', deadline: '',
  });
  const [requirements, setRequirements] = useState(defaultRequirements);
  const [newReq, setNewReq] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const addRequirement = () => {
    if (!newReq.trim()) return;
    setRequirements(prev => [...prev, { id: `new_${Date.now()}`, name: newReq, mandatory: true, verification: 'Document' }]);
    setNewReq('');
  };

  const removeRequirement = (id: string) => {
    setRequirements(prev => prev.filter(r => r.id !== id));
  };

  const toggleMandatory = (id: string) => {
    setRequirements(prev => prev.map(r => r.id === id ? { ...r, mandatory: !r.mandatory } : r));
  };

  const handleCreate = async () => {
    if (!form.title) {
      addToast('error', 'Validation Error', 'Tender title is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.tenders.create({
        title: form.title,
        department: form.department || 'Procurement Division',
        category: (form.category as any) || 'IT',
        description: form.description || '',
        submissionDeadline: form.deadline ? new Date(form.deadline).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
        requirements: requirements.map((r, i) => ({
          id: `req_${Date.now()}_${i}`,
          tenderId: '',
          requirementId: `R${String(i + 1).padStart(3, '0')}`,
          description: r.name,
          category: 'Legal',
          condition: `Must satisfy ${r.name} specifications`,
          mandatory: r.mandatory,
          sourcePage: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
      });
      addToast('success', 'Tender Created', 'Tender has been created and published successfully.');
      navigate('/tenders');
    } catch (err) {
      addToast('error', 'Error Creating Tender', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Create New Tender"
        subtitle="Set up a new tender for bid evaluation"
        breadcrumbs={[
          { label: 'Tenders', to: '/tenders' },
          { label: 'Create Tender' },
        ]}
      />

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: 'Tender Information' },
          { n: 2, label: 'Eligibility Requirements' },
          { n: 3, label: 'Review & Submit' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-3 flex-1 p-3 rounded-xl border transition-all ${
              step === s.n ? 'border-primary-300 bg-primary-50' :
              step > s.n ? 'border-compliant-border bg-compliant-bg' : 'border-border bg-surface'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                step > s.n ? 'bg-compliant text-white' :
                step === s.n ? 'bg-primary-600 text-white' : 'bg-surface-tertiary text-text-tertiary'
              }`}>
                {step > s.n ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-sm font-medium ${step >= s.n ? 'text-text-primary' : 'text-text-tertiary'}`}>{s.label}</span>
            </div>
            {i < 2 && <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />}
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border p-6">
        {/* Step 1: Tender Information */}
        {step === 1 && (
          <div className="max-w-2xl space-y-5">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Tender Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1.5">Tender Title *</label>
                <input value={form.title} onChange={e => updateField('title', e.target.value)} placeholder="Enter tender title"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Tender ID</label>
                <input value={form.tenderId} onChange={e => updateField('tenderId', e.target.value)} placeholder="e.g. CPCL/IT/2026/001"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Department *</label>
                <input value={form.department} onChange={e => updateField('department', e.target.value)} placeholder="e.g. Information Technology"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Category *</label>
                <select value={form.category} onChange={e => updateField('category', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition">
                  {['IT', 'Construction', 'Healthcare', 'Defense', 'Education', 'Infrastructure', 'Services', 'Goods'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Submission Deadline *</label>
                <input type="date" value={form.deadline} onChange={e => updateField('deadline', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={4} placeholder="Describe the tender..."
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition resize-none" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Eligibility Requirements</h3>
            <p className="text-sm text-text-secondary mb-6">Define the eligibility requirements that bidders must satisfy.</p>

            <div className="flex items-center gap-3 mb-4">
              <input value={newReq} onChange={e => setNewReq(e.target.value)} placeholder="Add new requirement..."
                onKeyDown={e => e.key === 'Enter' && addRequirement()}
                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition" />
              <button onClick={addRequirement} className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {requirements.map(req => (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-secondary transition-colors group">
                  <span className="flex-1 text-sm font-medium text-text-primary">{req.name}</span>
                  <button onClick={() => toggleMandatory(req.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      req.mandatory ? 'bg-non-compliant-bg text-non-compliant' : 'bg-surface-tertiary text-text-tertiary'
                    }`}>
                    {req.mandatory ? 'MANDATORY' : 'OPTIONAL'}
                  </button>
                  <span className="text-xs text-text-tertiary">{req.verification}</span>
                  <button onClick={() => removeRequirement(req.id)} className="text-text-tertiary hover:text-non-compliant transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-text-primary mb-6">Review & Submit</h3>
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-surface-secondary border border-border">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Tender Information</h4>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-text-tertiary text-xs">Title</dt><dd className="font-medium">{form.title || '—'}</dd></div>
                  <div><dt className="text-text-tertiary text-xs">Tender ID</dt><dd className="font-medium">{form.tenderId || '—'}</dd></div>
                  <div><dt className="text-text-tertiary text-xs">Department</dt><dd className="font-medium">{form.department || '—'}</dd></div>
                  <div><dt className="text-text-tertiary text-xs">Category</dt><dd className="font-medium">{form.category}</dd></div>
                  <div><dt className="text-text-tertiary text-xs">Deadline</dt><dd className="font-medium">{form.deadline || '—'}</dd></div>
                </dl>
                {form.description && <p className="text-sm text-text-secondary mt-3 pt-3 border-t border-border">{form.description}</p>}
              </div>
              <div className="p-4 rounded-xl bg-surface-secondary border border-border">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Requirements ({requirements.length})</h4>
                <div className="space-y-1.5">
                  {requirements.map(r => (
                    <div key={r.id} className="flex items-center gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-compliant" />
                      <span className="text-text-primary">{r.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.mandatory ? 'bg-non-compliant-bg text-non-compliant' : 'bg-surface-tertiary text-text-tertiary'}`}>
                        {r.mandatory ? 'MANDATORY' : 'OPTIONAL'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleCreate} disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-compliant rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
              <Check className="w-4 h-4" /> {isSubmitting ? 'Creating Tender...' : 'Create Tender'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
