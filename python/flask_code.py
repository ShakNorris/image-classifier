from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import numpy as np
import tensorflow as tf
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from tensorflow import keras
import os
import PIL


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

basedir = os.path.abspath(os.path.dirname(__file__))
uploads_path = os.path.join(basedir, 'uploads')

model = tf.keras.models.load_model('python/catdog_model.h5')
image_size = (180, 180)

class_names = ['Cat', 'Dog']

@cross_origin
@app.route("/predict/<image>", methods=['POST'])
def return_name(image):
    img = keras.preprocessing.image.load_img(
     f"python/uploads/{image}", target_size=(180, 180)
    )
    img_array = keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    predictions = model.predict(img_array)

    score = tf.nn.softmax(predictions[0])
    response = jsonify({'Class': class_names[np.argmax(score)], 'Prediction': np.max(score) * 100})
    return response

# Uploads an image to 'uploads' folder
@cross_origin
@app.route('/upload', methods=['POST'])
def upload_image():
    target = os.getcwd()
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/python/uploads/".join([target, filename])
    file.save(destination)
    print(file);
    return "file uploaded"

# def get_predictiion(image):

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