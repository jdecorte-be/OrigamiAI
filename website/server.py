from flask import Flask, request, jsonify
from flask_cors import CORS
from quickstart import get_comment

app = Flask(__name__)
CORS(app)

@app.route("/", methods=['POST'])
def process_image():
    data = request.get_json()
    image_data = data.get('image')

    # Now you have the base64 encoded image data
    # You can pass it to your function for further processing
    # For example, get_comment(image_data)

    # Process the image data and return a response
    comment = get_comment(image_data)  # Example function call
    return jsonify({'comment': comment})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)