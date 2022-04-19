from pymongo import MongoClient  # pymongo를 임포트 하기(패키지 설치 먼저 해야겠죠?)

client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
db = client.dbsparta  # 'dbsparta'라는 이름의 db를 사용합니다. 'dbsparta' db가 없다면 새로 만듭니다.
# 위의 코드가 'database' 생성

# MongoDB에 insert 하기
'''
# 'users'라는 'collection'에 데이터를 생성합니다.
# 값 들이 'Document'
db.users.insert_one({'name': '덤블도어', 'age': 116})
db.users.insert_one({'name': '맥고나걸', 'age': 85})
db.users.insert_one({'name': '스네이프', 'age': 60})
db.users.insert_one({'name': '해리', 'age': 40})
db.users.insert_one({'name': '허마이오니', 'age': 40})
db.users.insert_one({'name': '론', 'age': 40})
#id는 NongoDB에서 자기가 알아서 만든 것

# Database - Collection - Document
'''
'''
# MongoDB에서 데이터 모두 보기
user_list = list(db.users.find({}, {'_id': False}))

for user in user_list:
    print(user)
'''
'''
db.users.update_one({'name': '덤블도어'}, {'$set': {'age': 19}})

user = db.users.find_one({'name': '덤블도어'})
print(user)
'''

db.users.delete_one({'name': '론'})

user = db.users.find_one({'name': '론'})
print(user)