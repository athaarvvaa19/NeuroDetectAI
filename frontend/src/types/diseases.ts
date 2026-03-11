export interface Disease {
  id: string;
  name: string;
  description: string;
  scanType: string;
  icon: string;
}

export const diseases: Disease[] = [
  {
    id: "brain-tumor",
    name: "Brain Tumor",
    description: "Detect early signs of brain tumors using deep learning",
    scanType: "MRI Scan",
    icon: "Brain",
  },
  {
    id: "alzheimers",
    name: "Alzheimer's Disease",
    description: "Identify early markers of Alzheimer's disease",
    scanType: "MRI Scan",
    icon: "BrainCog",
  },
  {
    id: "parkinsons",
    name: "Parkinson's Disease",
    description: "Detect indicators of Parkinson's disease",
    scanType: "Brain Scan",
    icon: "Activity",
  },
  {
    id: "stroke",
    name: "Stroke Prediction",
    description: "Predict stroke risk with advanced AI",
    scanType: "MRI / CT Scan",
    icon: "Heart",
  },
  {
    id: "meningioma",
    name: "Meningioma",
    description: "Detect meningioma tumors with high accuracy",
    scanType: "MRI Scan",
    icon: "ScanEye",
  },
];
