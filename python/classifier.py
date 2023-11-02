from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import numpy as np
import tensorflow as tf
from tensorflow import keras
import os


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

basedir = os.path.abspath(os.path.dirname(__file__))
uploads_path = os.path.join(basedir, 'uploads')

model = tf.keras.models.load_model('image-classifier/python/catdog_model.h5')
image_size = (180, 180)

class_names = ['Cat', 'Dog']

@cross_origin
@app.route("/predict/<image>")
def return_name(image):
    file = open(image, 'rb', buffering=0)
    print(type(file))
    response = jsonify(image)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response;

# Uploads an image to 'uploads' folder
@app.route('/img-upload', methods=['POST'])
def upload_image():


# def get_predictiion(image):

#     imgdata = base64.b64decode(image)
#     filename = 'some_image.jpg'  # I assume you have a way of picking unique filenames
#     with open(filename, 'wb') as f:
#         f.write(imgdata)

#     img = keras.preprocessing.image.load_img(
#     filename, target_size=(180, 180)
#     )
#     img_array = keras.preprocessing.image.img_to_array(img)
#     img_array = tf.expand_dims(img_array, 0)

#     predictions = model.predict(img_array)
#     score = tf.nn.softmax(predictions[0])
#     return jsonify({'Class': class_names[np.argmax(score)], 'Prediction': np.max(score) * 100})


if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=3001)