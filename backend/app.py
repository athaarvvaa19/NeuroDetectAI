from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import pickle
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CORS(app, 
     resources={r"/predict/*": {
         "origins": ["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080"],
         "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "max_age": 3600
     }},
     expose_headers=["Content-Type"],
     allow_headers=["Content-Type"]
)

models_status = {
    'brain': False,
    'parkinson': False,
    'stroke': False,
    'alzheimer': False
}

try:
    brain_model = load_model("models/brain_tumor_detection_model.h5")
    models_status['brain'] = True
    print("Brain Tumor model loaded successfully")
except Exception as e:
    print(f"Error loading Brain Tumor model: {e}")
    brain_model = None

try:
    parkinson_model = load_model("models/parkinsons_model.h5")
    models_status['parkinson'] = True
    print("Parkinson's model loaded successfully")
except Exception as e:
    print(f"Error loading Parkinson's model: {e}")
    parkinson_model = None

stroke_model = None
try:
    stroke_model = load_model("models/stroke.h5")
    models_status['stroke'] = True
    print("Stroke model loaded successfully (expects 22 features)")
except Exception as e:
    print(f"Error loading Stroke model: {e}")
    stroke_model = None

try:
    alzheimer_model = load_model("models/alzheimer_model_best.keras")
    models_status['alzheimer'] = True
    print("Alzheimer's model loaded successfully (expects 96x96 images)")
except Exception as e:
    print(f"Error loading Alzheimer's model: {e}")
    alzheimer_model = None

def is_valid_image_extension(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def success_response(model_name, prediction, confidence=None, additional_data=None):
    response = {
        'status': 'success',
        'model': model_name,
        'prediction': prediction,
        'confidence': confidence,
        'timestamp': datetime.now().isoformat()
    }
    if additional_data:
        response.update(additional_data)
    return jsonify(response)

def error_response(message, status_code=400):
    return jsonify({
        'status': 'error',
        'message': message,
        'timestamp': datetime.now().isoformat()
    }), status_code

@app.before_request
def check_file_size():
    if request.method == "OPTIONS":
        return "", 200
    
    if request.content_length and request.content_length > MAX_FILE_SIZE:
        return error_response('File too large. Maximum size is 10MB', 413)

@app.route('/')
def home():
    return jsonify({
        "message": "NeuroDetect AI Backend is running successfully!",
        "status": "online",
        "models": models_status,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/predict/brain', methods=['POST', 'OPTIONS'])
def predict_brain():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        if not models_status['brain'] or brain_model is None:
            return error_response('Brain tumor model not loaded', 503)
        
        if 'image' not in request.files:
            return error_response('No image file provided', 400)
        
        file = request.files['image']
        
        if file.filename == '':
            return error_response('No image selected', 400)
        
        if not is_valid_image_extension(file.filename):
            return error_response('Invalid file type. Only JPG, PNG, GIF allowed', 400)
        
        original_filename = secure_filename(file.filename)
        filename = f"{uuid.uuid4()}_{original_filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        file.save(file_path)
        
        try:
            img = image.load_img(file_path, target_size=(150, 150))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = img_array / 255.0
            
            prediction = brain_model.predict(img_array, verbose=0)
            
            class_names = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']
            predicted_class_idx = np.argmax(prediction[0])
            predicted_class = class_names[predicted_class_idx]
            confidence = float(np.max(prediction[0])) * 100
            
            all_predictions = {
                class_names[i]: float(prediction[0][i]) * 100
                for i in range(len(class_names))
            }
            
            is_tumor_detected = predicted_class != 'No Tumor'
            
            print(f"Brain Prediction: {predicted_class}, Confidence: {confidence:.2f}%")
            
            return success_response(
                'brain_tumor_detection',
                {
                    'class': predicted_class,
                    'is_tumor': is_tumor_detected,
                    'confidence': confidence
                },
                confidence,
                {'all_predictions': all_predictions}
            )
            
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except Exception as e:
        print(f"Error in predict_brain: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error processing image: {str(e)}', 500)

@app.route('/predict/parkinson', methods=['POST', 'OPTIONS'])
def predict_parkinson():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        if not models_status['parkinson'] or parkinson_model is None:
            return error_response('Parkinson model not loaded', 503)
        
        data = request.get_json()
        
        if not data or 'features' not in data:
            return error_response('Missing features field', 400)
        
        features = np.array(data['features'], dtype=float).reshape(1, -1)
        
        if features.shape[1] != 22:
            return error_response(f'Expected 22 features, received {features.shape[1]}', 400)
        
        if np.any(np.isnan(features)) or np.any(np.isinf(features)):
            return error_response('Features contain invalid values', 400)
        
        prediction_raw = parkinson_model.predict(features, verbose=0)
        
        if hasattr(parkinson_model, 'predict_proba'):
            prediction = np.argmax(prediction_raw, axis=1)
            confidence = parkinson_model.predict_proba(features)
        else:
            prediction = np.argmax(prediction_raw[0])
            confidence = prediction_raw
        
        predicted_class_idx = int(prediction[0]) if isinstance(prediction, np.ndarray) else int(prediction)
        class_names = ['Negative (No Parkinsons)', 'Positive (Parkinsons Detected)']
        predicted_class = class_names[predicted_class_idx]
        
        if hasattr(parkinson_model, 'predict_proba'):
            confidence_score = float(confidence[0][predicted_class_idx]) * 100
        else:
            confidence_score = float(np.max(prediction_raw[0])) * 100
        
        print(f"Parkinson Prediction: {predicted_class}, Confidence: {confidence_score:.2f}%")
        
        return success_response(
            'parkinsons_detection',
            {
                'classification': predicted_class,
                'is_positive': bool(predicted_class_idx),
                'confidence': confidence_score
            },
            confidence_score
        )
        
    except Exception as e:
        print(f"Error in predict_parkinson: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error processing prediction: {str(e)}', 500)

@app.route('/predict/stroke', methods=['POST', 'OPTIONS'])
def predict_stroke():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        if not models_status['stroke'] or stroke_model is None:
            return error_response('Stroke model not loaded', 503)
        
        data = request.get_json()
        
        if not data or 'features' not in data:
            return error_response('Missing features field', 400)
        
        try:
            features = np.array(data['features'], dtype=float).reshape(1, -1)
            print(f"Received features: {features}")
        except (ValueError, TypeError) as e:
            print(f"Feature conversion error: {e}")
            return error_response('Features must be numeric values', 400)
        
        expected_features = 22
        if features.shape[1] != expected_features:
            return error_response(f'Expected {expected_features} features, received {features.shape[1]}', 400)
        
        if np.any(np.isnan(features)) or np.any(np.isinf(features)):
            return error_response('Features contain NaN or Inf values', 400)
        
        try:
            features_normalized = features.copy().astype(float)
            features_normalized[0, 0] = features[0, 0] / 100.0
            features_normalized[0, 3] = features[0, 3] / 300.0
            features_normalized[0, 4] = features[0, 4] / 60.0
            
            print(f"Normalized features: {features_normalized}")
            
            prediction = stroke_model.predict(features_normalized, verbose=0)
            print(f"Raw prediction output: {prediction}")
            
            if len(prediction.shape) > 1 and prediction.shape[1] > 1:
                predicted_class_idx = int(np.argmax(prediction[0]))
                confidence = float(np.max(prediction[0])) * 100
                
                all_pred = {
                    'no_stroke': float(prediction[0][0]) * 100,
                    'stroke_risk': float(prediction[0][1]) * 100
                }
            else:
                raw_output = float(prediction[0][0])
                predicted_class_idx = 1 if raw_output > 0.5 else 0
                confidence = raw_output * 100
                
                all_pred = {
                    'no_stroke': (1 - raw_output) * 100,
                    'stroke_risk': raw_output * 100
                }
            
            class_names = ['No Stroke Risk', 'Stroke Risk Detected']
            predicted_class = class_names[predicted_class_idx]
            
            print(f"Final Prediction: {predicted_class}")
            print(f"Final Confidence: {confidence:.2f}%")
            
            confidence = max(0, min(100, confidence))
            
            return success_response(
                'stroke_prediction',
                {
                    'classification': predicted_class,
                    'stroke_risk': bool(predicted_class_idx),
                    'confidence': confidence
                },
                confidence,
                {'all_predictions': all_pred}
            )
        
        except Exception as model_error:
            print(f"Model prediction error: {str(model_error)}")
            import traceback
            traceback.print_exc()
            return error_response(f'Model prediction error: {str(model_error)}', 500)
            
    except Exception as e:
        print(f"Error in predict_stroke: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error processing prediction: {str(e)}', 500)

@app.route('/predict/alzheimer', methods=['POST', 'OPTIONS'])
def predict_alzheimer():
    if request.method == "OPTIONS":
        return "", 200
    
    try:
        if not models_status['alzheimer'] or alzheimer_model is None:
            return error_response('Alzheimer model not loaded', 503)
        
        if 'image' not in request.files:
            return error_response('No image file provided', 400)
        
        file = request.files['image']
        
        if file.filename == '':
            return error_response('No image selected', 400)
        
        if not is_valid_image_extension(file.filename):
            return error_response('Invalid file type. Only JPG, PNG, GIF allowed', 400)
        
        original_filename = secure_filename(file.filename)
        filename = f"{uuid.uuid4()}_{original_filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        file.save(file_path)
        
        try:
            img = image.load_img(file_path, target_size=(96, 96))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = img_array / 255.0
            
            prediction = alzheimer_model.predict(img_array, verbose=0)
            
            class_names = ['Mild Demented', 'Moderate Demented', 'Non Demented', 'Very Mild Demented']
            predicted_class_idx = np.argmax(prediction[0])
            predicted_class = class_names[predicted_class_idx]
            confidence = float(np.max(prediction[0])) * 100
            
            all_predictions = {
                class_names[i]: float(prediction[0][i]) * 100
                for i in range(len(class_names))
            }
            
            is_alzheimer_detected = predicted_class != 'Non Demented'
            
            print(f"Alzheimer Prediction: {predicted_class}, Confidence: {confidence:.2f}%")
            
            return success_response(
                'alzheimer_detection',
                {
                    'class': predicted_class,
                    'is_alzheimer': is_alzheimer_detected,
                    'confidence': confidence
                },
                confidence,
                {'all_predictions': all_predictions}
            )
            
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)
                
    except Exception as e:
        print(f"Error in predict_alzheimer: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error processing image: {str(e)}', 500)

@app.errorhandler(404)
def not_found(e):
    return error_response('Endpoint not found', 404)

@app.errorhandler(405)
def method_not_allowed(e):
    return error_response('Method not allowed', 405)

@app.errorhandler(500)
def internal_error(e):
    return error_response('Internal server error', 500)

if __name__ == '__main__':
    print("\n" + "="*70)
    print("NeuroDetect AI Backend Starting...")
    print("="*70)
    print(f"Models Status: {models_status}")
    print("\nModel files required:")
    print("  - models/brain_tumor_detection_model.h5 (150x150)")
    print("  - models/parkinsons_model.h5 (22 features)")
    print("  - models/stroke.h5 (22 features with normalization)")
    print("  - models/alzheimer_model_best.keras (96x96)")
    print("\nRunning on: http://127.0.0.1:5000")
    print("CORS enabled for: localhost:8080, localhost:3000")
    print("="*70 + "\n")
    
    app.run(debug=True, host='127.0.0.1', port=5000)