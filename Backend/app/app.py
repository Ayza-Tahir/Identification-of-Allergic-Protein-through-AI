from flask import Flask, request, jsonify
import joblib
import numpy as np
from Bio.SeqUtils.ProtParam import ProteinAnalysis
from Bio import SeqIO
from flask_cors import CORS
import os
import io
from itertools import product

# Create Flask app
app = Flask(__name__)
CORS(app)

# Amino acids
AMINO_ACIDS = "ACDEFGHIJKLMNPQRSTVWY"

model = joblib.load('models/allergen_detection.pkl')

def extract_aac(sequence):
    AMINO_ACIDS = "ACDEFGHIJKLMNPQRSTVWY"
    seq_list = []
    for aa in AMINO_ACIDS:
        a = sequence.count(aa) / len(sequence)
        seq_list.append(a)
    return seq_list

# Function to calculate Dipeptide Composition (DPC)
DIPEPTIDES = [''.join(p) for p in product(AMINO_ACIDS, repeat=2)]

def extract_dpc(sequence):
    seq_list = []
    for dp in DIPEPTIDES:
        d = sequence.count(dp) / len(sequence)  # Calculate frequency of each dipeptide
        seq_list.append(d)
    return seq_list

def calculate_physiochemical_features(seq):
    # Clean sequence by removing invalid characters (X, Z, U)
    seq = seq.replace("X", "").replace("Z", "").replace("U", "")
    
    # Perform analysis using ProteinAnalysis from Biopython
    analysis = ProteinAnalysis(seq)
    
    # Return physicochemical properties as a list
    return [
        analysis.isoelectric_point(),   # Isoelectric point
        analysis.molecular_weight(),    # Molecular weight
        analysis.aromaticity(),         # Aromaticity
        analysis.instability_index(),   # Instability index
        analysis.gravy()                # GRAVY (grand average of hydropathy)
    ]

def extract_physicochemical_properties(sequence):
    return calculate_physiochemical_features(sequence)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Retrieve the uploaded file
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file provided"}), 400
        
        # Parse the FASTA file
        text_stream = io.StringIO(file.read().decode("utf-8"))
        sequences = list(SeqIO.parse(text_stream, "fasta"))

        
        if len(sequences) != 1:
            return jsonify({"error": "File contains more than one protein sequence. Please upload a file with only one sequence."}), 400
        
        # Extract the protein sequence
        sequence = str(sequences[0].seq)
        
        # Feature extraction
        aac = extract_aac(sequence)
        dpc = extract_dpc(sequence)
        physicochemical = extract_physicochemical_properties(sequence)

        # Combine features
        features = np.array(aac + dpc + physicochemical).reshape(1, -1)
        print(f"Feature vector length: {features.shape[1]}")

        # Prediction
        prediction = model.predict(features)
        probabilities = model.predict_proba(features)
        prob_allergen = probabilities[0][1] * 100

        prediction = int(prediction[0])
        
        # Return the prediction
        return jsonify({
            "prediction": prediction,
            "probability": prob_allergen
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)