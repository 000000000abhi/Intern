import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader

app = Flask(__name__)
# Allow requests from your Next.js frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route("/api/parse-pdf", methods=["POST"])
def parse_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.pdf'):
        try:
            # Read the file into memory
            pdf_in_memory = io.BytesIO(file.read())
            
            # Use PyPDF2 to read the PDF
            reader = PdfReader(pdf_in_memory)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            
            print("✅ Successfully extracted text from PDF.")

            return jsonify({
                "success": True,
                "text": text.strip()
            })

        except Exception as e:
            print(f"❌ Error parsing PDF: {e}")
            return jsonify({"error": f"Failed to parse PDF: {str(e)}"}), 500

    return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

if __name__ == "__main__":
    # Running on a different port to avoid conflict with Next.js
    app.run(host="0.0.0.0", port=5342, debug=True)
