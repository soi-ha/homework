from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient  # pymongo를 임포트 하기
from datetime import datetime
from os import listdir
from os.path import isfile, join

app = Flask(__name__)

# client = MongoClient('mongodb://test:test@localhost', 27017)
client = MongoClient('localhost', 27017) #mongoDB는 27017 포트로 돌아갑니다.
db = client.dbsparta  # 'dbsparta'라는 이름의 db를 만듭니다.


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/trip', methods=['GET'])
def get_image():
    # get all files from the static directory
    static_path = './static'
    files = [f'/static/{f}' for f in listdir(static_path) if isfile(join(static_path, f))]
    result = list(db.trip.find({}, {'_id': 0}))
    return jsonify({'images': files, 'articles': result})


def read_articles():
    # mongoDB에서 _id 값을 제외한 모든 데이터 조회해오기 (Read)
    result = list(db.trip.find({}, {'_id': 0}))
    # articles라는 키 값으로 article 정보 보내주기
    return jsonify({'result': 'success', 'articles': result})


@app.route('/image', methods=['POST'])
def post_image():
    # try:
    image = request.files['images']
    extension = image.filename.split('.')[-1]  # extension
    timestamp = int(datetime.now().timestamp())  # utc timestamp
    image_name = f'/static/{timestamp}.{extension}'  # save path
    image.save(f'.{image_name}')

    # db.trip.update_one({'img': image_name})
    return jsonify({'result': 'success', 'img_path': image_name})


# except Exception as e:
#     return jsonify({'result': 'fail', 'error': e})


@app.route('/trip', methods=['POST'])
def post_article():
    # 클라이언트로부터 데이터를 받기
    writer_receive = request.form['writer_give']
    date_receive = request.form['date_give']
    place_receive = request.form['place_give']
    lat_receive = request.form['lat_give']
    lng_receive = request.form['lng_give']
    img_receive = request.form['img_give']
    content_receive = request.form['content_give']

    article = {'writer': writer_receive, 'date': date_receive, 'place': place_receive,
               'lat': lat_receive, 'lng': lng_receive, 'img': img_receive, 'content': content_receive}

    #  mongoDB에 데이터를 넣기
    db.trip.insert_one(article)
    # 성공 여부 & 성공 메시지 반환하기
    return jsonify({'result': 'success'})


# @app.route('/trip', methods=['GET'])
# def read_articles():
# mongoDB에서 _id 값을 제외한 모든 데이터 조회해오기 (Read)
#     result = list(db.trip.find({}, {'_id': 0}))
# articles라는 키 값으로 article 정보 보내주기
#     return jsonify({'result': 'success', 'articles': result})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
