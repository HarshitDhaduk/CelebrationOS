import React, { useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { EventProject } from '../../types';
import { downloadIcsFile } from '../../services/calendarExport';
import { exportProjectAsJson } from '../../services/storage';
import { isValidProjectJson } from '../../utils/security';
import { Calendar, Download, Printer, Upload, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: EventProject;
  onImportProject: (imported: EventProject) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  onImportProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (isValidProjectJson(parsed)) {
          onImportProject(parsed);
          onClose();
        } else {
          alert('Invalid CelebrationOS project file schema. Please upload a valid exported plan.');
        }
      } catch {
        alert('Could not parse JSON file. Ensure the file contains valid JSON formatting.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export & Sync Hub"
      description="Download calendars, print executive briefs, or backup event datasets."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Calendar Export */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                iCalendar Schedule (.ICS)
              </h4>
              <p className="text-xs text-slate-500">
                Sync {project.runOfShow.length} run-of-show events to Google Calendar or Apple iCal.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadIcsFile(project)}
            icon={<Download className="w-4 h-4" />}
          >
            Export .ICS
          </Button>
        </div>

        {/* Print / PDF Brief */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Print / Save as PDF
              </h4>
              <p className="text-xs text-slate-500">
                Generate clean printable document of budget, timeline, and vendor checklists.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            icon={<FileText className="w-4 h-4" />}
          >
            Print Brief
          </Button>
        </div>

        {/* JSON Backup Export */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Backup Project (.JSON)
              </h4>
              <p className="text-xs text-slate-500">
                Full export of your event, budget items, vendors, and creative concepts.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportProjectAsJson(project)}
            icon={<Download className="w-4 h-4" />}
          >
            Download
          </Button>
        </div>

        {/* JSON Import */}
        <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Restore Project
              </h4>
              <p className="text-xs text-slate-500">
                Import a previously saved CelebrationOS plan file.
              </p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload JSON
          </Button>
        </div>
      </div>
    </Modal>
  );
};
