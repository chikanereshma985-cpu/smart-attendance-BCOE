import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Helper to initialize GoogleGenAI safely
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  }

  // 1. AI Attendance Analytics & Counseling Recommendations
  app.post('/api/ai/analyze-attendance', async (req, res) => {
    try {
      const { className, subject, threshold, students, sessionsCount } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback intelligent analysis when no key is set
        const defaulters = (students || []).filter((s: any) => (s.attendancePercentage || 0) < (threshold || 75));
        const avg = students?.length
          ? Math.round(students.reduce((acc: number, s: any) => acc + (s.attendancePercentage || 0), 0) / students.length)
          : 0;

        return res.json({
          success: true,
          analysis: {
            overallHealth: avg >= 75 ? 'Healthy' : avg >= 65 ? 'Moderate Risk' : 'Critical Deficit',
            classAverage: avg,
            defaulterCount: defaulters.length,
            summary: `Class attendance stands at ${avg}%. There are ${defaulters.length} students below the required ${threshold || 75}% threshold. Immediate counseling is recommended for students below 65%.`,
            actionableRecommendations: [
              'Schedule a mentor-mentee counseling session for students with <65% attendance before the upcoming unit tests.',
              'Send automated WhatsApp/Email alerts to parents of persistent defaulters.',
              'Conduct interactive problem-solving or quiz sessions to boost engagement on low-attendance days.',
              'Verify medical certificates and official sports duty leaves for flagged defaulters.'
            ],
            atRiskPatterns: defaulters.slice(0, 5).map((d: any) => ({
              rollNo: d.rollNo,
              name: d.name,
              percentage: d.attendancePercentage,
              riskLevel: d.attendancePercentage < 60 ? 'High' : 'Moderate',
              consecutiveAbsencesEstimate: Math.max(1, Math.round((sessionsCount || 10) * (1 - (d.attendancePercentage || 0) / 100)))
            }))
          },
          isMock: true
        });
      }

      const prompt = `You are a Senior Academic Dean and Attendance Analytics Expert at an engineering and arts university.
Analyze the following class attendance data:
Class: ${className}
Subject: ${subject}
Required Minimum Attendance: ${threshold || 75}%
Total Lectures Conducted: ${sessionsCount}
Student Records: ${JSON.stringify(students)}

Provide a structured JSON response with:
1. "overallHealth": "Healthy" | "Moderate Risk" | "Critical Deficit"
2. "classAverage": number (rounded)
3. "defaulterCount": number of students below threshold
4. "summary": A concise 2-3 sentence executive summary of class attendance health and risks
5. "actionableRecommendations": array of 4 concrete, actionable faculty recommendations
6. "atRiskPatterns": array of objects for the most at-risk students with keys:
   - "rollNo": string/number
   - "name": string
   - "percentage": number
   - "riskLevel": "High" | "Moderate" | "Critical"
   - "advice": short tip for this student to recover eligibility

Respond strictly in valid JSON format only, without markdown code block backticks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      }

      return res.json({ success: true, analysis: parsed, isMock: false });
    } catch (err: any) {
      console.error('Error analyzing attendance:', err);
      return res.status(500).json({ success: false, error: err.message || 'Analysis failed' });
    }
  });

  // 2. AI Formal Defaulter Notice & Parent Warning Letter Generator
  app.post('/api/ai/generate-defaulter-notice', async (req, res) => {
    try {
      const { student, className, subject, threshold, facultyName, collegeName, language = 'English' } = req.body;
      const ai = getGenAI();

      if (!ai) {
        const lang = language.toLowerCase();
        let letter = '';
        if (lang.includes('marathi')) {
          letter = `प्रति,
पालक / विद्यार्थी: ${student.name} (हजेरी क्र.: ${student.rollNo})
वर्ग: ${className} | विषय: ${subject}

विषय: अपुऱ्या हजेरीबाबत (Defaulter) चेतावणी पत्र

आदरणीय पालक,
आपणास कळविण्यात येते की, आपल्या पाल्याची सद्यस्थितीतील हजेरी फक्त ${student.attendancePercentage}% आहे, जी विद्यापीठाच्या नियमानुसार आवश्यक असणाऱ्या ${threshold}% हजेरीपेक्षा खूपच कमी आहे.

विद्यापीठाच्या नियमानुसार किमान ${threshold}% हजेरी अनिवार्य असून, हजेरी न सुधारल्यास सत्र परीक्षेचा हॉल तिकीट रोखला जाऊ शकतो.

कृपया त्वरित संबंधित वर्गशिक्षक किंवा विभागप्रमुखांशी संपर्क साधावा.

आपला नम्र,
${facultyName || 'प्राध्यापक / विभागप्रमुख'}
${collegeName || 'अभियांत्रिकी व तंत्रज्ञान महाविद्यालय'}`;
        } else {
          letter = `To,
Parent / Guardian of: ${student.name} (Roll No: ${student.rollNo})
Class: ${className} | Subject: ${subject}
Institution: ${collegeName || 'Institute of Technology & Science'}

SUBJECT: URGENT ATTENDANCE SHORTAGE WARNING (<${threshold}%)

Dear Parent/Guardian,

This is an official intimation regarding the unsatisfactory attendance of your ward, ${student.name}. 
Current Attendance Recorded: ${student.attendancePercentage}%
Required Minimum Attendance: ${threshold}%
Total Lectures Attended: ${student.attendedSessions} out of ${student.totalSessions} sessions.

As per university academic regulations, students with attendance below ${threshold}% are classified as defaulters and may be debarred from appearing in semester end examinations or submitting term work.

You are requested to meet the undersigned Faculty Advisor / Head of Department within 3 working days to discuss corrective remedial measures.

Yours sincerely,
${facultyName || 'Faculty In-Charge'}
Department of Computer Engineering & Science`;
        }

        return res.json({ success: true, noticeText: letter, isMock: true });
      }

      const prompt = `Draft a formal academic Defaulter Warning Letter to be sent to the parent of a student who is short of mandatory attendance.
Details:
- Student Name: ${student.name}
- Roll Number: ${student.rollNo}
- Class: ${className}
- Subject: ${subject}
- Total Sessions Conducted: ${student.totalSessions}
- Sessions Attended: ${student.attendedSessions}
- Attendance Percentage: ${student.attendancePercentage}%
- Mandatory Required Minimum: ${threshold}%
- Faculty In-Charge: ${facultyName || 'Prof. Faculty In-Charge'}
- Institution Name: ${collegeName || 'Engineering College'}
- Language requested: ${language} (support English, Marathi or bilingual as requested).

Include clear mention of university regulations, risk of detention/debarment from term-end exams, and an invitation for the parent to meet the faculty mentor.
Return only the formatted letter text suitable for direct printing or sending via Email/WhatsApp.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      return res.json({ success: true, noticeText: response.text, isMock: false });
    } catch (err: any) {
      console.error('Error generating notice:', err);
      return res.status(500).json({ success: false, error: err.message || 'Generation failed' });
    }
  });

  // 3. AI Roll Call Sheet / Paper Attendance OCR Scanner
  app.post('/api/ai/scan-roll-sheet', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', existingRolls = [] } = req.body;
      const ai = getGenAI();

      if (!imageBase64) {
        return res.status(400).json({ success: false, error: 'Image data is required' });
      }

      if (!ai) {
        // Mock fallback if no API key
        return res.json({
          success: true,
          presentRolls: existingRolls.slice(0, Math.ceil(existingRolls.length * 0.8)),
          absentRolls: existingRolls.slice(Math.ceil(existingRolls.length * 0.8)),
          notes: 'AI Key not configured; simulated 80% attendance recognized.',
          isMock: true
        });
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const prompt = `You are an AI Optical Document Reader specialized in student classroom attendance sheets.
Analyze this photo of an attendance roll list or classroom attendance sheet.
Known Roll Numbers in this class: ${JSON.stringify(existingRolls)}

Identify which roll numbers are marked Present (P, tick, checkmark, or present column) and which are marked Absent (A, cross, absent, or unmarked).
If the photo shows handwritten roll numbers or names, extract the matching roll numbers.

Respond strictly in valid JSON format:
{
  "presentRolls": [array of numbers or strings of roll numbers found present],
  "absentRolls": [array of numbers or strings of roll numbers found absent],
  "confidence": "high" | "medium" | "low",
  "detectionSummary": "Brief explanation of what was detected in the photo"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '{}';
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      }

      return res.json({ success: true, ...parsed, isMock: false });
    } catch (err: any) {
      console.error('Error scanning roll sheet:', err);
      return res.status(500).json({ success: false, error: err.message || 'Scanning failed' });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Attendance Dashboard Server running on http://localhost:${PORT}`);
  });
}

startServer();
