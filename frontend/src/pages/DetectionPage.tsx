import { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Upload,
  FileImage,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { diseases } from '@/types/diseases';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';


interface DetectionState {
  detected: boolean;
  confidence: number;
  diseaseName: string;
  preview?: string;
  prediction?: string;
}


// ========================================
// ✅ PARKINSON'S: 22 FEATURES WITH ACTUAL DATASET NAMES
// ========================================


const diseaseConfigs: Record<
  string,
  {
    type: 'image' | 'form';
    fields?: { name: string; label: string; placeholder: string; type?: string }[];
    endpoint: string;
  }
> = {
  'brain-tumor': {
    type: 'image',
    endpoint: '/predict/brain',
  },
  alzheimers: {
    type: 'image',
    endpoint: '/predict/alzheimer',
  },
  // ✅ PARKINSON'S: 22 FEATURES - UPDATED WITH ACTUAL DATASET NAMES
  parkinsons: {
    type: 'form',
    endpoint: '/predict/parkinson',
    fields: [
      { name: 'MDVP:Fo(Hz)', label: '1. MDVP:Fo(Hz) - Fundamental Frequency (Hz)', placeholder: 'e.g., 119.99', type: 'number' },
      { name: 'MDVP:Fhi(Hz)', label: '2. MDVP:Fhi(Hz) - Max Fundamental Frequency (Hz)', placeholder: 'e.g., 157.30', type: 'number' },
      { name: 'MDVP:Flo(Hz)', label: '3. MDVP:Flo(Hz) - Min Fundamental Frequency (Hz)', placeholder: 'e.g., 74.99', type: 'number' },
      { name: 'MDVP:Jitter(%)', label: '4. MDVP:Jitter(%) - Jitter Percentage', placeholder: 'e.g., 0.00784', type: 'number' },
      { name: 'MDVP:Jitter(Abs)', label: '5. MDVP:Jitter(Abs) - Absolute Jitter', placeholder: 'e.g., 0.00007', type: 'number' },
      { name: 'MDVP:RAP', label: '6. MDVP:RAP - Relative Average Perturbation', placeholder: 'e.g., 0.00370', type: 'number' },
      { name: 'MDVP:PPQ', label: '7. MDVP:PPQ - Period Perturbation Quotient', placeholder: 'e.g., 0.00554', type: 'number' },
      { name: 'Jitter:DDP', label: '8. Jitter:DDP - Jitter Delta Divide by Delta', placeholder: 'e.g., 0.01109', type: 'number' },
      { name: 'MDVP:Shimmer', label: '9. MDVP:Shimmer - Shimmer Variation', placeholder: 'e.g., 0.04374', type: 'number' },
      { name: 'MDVP:Shimmer(dB)', label: '10. MDVP:Shimmer(dB) - Shimmer in dB', placeholder: 'e.g., 0.42600', type: 'number' },
      { name: 'Shimmer:APQ3', label: '11. Shimmer:APQ3 - Amplitude Perturbation Q3', placeholder: 'e.g., 0.02182', type: 'number' },
      { name: 'Shimmer:APQ5', label: '12. Shimmer:APQ5 - Amplitude Perturbation Q5', placeholder: 'e.g., 0.03130', type: 'number' },
      { name: 'MDVP:APQ', label: '13. MDVP:APQ - MDVP Amplitude Perturbation', placeholder: 'e.g., 0.02971', type: 'number' },
      { name: 'Shimmer:DDA', label: '14. Shimmer:DDA - Shimmer Delta Divide by Delta', placeholder: 'e.g., 0.06545', type: 'number' },
      { name: 'NHR', label: '15. NHR - Noise-to-Harmonics Ratio', placeholder: 'e.g., 0.02211', type: 'number' },
      { name: 'HNR', label: '16. HNR - Harmonics-to-Noise Ratio', placeholder: 'e.g., 21.03', type: 'number' },
      { name: 'RPDE', label: '17. RPDE - Recurrence Period Density Entropy', placeholder: 'e.g., 0.41478', type: 'number' },
      { name: 'DFA', label: '18. DFA - Detrended Fluctuation Analysis', placeholder: 'e.g., 0.81529', type: 'number' },
      { name: 'spread1', label: '19. spread1 - Nonlinear Measure 1', placeholder: 'e.g., -4.81303', type: 'number' },
      { name: 'spread2', label: '20. spread2 - Nonlinear Measure 2', placeholder: 'e.g., 0.26648', type: 'number' },
      { name: 'D2', label: '21. D2 - Correlation Dimension', placeholder: 'e.g., 2.30144', type: 'number' },
      { name: 'PPE', label: '22. PPE - Pitch Period Entropy', placeholder: 'e.g., 0.28465', type: 'number' },
    ],
  },
  // ✅ STROKE: 22 FEATURES (6 numeric + 16 one-hot encoded)
  stroke: {
    type: 'form',
    endpoint: '/predict/stroke',
    fields: [
      // ===== 6 NUMERIC FEATURES =====
      { name: 'age', label: '1. Age (years)', placeholder: 'e.g., 45', type: 'number' },
      { name: 'hypertension', label: '2. Hypertension (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'heart_disease', label: '3. Heart Disease (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'avg_glucose_level', label: '4. Avg Glucose Level', placeholder: 'e.g., 125.5', type: 'number' },
      { name: 'bmi', label: '5. BMI (kg/m²)', placeholder: 'e.g., 25.5', type: 'number' },
      { name: 'additional_numeric', label: '6. Additional Numeric', placeholder: 'Enter value', type: 'number' },
      
      // ===== 16 ONE-HOT ENCODED FEATURES =====
      { name: 'gender_Female', label: '7. Gender_Female (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'gender_Male', label: '8. Gender_Male (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'gender_Other', label: '9. Gender_Other (0/1)', placeholder: '0 or 1', type: 'number' },
      
      { name: 'ever_married_No', label: '10. Ever_Married_No (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'ever_married_Yes', label: '11. Ever_Married_Yes (0/1)', placeholder: '0 or 1', type: 'number' },
      
      { name: 'work_type_Govt_job', label: '12. Work_Type_Govt_job (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'work_type_Never_worked', label: '13. Work_Type_Never_worked (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'work_type_Private', label: '14. Work_Type_Private (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'work_type_Self_employed', label: '15. Work_Type_Self-employed (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'work_type_children', label: '16. Work_Type_children (0/1)', placeholder: '0 or 1', type: 'number' },
      
      { name: 'residence_type_Rural', label: '17. Residence_Type_Rural (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'residence_type_Urban', label: '18. Residence_Type_Urban (0/1)', placeholder: '0 or 1', type: 'number' },
      
      { name: 'smoking_status_Unknown', label: '19. Smoking_Status_Unknown (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'smoking_status_formerly_smoked', label: '20. Smoking_Status_Formerly_Smoked (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'smoking_status_never_smoked', label: '21. Smoking_Status_Never_Smoked (0/1)', placeholder: '0 or 1', type: 'number' },
      { name: 'smoking_status_smokes', label: '22. Smoking_Status_Smokes (0/1)', placeholder: '0 or 1', type: 'number' },
    ],
  },
  meningioma: {
    type: 'image',
    endpoint: '/predict/brain',
  },
};


export default function DetectionPage() {
  const { diseaseId } = useParams<{ diseaseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { predict, loading, error } = useApi();


  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});


  const disease = diseases.find((d) => d.id === diseaseId);
  const config = diseaseId ? diseaseConfigs[diseaseId] : null;


  const descriptionMemo = useMemo(() => {
    if (!config || config.type !== 'form') return null;
    const descriptions: Record<string, string> = {
      parkinsons: 'Enter 22 voice measurement features (MFCC coefficients)',
      stroke: 'Enter 22 stroke risk features (6 numeric + 16 one-hot encoded categorical)',
    };
    return descriptions[diseaseId] || 'Enter the required information';
  }, [config, diseaseId]);


  if (!disease || !config) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate('/detect')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className="border-red-500/20 bg-red-950/10">
          <CardHeader>
            <CardTitle className="text-red-500">❌ Disease Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested detection type is not available.</p>
            <Button onClick={() => navigate('/detect')} className="mt-4" variant="outline">
              Choose Another Disease
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  // ========================================
  // IMAGE UPLOAD HANDLERS
  // ========================================


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };


  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024;


    if (!validTypes.includes(file.type)) {
      toast({
        title: '❌ Invalid file type',
        description: 'Please upload JPG, PNG, or GIF image',
        variant: 'destructive',
      });
      return false;
    }


    if (file.size > maxSize) {
      toast({
        title: '❌ File too large',
        description: 'Maximum file size is 10MB',
        variant: 'destructive',
      });
      return false;
    }


    return true;
  };


  const processImageFile = (selectedFile: File) => {
    if (!validateImageFile(selectedFile)) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(selectedFile);
    toast({
      title: '✅ Image selected',
      description: 'Ready to analyze. Click "Analyze" to proceed.',
    });
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };


  // ========================================
  // FORM HANDLERS
  // ========================================


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const validateFormData = (): boolean => {
    if (!config.fields || config.fields.length === 0) return true;


    const missingFields = config.fields.filter(
      (field) => !formData[field.name] || formData[field.name].trim() === ''
    );


    if (missingFields.length > 0) {
      toast({
        title: '❌ Missing fields',
        description: `Please fill in all ${config.fields.length} required fields`,
        variant: 'destructive',
      });
      return false;
    }


    const invalidFields = config.fields.filter((field) => {
      const value = formData[field.name];
      return isNaN(parseFloat(value));
    });


    if (invalidFields.length > 0) {
      toast({
        title: '❌ Invalid values',
        description: 'All fields must contain valid numbers',
        variant: 'destructive',
      });
      return false;
    }


    return true;
  };


  // ========================================
  // ✅ PREDICTION HANDLERS
  // ========================================


  const handleAnalyzeImage = async () => {
    if (!file) {
      toast({
        title: '❌ No image selected',
        description: 'Please select an image to analyze',
        variant: 'destructive',
      });
      return;
    }


    const formDataToSend = new FormData();
    formDataToSend.append('image', file);


    toast({
      title: '🔄 Analyzing image...',
      description: 'Please wait while we process your image',
    });


    const result = await predict(config.endpoint, formDataToSend);


    if (result) {
      const detectionState: DetectionState = {
        detected: result.prediction?.is_tumor ?? result.prediction?.is_alzheimer ?? false,
        confidence: result.confidence ?? 0,
        diseaseName: disease.name,
        preview,
        prediction: result.prediction?.class,
      };


      toast({
        title: '✅ Analysis complete',
        description: `Confidence: ${((result.confidence ?? 0) * 100).toFixed(2)}%`,
      });


      navigate(`/results/${diseaseId}`, { state: detectionState });
    } else {
      toast({
        title: '❌ Analysis failed',
        description: error || 'Failed to process image. Please try again.',
        variant: 'destructive',
      });
    }
  };


  // ✅ FIXED: Handle form submission with 22 features for stroke & parkinson
  const handleAnalyzeForm = async () => {
    if (!validateFormData()) {
      return;
    }


    let features: number[] = [];


    if (diseaseId === 'stroke') {
      // ✅ STROKE: Convert to exactly 22 features in correct order
      features = [
        parseFloat(formData.age),                              // 0
        parseFloat(formData.hypertension),                     // 1
        parseFloat(formData.heart_disease),                    // 2
        parseFloat(formData.avg_glucose_level),                // 3
        parseFloat(formData.bmi),                              // 4
        parseFloat(formData.additional_numeric),               // 5
        parseFloat(formData.gender_Female),                    // 6
        parseFloat(formData.gender_Male),                      // 7
        parseFloat(formData.gender_Other),                     // 8
        parseFloat(formData.ever_married_No),                  // 9
        parseFloat(formData.ever_married_Yes),                 // 10
        parseFloat(formData.work_type_Govt_job),               // 11
        parseFloat(formData.work_type_Never_worked),           // 12
        parseFloat(formData.work_type_Private),                // 13
        parseFloat(formData.work_type_Self_employed),          // 14
        parseFloat(formData.work_type_children),               // 15
        parseFloat(formData.residence_type_Rural),             // 16
        parseFloat(formData.residence_type_Urban),             // 17
        parseFloat(formData.smoking_status_Unknown),           // 18
        parseFloat(formData.smoking_status_formerly_smoked),   // 19
        parseFloat(formData.smoking_status_never_smoked),      // 20
        parseFloat(formData.smoking_status_smokes),            // 21
      ];
    } else if (diseaseId === 'parkinsons') {
      // ✅ PARKINSON'S: Use all features in order with actual dataset names
      features = config.fields?.map((field) =>
        parseFloat(formData[field.name])
      ) || [];
    } else {
      // Fallback for other form-based diseases
      features = config.fields?.map((field) =>
        parseFloat(formData[field.name])
      ) || [];
    }


    toast({
      title: '🔄 Processing...',
      description: 'Analyzing your medical data',
    });


    console.log('📤 Sending features:', features);
    console.log('📊 Feature count:', features.length);


    const result = await predict(config.endpoint, { features });


    if (result) {
      const detectionState: DetectionState = {
        detected:
          result?.prediction?.is_positive ??
          result?.prediction?.stroke_risk ??
          false,
        confidence: result?.confidence ?? 0,
        diseaseName: disease.name,
        prediction: result?.prediction?.classification,
      };


      toast({
        title: '✅ Analysis complete',
        description: `Confidence: ${((result?.confidence ?? 0) * 100).toFixed(2)}%`,
      });


      navigate(`/results/${diseaseId}`, { state: detectionState });
    } else {
      toast({
        title: '❌ Analysis failed',
        description: error || 'Failed to process data. Please try again.',
        variant: 'destructive',
      });
    }
  };


  // ========================================
  // RENDER IMAGE UPLOAD UI
  // ========================================


  if (config.type === 'image') {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate('/detect')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>


        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>🖼️ {disease.name} Detection</CardTitle>
              <CardDescription>Upload a medical image for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative mb-6 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                  aria-label="Upload medical image"
                />


                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg object-cover" />
                    <p className="text-sm text-green-600">✅ Image selected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium">Drag and drop your medical image here</p>
                    <p className="text-xs text-gray-500">or click to browse (JPG, PNG, GIF - Max 10MB)</p>
                  </div>
                )}
              </div>


              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/30 dark:text-blue-200"
                  >
                    <FileImage className="mb-2 inline h-4 w-4" />
                    <span className="ml-2">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>


              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-900 dark:bg-red-950/30 dark:text-red-200"
                >
                  <AlertCircle className="mb-2 inline h-4 w-4" />
                  <span className="ml-2">{error}</span>
                </motion.div>
              )}


              <div className="flex gap-3">
                <Button onClick={handleAnalyzeImage} disabled={!file || loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </Button>
                {file && (
                  <Button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    variant="outline"
                    disabled={loading}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }


  // ========================================
  // RENDER FORM UI (FOR PARKINSON'S & STROKE)
  // ========================================


  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate('/detect')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>


      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>📋 {disease.name} Assessment</CardTitle>
            <CardDescription>{descriptionMemo}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {config.fields?.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="text-xs font-medium">
                    {field.label}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="any"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={handleFormChange}
                    disabled={loading}
                    className="h-9 text-sm"
                    aria-label={field.label}
                  />
                </div>
              ))}
            </div>


            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-900 dark:bg-red-950/30 dark:text-red-200"
              >
                <AlertCircle className="mb-2 inline h-4 w-4" />
                <span className="ml-2">{error}</span>
              </motion.div>
            )}


            <div className="flex gap-3">
              <Button onClick={handleAnalyzeForm} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Get Analysis
                  </>
                )}
              </Button>
              <Button onClick={() => setFormData({})} variant="outline" disabled={loading}>
                Clear Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}