import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  Calendar,
  Building2,
  Award,
  Layers,
  Sparkles,
  Check,
  Table
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAttendance } from '../context/AttendanceContext';
import { BharatCollegeLogo } from './BharatCollegeLogo';

interface ExcelPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelPdfReportModal: React.FC<ExcelPdfReportModalProps> = ({ isOpen, onClose }) => {
  const {
    activeClass,
    activeDepartment,
    activeClassStudentStats,
    activeClassRecords,
    defaulterThreshold,
    currentFaculty
  } = useAttendance();

  const [reportType, setReportType] = useState<'excel' | 'pdf'>('excel');
  const [includePractical, setIncludePractical] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate Excel (.xls) file with formatted XML Spreadsheet content
  const handleDownloadExcel = () => {
    const today = new Date().toLocaleDateString('en-GB');

    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="12"/>
   <Interior ss:Color="#0369A1" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SubHeader">
   <Font ss:Bold="1" ss:Color="#1E293B" ss:Size="10"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Defaulter">
   <Font ss:Bold="1" ss:Color="#BE123C"/>
   <Interior ss:Color="#FFE4E6" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="Normal">
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Center">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Attendance Register">
  <Table>
   <Column ss:Width="60"/>
   <Column ss:Width="180"/>
   <Column ss:Width="100"/>
   <Column ss:Width="60"/>
   <Column ss:Width="70"/>
   <Column ss:Width="70"/>
   <Column ss:Width="70"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>

   <Row ss:Height="25">
    <Cell ss:MergeAcross="8" ss:StyleID="Header"><Data ss:Type="String">BHARAT COLLEGE OF ENGINEERING, BADLAPUR (WEST) - ATTENDANCE REGISTER</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="8" ss:StyleID="SubHeader"><Data ss:Type="String">Department: ${activeDepartment.name} | Class: ${activeClass.name} | Faculty: ${currentFaculty.name} | Date: ${today}</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Roll No</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Student Name</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">PRN ID</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Batch</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Attended</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Conducted</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Theory %</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Practical %</Data></Cell>
    <Cell ss:StyleID="SubHeader"><Data ss:Type="String">Combined %</Data></Cell>
   </Row>`;

    activeClassStudentStats.forEach(st => {
      const isDefaulter = st.percentage < defaulterThreshold;
      xml += `
   <Row>
    <Cell ss:StyleID="Center"><Data ss:Type="Number">${st.student.rollNo}</Data></Cell>
    <Cell ss:StyleID="Normal"><Data ss:Type="String">${st.student.name}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${st.student.prn}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${st.student.batch || 'T1'}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="Number">${st.attendedSessions}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="Number">${st.totalSessions}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${st.theoryPercentage}%</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${st.practicalPercentage}%</Data></Cell>
    <Cell ss:StyleID="${isDefaulter ? 'Defaulter' : 'Center'}"><Data ss:Type="String">${st.percentage}%</Data></Cell>
   </Row>`;
    });

    xml += `
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BCOE_Attendance_Report_${activeClass.name.replace(/\s+/g, '_')}_${today.replace(/\//g, '-')}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('Excel report downloaded successfully (.xls)!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Trigger formatted browser print to PDF
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-indigo-900/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-indigo-950 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">Export Official Excel &amp; PDF Reports</h3>
              <p className="text-xs text-slate-300 font-mono">
                {activeClass.name} · {activeDepartment.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm">
          
          {/* Format Selector Pills */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-950">
            <button
              onClick={() => setReportType('excel')}
              className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                reportType === 'excel'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Microsoft Excel Report (.XLS)</span>
            </button>

            <button
              onClick={() => setReportType('pdf')}
              className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                reportType === 'pdf'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Official Printable PDF Report</span>
            </button>
          </div>

          {/* Excel Preview & Options */}
          {reportType === 'excel' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-3">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Excel Spreadsheet Export Features:</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Formulated columns: Roll No, Full Name, PRN ID, Lab Batch, Sessions Attended vs Conducted</li>
                  <li>Automated breakdown of Theory Attendance % vs Practical Lab Attendance %</li>
                  <li>Conditional styling: Highlights defaulters below 75% in distinct warning colors</li>
                  <li>Directly compatible with Microsoft Excel, Google Sheets, LibreOffice Calc, and Apple Numbers</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  Enrolled Students: {activeClassStudentStats.length} Records
                </span>

                <button
                  onClick={handleDownloadExcel}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Excel File (.xls)</span>
                </button>
              </div>
            </div>
          )}

          {/* PDF Preview & Print Layout */}
          {reportType === 'pdf' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0b1329] border border-slate-200 dark:border-indigo-950 space-y-4">
                
                {/* Official Letterhead Mockup */}
                <div className="text-center pb-3 border-b border-slate-200 dark:border-indigo-950 space-y-1">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-tight">
                    Bharat College of Engineering, Badlapur (West)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Affiliated to University of Mumbai · Approved by AICTE, New Delhi · DTE Code: 3436
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Department of {activeDepartment.name} · Official Attendance Dossier &amp; Exam Clearance Register
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-slate-600 dark:text-slate-300">
                  <span>Class: <strong>{activeClass.name}</strong></span>
                  <span>Faculty: <strong>{currentFaculty.name}</strong></span>
                  <span>Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></span>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>
                    <strong>Mumbai University Ordinance 6086:</strong> Minimum 75% attendance is strictly compulsory for semester examination eligibility.
                  </p>
                  <p className="text-[11px]">
                    Includes HOD certification seal, faculty verification block, and individual student percentages.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-mono">
                  Ready for print or Save as PDF
                </span>

                <button
                  onClick={handlePrintPDF}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          )}

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs text-center border border-emerald-300 dark:border-emerald-800 animate-fade-in">
              {downloadSuccess}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
