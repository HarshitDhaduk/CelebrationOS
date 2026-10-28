import React, { useState } from 'react';
import { Vendor, VendorChecklist, BudgetCategory, Currency, EventProject, VendorStatus } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { formatCurrency } from '../../utils/budgetEngine';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../data/industryBenchmarks';
import {
  Briefcase,
  Mail,
  Phone,
  FileCheck,
  CheckCircle2,
  Plus,
  Wand2,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface VendorManagerProps {
  project: EventProject;
  currency: Currency;
  onUpdateVendors: (vendors: Vendor[]) => void;
  onUpdateChecklist: (checklist: VendorChecklist[]) => void;
}

export const VendorManager: React.FC<VendorManagerProps> = ({
  project,
  currency,
  onUpdateVendors,
  onUpdateChecklist,
}) => {
  const { vendors, vendorChecklist, event } = project;

  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [isRfpModalOpen, setIsRfpModalOpen] = useState(false);
  const [isAddChecklistModalOpen, setIsAddChecklistModalOpen] = useState(false);

  // RFP Generator State
  const [rfpCategory, setRfpCategory] = useState<BudgetCategory>('catering');
  const [rfpVendorName, setRfpVendorName] = useState<string>('Prospective Vendor Team');
  const [rfpTargetBudget, setRfpTargetBudget] = useState<number>(3000);
  const [generatedRfp, setGeneratedRfp] = useState<string>('');
  const [copiedRfp, setCopiedRfp] = useState<boolean>(false);

  // New Vendor Form
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    category: 'catering',
    status: 'researching',
    contactPerson: '',
    email: '',
    phone: '',
    quotedPrice: 0,
    depositPaid: 0,
    contractSigned: false,
    notes: '',
  });

  // New Checklist Form
  const [newChecklistItem, setNewChecklistItem] = useState<Partial<VendorChecklist>>({
    vendorCategory: 'venue',
    title: '',
    description: '',
    completed: false,
  });

  const handleToggleChecklist = (id: string) => {
    const updated = vendorChecklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateChecklist(updated);
  };

  const handleDeleteChecklist = (id: string) => {
    onUpdateChecklist(vendorChecklist.filter((c) => c.id !== id));
  };

  const handleDeleteVendor = (id: string) => {
    onUpdateVendors(vendors.filter((v) => v.id !== id));
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name) return;

    const v: Vendor = {
      id: `custom-v-${Date.now()}`,
      name: newVendor.name,
      category: (newVendor.category as BudgetCategory) || 'other',
      status: (newVendor.status as VendorStatus) || 'researching',
      contactPerson: newVendor.contactPerson || '',
      email: newVendor.email || '',
      phone: newVendor.phone || '',
      quotedPrice: Number(newVendor.quotedPrice) || 0,
      depositPaid: Number(newVendor.depositPaid) || 0,
      contractSigned: Boolean(newVendor.contractSigned),
      notes: newVendor.notes || '',
    };

    onUpdateVendors([...vendors, v]);
    setIsAddVendorModalOpen(false);
    setNewVendor({
      name: '',
      category: 'catering',
      status: 'researching',
      contactPerson: '',
      email: '',
      phone: '',
      quotedPrice: 0,
      depositPaid: 0,
      contractSigned: false,
      notes: '',
    });
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistItem.title) return;

    const item: VendorChecklist = {
      id: `custom-vc-${Date.now()}`,
      vendorCategory: (newChecklistItem.vendorCategory as BudgetCategory) || 'venue',
      title: newChecklistItem.title,
      description: newChecklistItem.description || '',
      completed: false,
    };

    onUpdateChecklist([...vendorChecklist, item]);
    setIsAddChecklistModalOpen(false);
    setNewChecklistItem({
      vendorCategory: 'venue',
      title: '',
      description: '',
      completed: false,
    });
  };

  const handleGenerateRfp = () => {
    const categoryName = CATEGORY_LABELS[rfpCategory] || rfpCategory;
    const emailDraft = `Subject: Inquiry: ${categoryName} Services for ${event.title} (${event.date})

Dear ${rfpVendorName},

I hope this email finds you well!

We are currently in the active planning stages for "${event.title}", a ${event.eventType} taking place on ${event.date} at ${event.location}. We are expecting approximately ${event.guestCount} guests and are aiming for an overall vibe of "${event.vibe}".

Having followed your exceptional work in the region, we would love to check your availability for this date and explore collaborating with your team.

Here are a few specific details about our requirements:
- Service Needed: ${categoryName}
- Target Budget Range: ${formatCurrency(rfpTargetBudget, currency)}
- Guest Count: ${event.guestCount} attendees
- Event Date: ${event.date}

Could you please confirm if your team is available on ${event.date}? If so, we would appreciate it if you could share:
1. Your 2026 service package guide and pricing tiers.
2. Standard deposit and cancellation terms.
3. Any specific venue load-in, staging, or power requirements your team requires.

Thank you so much for your time and guidance. We look forward to hearing from you!

Warm regards,
Event Planning Team
${event.title}`;

    setGeneratedRfp(emailDraft);
  };

  const handleCopyRfp = () => {
    navigator.clipboard.writeText(generatedRfp);
    setCopiedRfp(true);
    setTimeout(() => setCopiedRfp(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-rose-500" />
            Vendor Management & Inquiry Hub
          </h3>
          <p className="text-xs text-slate-500">
            Track inquiries, booked contracts, and generate AI-crafted vendor RFP emails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              handleGenerateRfp();
              setIsRfpModalOpen(true);
            }}
            icon={<Wand2 className="w-3.5 h-3.5 text-amber-500" />}
          >
            Generate RFP Inquiry
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddVendorModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => {
          const catColor = CATEGORY_COLORS[vendor.category];
          const isBooked = vendor.status === 'booked' || vendor.status === 'completed';

          return (
            <Card key={vendor.id} className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      catColor?.bg || 'bg-slate-100'
                    } ${catColor?.text || 'text-slate-700'}`}
                  >
                    {CATEGORY_LABELS[vendor.category] || vendor.category}
                  </span>

                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      vendor.status === 'booked'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : vendor.status === 'quoted'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {vendor.name}
                </h4>

                {vendor.contactPerson && (
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Contact: {vendor.contactPerson}
                  </p>
                )}

                {/* Contact details */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {vendor.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${vendor.email}`} className="hover:underline truncate">
                        {vendor.email}
                      </a>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                </div>

                {vendor.notes && (
                  <p className="mt-3 text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{vendor.notes}"
                  </p>
                )}
              </div>

              {/* Financial & Contract Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Quoted Price:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {vendor.quotedPrice ? formatCurrency(vendor.quotedPrice, currency) : 'TBD'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Deposit Paid:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {vendor.depositPaid ? formatCurrency(vendor.depositPaid, currency) : '$0'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[11px]">
                    <FileCheck
                      className={`w-3.5 h-3.5 ${
                        vendor.contractSigned ? 'text-emerald-500' : 'text-slate-400'
                      }`}
                    />
                    <span className={vendor.contractSigned ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                      {vendor.contractSigned ? 'Contract Signed' : 'Pending Contract'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded"
                    title="Delete vendor"
                    aria-label={`Delete ${vendor.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Vendor Compliance & Verification Checklist */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Vendor Due Diligence & Logistics Checklist
            </h4>
            <p className="text-xs text-slate-500">
              Contract requirements, sound ordinances, power, and dietary verifications
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddChecklistModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Checklist Item
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vendorChecklist.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                item.completed
                  ? 'bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <button
                  onClick={() => handleToggleChecklist(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                  aria-label={`Toggle ${item.title}`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      item.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                    }`}
                  />
                </button>
                <div>
                  <p
                    className={`text-xs font-bold text-slate-900 dark:text-white ${
                      item.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteChecklist(item.id)}
                className="text-slate-300 hover:text-red-500 transition-colors shrink-0 p-1"
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Vendor RFP Email Generator Modal */}
      <Modal
        isOpen={isRfpModalOpen}
        onClose={() => setIsRfpModalOpen(false)}
        title="GenAI Vendor RFP & Inquiry Generator"
        description="Draft a professional, customized vendor outreach email tailored to your exact dates, guest count, and budget."
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Vendor Category
              </label>
              <select
                value={rfpCategory}
                onChange={(e) => setRfpCategory(e.target.value as BudgetCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                value={rfpVendorName}
                onChange={(e) => setRfpVendorName(e.target.value)}
                placeholder="e.g. Apex Catering Team"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Target Budget ({currency})
              </label>
              <input
                type="number"
                value={rfpTargetBudget}
                onChange={(e) => setRfpTargetBudget(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleGenerateRfp}
              icon={<Wand2 className="w-3.5 h-3.5 text-amber-500" />}
            >
              Regenerate Email
            </Button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Generated Inquiry Email Draft
              </label>
              <button
                onClick={handleCopyRfp}
                className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
              >
                {copiedRfp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRfp ? 'Copied to Clipboard!' : 'Copy Email'}</span>
              </button>
            </div>
            <textarea
              rows={11}
              readOnly
              value={generatedRfp}
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsRfpModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyRfp}
              icon={<Copy className="w-3.5 h-3.5" />}
            >
              {copiedRfp ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={isAddVendorModalOpen}
        onClose={() => setIsAddVendorModalOpen(false)}
        title="Add Vendor Partner"
        description="Record vendor contact details, contract status, and quoted price."
        maxWidth="md"
      >
        <form onSubmit={handleAddVendor} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Vendor / Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pacific Coast Florals, DJ Nexus"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newVendor.category}
                onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as BudgetCategory })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={newVendor.status}
                onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value as VendorStatus })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="researching">Researching</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="booked">Booked (Hired)</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Contact Person
              </label>
              <input
                type="text"
                placeholder="e.g. Maria Chen"
                value={newVendor.contactPerson}
                onChange={(e) => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. (555) 234-5678"
                value={newVendor.phone}
                onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. booking@pacificflorals.com"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Quoted Price ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={newVendor.quotedPrice || ''}
                onChange={(e) => setNewVendor({ ...newVendor, quotedPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Deposit Paid ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={newVendor.depositPaid || ''}
                onChange={(e) => setNewVendor({ ...newVendor, depositPaid: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="contractSigned"
              checked={newVendor.contractSigned}
              onChange={(e) => setNewVendor({ ...newVendor, contractSigned: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="contractSigned" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
              Contract signed & executed
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddVendorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Vendor
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Checklist Modal */}
      <Modal
        isOpen={isAddChecklistModalOpen}
        onClose={() => setIsAddChecklistModalOpen(false)}
        title="Add Vendor Checklist Task"
        description="Create a verification or due-diligence action item."
        maxWidth="md"
      >
        <form onSubmit={handleAddChecklist} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Checklist Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Confirm generator wattage with venue manager"
              value={newChecklistItem.title}
              onChange={(e) => setNewChecklistItem({ ...newChecklistItem, title: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={newChecklistItem.vendorCategory}
              onChange={(e) => setNewChecklistItem({ ...newChecklistItem, vendorCategory: e.target.value as BudgetCategory })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {Object.entries(CATEGORY_LABELS).map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Verify sound level meter restrictions for outdoor amps."
              value={newChecklistItem.description}
              onChange={(e) => setNewChecklistItem({ ...newChecklistItem, description: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddChecklistModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Add Task
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
