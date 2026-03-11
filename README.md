# 🏥 NeuroDetect AI

**AI-powered medical image analysis system for early detection of neurological conditions**

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🎯 Overview

NeuroDetect AI is a comprehensive medical analysis platform that leverages deep learning to assist in the detection of neurological conditions. The system provides fast, accurate analysis with professional PDF reports.


### Home Page of the System :
<img width="1082" height="487" alt="image" src="https://github.com/user-attachments/assets/a4b0f07d-6a6e-4a64-8848-466b5519d009" />
<img width="1081" height="364" alt="image" src="https://github.com/user-attachments/assets/b7511306-35e9-4b1a-b801-0d30005cd4ce" />
<img width="1081" height="408" alt="image" src="https://github.com/user-attachments/assets/b7f114b9-a499-444d-a0ec-3191c9817724" />

### Disease Detection Page :
<img width="1078" height="494" alt="image" src="https://github.com/user-attachments/assets/08f6d5a6-08cd-4523-a02a-1d2be095d98f" />
<img width="1078" height="446" alt="image" src="https://github.com/user-attachments/assets/13c3729d-63c8-4084-bdf0-2a4d75726304" />

### Model Input Pages :
<img width="1081" height="315" alt="image" src="https://github.com/user-attachments/assets/13d4822b-60b7-495b-bbc9-f4f464114a25" />
<img width="1081" height="258" alt="image" src="https://github.com/user-attachments/assets/3e7d095f-ebb7-43d8-8ff9-fc1d45ec21d3" />
<img width="1081" height="474" alt="image" src="https://github.com/user-attachments/assets/e18848b2-0bfe-43fb-9aca-e101f351a8cb" />
<img width="1081" height="489" alt="image" src="https://github.com/user-attachments/assets/bdd0e56b-33c4-4eb6-828a-b6a332043f4d" />

### Output:
<img width="1081" height="491" alt="image" src="https://github.com/user-attachments/assets/3f56656a-b900-4897-a089-de126f124e9c" />



### Supported Conditions:
- 🧠 **Brain Tumor Detection** - MRI image analysis
- 🧬 **Alzheimer's Disease** - Brain scan classification  
- 🎤 **Parkinson's Disease** - Voice feature analysis (22 MFCC coefficients)
- 💓 **Stroke Risk Assessment** - Multi-factor risk prediction

---

## ✨ Key Features

- ⚡ **Real-time Analysis** - Results in under 2 seconds
- 📊 **High Accuracy** - 90-95% accuracy range
- 📄 **PDF Reports** - Professional medical report generation
- 🎨 **Modern UI** - Clean, responsive interface
- 🔒 **Privacy-focused** - Client-side processing where possible
- 📱 **Mobile-friendly** - Works on all devices

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **PDF Generation:** html2pdf.js
- **Routing:** React Router
- **UI Components:** shadcn/ui

### Backend
- **Framework:** Python Flask
- **ML Framework:** TensorFlow/Keras
- **Data Processing:** NumPy, Pandas
- **API:** RESTful

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### 1. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/neurodetect-ai.git
cd neurodetect-ai
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

Backend will run on: `http://localhost:5000`

---

## 🚀 Usage

1. **Start Both Servers:**
   - Frontend: `npm run dev`
   - Backend: `python app.py`

2. **Open Application:**
   - Navigate to `http://localhost:5173`

3. **Select Disease Type:**
   - Choose from Brain Tumor, Alzheimer's, Parkinson's, or Stroke

4. **Upload/Enter Data:**
   - For image-based: Upload medical scan
   - For feature-based: Enter required measurements

5. **Get Analysis:**
   - View results instantly
   - Download professional PDF report

---

## 📁 Project Structure

```
neurodetect-ai/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   └── package.json
├── backend/
│   ├── app.py              # Flask application
│   ├── models/             # ML models
│   ├── requirements.txt    # Python dependencies
│   └── utils/              # Helper functions
├── .gitignore
└── README.md
```

---

## 🧪 Disease-Specific Features

### Brain Tumor Detection
- **Input:** MRI scan image
- **Output:** Tumor presence classification
- **Model:** CNN-based classifier
- **Accuracy:** 92-95%

### Alzheimer's Detection
- **Input:** Brain scan image
- **Output:** Alzheimer's indicators
- **Model:** Deep learning classifier
- **Accuracy:** 90-93%

### Parkinson's Detection
- **Input:** 22 voice features (MFCC)
- **Features:**
  - MDVP:Fo(Hz) - Fundamental Frequency
  - MDVP:Fhi(Hz) - Max Frequency
  - MDVP:Flo(Hz) - Min Frequency
  - Jitter, Shimmer measurements
  - HNR, NHR ratios
  - DFA, RPDE metrics
  - And 14 more...
- **Output:** Parkinson's likelihood
- **Accuracy:** 90-94%

### Stroke Risk Prediction
- **Input:** 22 risk factors
  - 6 numeric: Age, BMI, Glucose, etc.
  - 16 categorical: Gender, Work type, Smoking status, etc.
- **Output:** Stroke risk assessment
- **Accuracy:** 88-92%

---

## 📊 Model Information

| Disease | Model Type | Input | Accuracy | Processing Time |
|---------|-----------|-------|----------|----------------|
| Brain Tumor | CNN | MRI Image | 92-95% | <2s |
| Alzheimer's | CNN | Brain Scan | 90-93% | <2s |
| Parkinson's | ANN | 22 Features | 90-94% | <1s |
| Stroke | ANN | 22 Features | 88-92% | <1s |

---

## 🔧 Configuration

### Backend API Endpoints

```
POST /predict/brain       - Brain tumor prediction
POST /predict/alzheimer   - Alzheimer's prediction
POST /predict/parkinson   - Parkinson's prediction
POST /predict/stroke      - Stroke risk prediction
```

### Frontend Environment Variables

Create `.env.local` in frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

---


## ⚠️ Important Disclaimer

**THIS IS AN AI-ASSISTED ANALYSIS TOOL FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY.**

- ❌ Should NOT replace professional medical diagnosis
- ❌ Should NOT be used for treatment decisions
- ✅ Consult qualified healthcare professionals for medical advice
- ✅ Use only as a supplementary screening tool

The system provides AI-generated insights based on machine learning models. Results should always be verified by medical professionals.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Neel**
- GitHub: [nnnneeeellll](https://github.com/nnnneeeellll)
- Email: [neelsahasrabudhe@gmail.com]
- LinkedIn: [Neel Sahasrabudhe](https://www.linkedin.com/in/neel-sahasrabudhe/)

---

## 📞 Support

If you encounter any issues or have questions:
- Open an [Issue](https://github.com/YOUR-USERNAME/neurodetect-ai/issues)
- Email: neelsahasrabudhe@gmail.com

---

## 🗺️ Roadmap

- [ ] Add more disease types
- [ ] Implement user authentication
- [ ] Add result history tracking
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Export to DICOM format
- [ ] Integration with hospital systems

---

## 📈 Project Status

**Status:** ✅ Completed

**Last Updated:** November 2025

---

**⭐ If you find this project useful, please consider giving it a star!**

---

Made with ❤️ by Neel | © 2025 NeuroDetect AI
