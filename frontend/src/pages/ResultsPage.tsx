import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ResultState {
  detected: boolean;
  confidence: number;
  diseaseName: string;
  preview?: string;
  prediction?: string;
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { diseaseId } = useParams();

  const state = location.state as ResultState;

  if (!state) {
    navigate('/detect');
    return null;
  }

  const { detected, confidence, diseaseName, preview, prediction } = state;

  // ✅ FIXED: Handle both cases - if confidence is decimal (0-1) or percentage (0-100)
  const normalizedConfidence = confidence > 1 ? confidence : confidence * 100;
  const confidenceFormatted = normalizedConfidence.toFixed(2);

  // ✅ GENERATE PDF REPORT
  const handleDownloadReport = () => {
    const reportId = Math.random().toString(36).substring(2, 11).toUpperCase();
    const timestamp = new Date().toLocaleString();

    // Create professional HTML content for PDF
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 900px; color: #333;">
        
        <!-- HEADER SECTION -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2c3e50; padding-bottom: 25px;">
          <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">🏥 NeuroDetect AI</h1>
          <h2 style="color: #34495e; margin: 0 0 5px 0; font-size: 20px;">Medical Analysis Report</h2>
          <p style="color: #7f8c8d; margin: 5px 0; font-size: 12px;">Generated on ${timestamp}</p>
        </div>

        <!-- ANALYSIS SUMMARY SECTION -->
        <div style="margin-bottom: 30px; background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db;">
          <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">📋 Analysis Summary</h3>
          <table style="width: 100%; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Disease Type:</strong></td>
              <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${diseaseName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Analysis Date:</strong></td>
              <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Report ID:</strong></td>
              <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${reportId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Confidence Score:</strong></td>
              <td style="padding: 8px 0; color: #e74c3c; font-weight: 600;">${confidenceFormatted}%</td>
            </tr>
          </table>
        </div>

        <!-- DETECTION RESULT SECTION -->
        <div style="margin-bottom: 30px; padding: 20px; background-color: ${detected ? '#fadbd8' : '#d5f4e6'}; border-radius: 8px; border-left: 5px solid ${detected ? '#e74c3c' : '#27ae60'};">
          <h3 style="color: ${detected ? '#c0392b' : '#1e8449'}; margin-top: 0; font-size: 18px; font-weight: bold;">
            ${detected ? '⚠️ CONDITION DETECTED' : '✅ NO CONDITION DETECTED'}
          </h3>
          <p style="margin: 10px 0; color: ${detected ? '#a93226' : '#186a3b'}; line-height: 1.6;">
            ${detected 
              ? `The AI model has identified potential indicators of <strong>${diseaseName}</strong> with a confidence level of <strong>${confidenceFormatted}%</strong>. This result should be reviewed and confirmed by a qualified medical professional.`
              : `The AI model has not detected significant indicators of <strong>${diseaseName}</strong>. The analysis shows <strong>${confidenceFormatted}%</strong> confidence in this negative result.`
            }
          </p>
        </div>

        <!-- CONFIDENCE ANALYSIS SECTION -->
        <div style="margin-bottom: 30px; background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60;">
          <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">📊 Confidence Analysis</h3>
          
          <!-- Confidence Percentage -->
          <p style="margin: 15px 0 5px 0; color: #555;"><strong>AI Confidence Level:</strong> <span style="color: #e74c3c; font-size: 18px; font-weight: bold;">${confidenceFormatted}%</span></p>
          
          <!-- Progress Bar -->
          <div style="width: 100%; height: 28px; background-color: #ecf0f1; border-radius: 6px; overflow: hidden; margin: 12px 0; border: 1px solid #bdc3c7;">
            <div style="width: ${parseFloat(confidenceFormatted)}%; height: 100%; background: linear-gradient(90deg, ${parseFloat(confidenceFormatted) >= 70 ? '#e74c3c' : parseFloat(confidenceFormatted) >= 40 ? '#f39c12' : '#27ae60'}, ${parseFloat(confidenceFormatted) >= 70 ? '#c0392b' : parseFloat(confidenceFormatted) >= 40 ? '#e67e22' : '#229954'}); display: flex; align-items: center; justify-content: flex-end; color: white; font-weight: bold; padding-right: 12px; font-size: 13px;">
              ${confidenceFormatted}%
            </div>
          </div>
          
          <!-- Risk Level -->
          <p style="margin: 10px 0; font-size: 13px; color: #555;">
            <strong>Risk Assessment:</strong> 
            <span style="padding: 4px 12px; border-radius: 4px; background-color: ${
              parseFloat(confidenceFormatted) >= 70 ? '#fadbd8' : 
              parseFloat(confidenceFormatted) >= 40 ? '#fdebd0' : 
              '#d5f4e6'
            }; color: ${
              parseFloat(confidenceFormatted) >= 70 ? '#c0392b' : 
              parseFloat(confidenceFormatted) >= 40 ? '#b8741f' : 
              '#186a3b'
            }; font-weight: bold;">
              ${
                parseFloat(confidenceFormatted) >= 70 ? '🔴 HIGH RISK' : 
                parseFloat(confidenceFormatted) >= 40 ? '🟡 MODERATE RISK' : 
                '🟢 LOW RISK'
              }
            </span>
          </p>
        </div>

        <!-- CLASSIFICATION SECTION -->
        ${prediction ? `
          <div style="margin-bottom: 30px; background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #9b59b6;">
            <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px; border-bottom: 2px solid #9b59b6; padding-bottom: 10px;">🔍 Classification Result</h3>
            <p style="margin: 10px 0; color: #2c3e50; font-weight: 600; font-size: 15px;">${prediction}</p>
          </div>
        ` : ''}

        <!-- MEDICAL IMAGE SECTION -->
        ${preview ? `
          <div style="margin-bottom: 30px; background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #e67e22;">
            <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">📸 Analyzed Medical Image</h3>
            <div style="margin-top: 15px; text-align: center;">
              <img src="${preview}" alt="Medical Scan" style="max-width: 100%; height: auto; border-radius: 6px; border: 2px solid #bdc3c7; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            </div>
          </div>
        ` : ''}

        <!-- DISCLAIMER SECTION -->
        <div style="margin-bottom: 25px; padding: 18px; background-color: #fff3cd; border-radius: 8px; border-left: 5px solid #ffc107; border: 1px solid #ffc107;">
          <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.6;">
            <strong style="font-size: 14px;">⚠️ IMPORTANT MEDICAL DISCLAIMER</strong><br><br>
            This is an AI-assisted medical analysis provided for informational purposes only. <strong>It should NOT replace professional medical diagnosis or treatment.</strong> The results are generated using machine learning algorithms and may have limitations.<br><br>
            <strong>Please consult with a qualified healthcare professional for:</strong><br>
            • Confirmation of these results<br>
            • Proper medical diagnosis<br>
            • Treatment recommendations<br>
            • Medical advice and guidance
          </p>
        </div>

        <!-- SYSTEM INFORMATION SECTION -->
        <div style="margin-bottom: 25px; background-color: #ecf0f1; padding: 18px; border-radius: 8px;">
          <h3 style="color: #2c3e50; margin-top: 0; font-size: 14px; border-bottom: 1px solid #95a5a6; padding-bottom: 8px;">ℹ️ System Information</h3>
          <table style="width: 100%; font-size: 12px; margin-top: 10px;">
            <tr>
              <td style="padding: 6px 0; color: #555;">Model Type:</td>
              <td style="padding: 6px 0; color: #2c3e50; font-weight: 600;">Deep Learning Neural Network</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">Accuracy Range:</td>
              <td style="padding: 6px 0; color: #2c3e50; font-weight: 600;">90-95%</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">Processing Time:</td>
              <td style="padding: 6px 0; color: #2c3e50; font-weight: 600;">&lt; 2 seconds</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">System:</td>
              <td style="padding: 6px 0; color: #2c3e50; font-weight: 600;">NeuroDetect AI v1.0</td>
            </tr>
          </table>
        </div>

        <!-- FOOTER SECTION -->
        <div style="border-top: 2px solid #bdc3c7; padding-top: 20px; text-align: center; color: #7f8c8d; font-size: 11px;">
          <p style="margin: 5px 0;"><strong>NeuroDetect AI - Medical Analysis Platform</strong></p>
          <p style="margin: 5px 0;">© 2025 NeuroDetect AI. All Rights Reserved.</p>
          <p style="margin: 5px 0;">This report is confidential and intended for authorized medical professionals only.</p>
          <p style="margin: 5px 0; font-size: 10px;">Report Generated: ${timestamp} | Report ID: ${reportId}</p>
        </div>
      </div>
    `;

    // ✅ PDF Configuration
    const options = {
      margin: [10, 10, 10, 10],
      filename: `${diseaseName.replace(/\s+/g, '-')}-report-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      },
      jsPDF: { 
        orientation: 'portrait', 
        unit: 'mm', 
        format: 'a4',
        compress: true
      },
    };

    // ✅ Generate and Download PDF
    html2pdf().set(options).from(htmlContent).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Background Animation */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_50%)] opacity-5" />
      </div>

      <div className="relative container mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/detect')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Detection
        </Button>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* Left Column - Result Status */}
          <Card
            className={`border-l-4 ${
              detected
                ? 'border-l-red-500 bg-red-50/5'
                : 'border-l-green-500 bg-green-50/5'
            }`}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                {detected ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                )}
                <div>
                  <CardTitle className="text-2xl">
                    {detected ? '⚠️ Condition Detected' : '✅ No Condition Detected'}
                  </CardTitle>
                  <CardDescription>
                    AI analysis complete for {diseaseName}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Confidence Score - Progress Bar */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    AI Confidence Level
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {confidenceFormatted}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${parseFloat(confidenceFormatted)}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={`h-full rounded-full transition-colors ${
                      detected
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                  />
                </div>
              </div>

              {/* Prediction Details */}
              <div className="space-y-2 rounded-lg bg-gray-900/30 p-4">
                <p className="text-sm text-muted-foreground">
                  Classification Result
                </p>
                <p className="text-lg font-semibold">
                  {prediction || (detected ? 'Positive' : 'Negative')}
                </p>
              </div>

              {/* Analysis Summary */}
              <div className="space-y-2 rounded-lg bg-blue-900/20 p-4">
                <p className="text-sm font-medium text-blue-200">
                  Analysis Summary
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  The AI model has analyzed the medical scan with{' '}
                  <span className="font-semibold text-blue-300">
                    {confidenceFormatted}% confidence
                  </span>
                  . {detected ? 
                    `Potential indicators of ${diseaseName} have been detected.` :
                    `No significant indicators of ${diseaseName} detected.`
                  }
                </p>
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-900/10 p-3">
                <p className="text-xs text-yellow-200 leading-relaxed">
                  ⚠️ <strong>Important:</strong> This is an AI-assisted analysis
                  and should not replace professional medical diagnosis. Please
                  consult with a qualified healthcare professional for
                  confirmation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Image Preview */}
          {preview && (
            <Card className="relative">
              <CardHeader>
                <CardTitle>📸 Analyzed Scan</CardTitle>
                <CardDescription>Uploaded medical image</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  src={preview}
                  alt="Medical scan"
                  className="h-auto w-full rounded-lg border border-gray-700"
                />
                
                {/* ✅ FIXED: Bottom-right snackbar with correct formatted confidence */}
                <div className="absolute bottom-4 right-4 z-20 rounded-lg bg-gray-900/80 px-5 py-4 text-white shadow-2xl shadow-black/70 backdrop-blur-md">
                  <div className="mb-1 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-bold">Analysis complete</span>
                  </div>
                  <div className="text-sm">
                    Confidence: {confidenceFormatted}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <Button
            onClick={handleDownloadReport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report (PDF)
          </Button>

          <Button onClick={() => navigate('/detect')} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>

          <Button onClick={() => navigate('/')} variant="ghost">
            Back to Home
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 rounded-lg bg-gray-900/30 p-6"
        >
          <h3 className="mb-4 text-lg font-semibold">About This Analysis</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Model Type</p>
              <p className="font-medium">Deep Learning Neural Network</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy Range</p>
              <p className="font-medium">90-95%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Analysis Time</p>
              <p className="font-medium">Less than 2 seconds</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}