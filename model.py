import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import os

# Global variable to store the model
model = None

def train_model():
    global model
    try:
        # Load dataset
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'dataset.csv')
        if not os.path.exists(data_path):
            print("Dataset not found. Using dummy data.")
            data = pd.DataFrame({
                'text': ['click here to win', 'meeting tomorrow', 'update password', 'hello friend'],
                'label': [1, 0, 1, 0]
            })
        else:
            data = pd.read_csv(data_path)

        # Create a pipeline
        model = make_pipeline(TfidfVectorizer(), MultinomialNB())
        
        # Train the model
        model.fit(data['text'], data['label'])
        print("Model trained successfully.")
    except Exception as e:
        print(f"Error training model: {e}")

def predict_phishing(text):
    global model
    if model is None:
        train_model()
    
    try:
        # Predict
        prediction = model.predict([text])[0]
        probability = model.predict_proba([text])[0][1] # Probability of being phishing (class 1)
        
        return {
            'is_phishing': bool(prediction),
            'confidence': float(probability)
        }
    except Exception as e:
        print(f"Error during prediction: {e}")
        return {'is_phishing': False, 'confidence': 0.0}

# Train on import
train_model()
