import numpy as np
import tensorflow as tf
from tensorflow import keras


model = tf.keras.models.load_model('catdog_model.h5')
image_size = (180, 180)

class_names = ['Cat', 'Dog']

img = keras.preprocessing.image.load_img(
    "PetImages/Cat/1.jpg", target_size=(180, 180)
)
img_array = keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)

predictions = model.predict(img_array)
score = tf.nn.softmax(predictions[0])
print(class_names[np.argmax(score)], np.max(score) * 100)