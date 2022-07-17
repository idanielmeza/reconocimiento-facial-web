from flask import Flask,render_template,Response
import cv2
import face_recognition
from source.db import postgresql

app = Flask(__name__, static_url_path='', static_folder='static')

cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

def generar():
    #Obetenemos todos los registros de la base de datos
        results = postgresql("SELECT * FROM users")
        print(results)
        
        #Creamos una lista de todos los nombres de los usuarios y codificamos sus caras
        known_face_encodings = []
        known_face_names = []
        for result in results:
            name = result[1]
            image = face_recognition.load_image_file(f"images/{result[2]}")
            encoding = face_recognition.face_encodings(image)[0]
            known_face_encodings.append(encoding)
            known_face_names.append(name)

        #Creamos variaables para guardar la imagen y el nombre de la persona reconocida
        face_locations = []
        face_encodings = []
        face_names = []
        process_this_frame = True

        # # #Creamos una ventana para mostrar la imagen
        # cap = cv2.VideoCapture(0)


        while True:
            ret, frame = cap.read()

            if process_this_frame:
                #Cambiamos el tamaño de la imagen
                small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

                #Convertimos la imagen a blanco
                rgb_small_frame = small_frame[:, :, ::-1]

                #Detectamos las caras en la imagen
                face_locations = face_recognition.face_locations(rgb_small_frame)
                face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                face_names = []
                for face_encoding in face_encodings:
                    #Comparamos la cara con todas las caras guardadas en la base de datos
                    matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                    name = "Desconocido"

                    #Si encontramos una cara que coincide con una de nuestras caras guardadas
                    if True in matches:
                        first_match_index = matches.index(True)
                        name = known_face_names[first_match_index]

                    face_names.append(name)
                
            process_this_frame = not process_this_frame

            #Mostramos el nombre de la persona reconocida
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (88,234,85), cv2.FILLED)
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name.upper(), (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)
            
            (flag,encodedImage) = cv2.imencode('.jpg', frame)
            if not flag:
                continue
            yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage)+ b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    return Response(generar(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(debug=False)

cap.release()