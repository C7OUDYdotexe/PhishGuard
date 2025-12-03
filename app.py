from flask import Flask, render_template, request, jsonify
from model import predict_phishing

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    result = predict_phishing(text)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
