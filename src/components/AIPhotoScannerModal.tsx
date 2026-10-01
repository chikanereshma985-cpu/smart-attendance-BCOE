import React, { useState, useRef } from 'react';
import { useAttendance } from '../context/AttendanceContext';
import { X, Camera, Upload, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface AIPhotoScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanned: (presentRolls: (string | number)[], absentRolls: (string | number)[]) => void;
}

export const AIPhotoScannerModal: React.FC<AIPhotoScannerModalProps> = ({
  isOpen,
  onClose,
  onScanned
}) => {
  const { activeClassStudents, activeClass } = useAttendance();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{
    presentRolls: (string | number)[];
    absentRolls: (string | number)[];
    detectionSummary?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setScanResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setError(null);

    try {
      const knownRolls = activeClassStudents.map(s => s.rollNo);

      const res = await fetch('/api/ai/scan-roll-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          existingRolls: knownRolls
        })
      });

      const data = await res.json();
      if (data.success) {
        setScanResult({
          presentRolls: data.presentRolls || [],
          absentRolls: data.absentRolls || [],
          detectionSummary: data.detectionSummary || 'Paper sheet successfully analyzed by Gemini Optical Reader.'
        });
      } else {
        setError(data.error || 'Failed to scan image.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with AI vision server.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!scanResult) return;
    onScanned(scanResult.presentRolls, scanResult.absentRolls);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                AI Paper Attendance Sheet Scanner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Snap or upload a photo of your paper roll sheet to auto-mark
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Box */}
        <div className="space-y-4">
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-all space-y-3"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  Click to snap or upload paper roll sheet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG photo of handwritten ticks/crosses or classroom roll sheet
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-64 bg-slate-950">
                <img
                  src={imagePreview}
                  alt="Attendance Sheet Preview"
                  className="w-full h-full object-contain mx-auto max-h-64"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setScanResult(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!scanResult && (
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Reading Sheet with Gemini Vision...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract Attendance with AI</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Preview */}
          {scanResult && (
            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>AI Optical Recognition Complete!</span>
              </div>

              <p className="text-slate-600 dark:text-slate-300">
                {scanResult.detectionSummary}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div className="p-2 rounded-lg bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <div className="font-bold text-[10px] uppercase font-sans">Present Rolls ({scanResult.presentRolls.length})</div>
                  <div className="truncate mt-0.5">{scanResult.presentRolls.join(', ') || 'None'}</div>
                </div>

                <div className="p-2 rounded-lg bg-rose-100/70 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                  <div className="font-bold text-[10px] uppercase font-sans">Absent Rolls ({scanResult.absentRolls.length})</div>
                  <div className="truncate mt-0.5">{scanResult.absentRolls.join(', ') || 'None'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          {scanResult && (
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply to Today&apos;s Attendance</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
