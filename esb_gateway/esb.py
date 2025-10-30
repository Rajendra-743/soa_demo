# # esb_gateway/esb.py
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import requests

# app = Flask(__name__)
# CORS(app)  # IZINKAN AKSES DARI FRONTEND PORT 5500

# @app.route('/getIntegratedData', methods=['GET'])
# def getIntegratedData():
#     citizen_id = request.args.get('id')
#     region = request.args.get('region', 'Bandung')

#     citizen = requests.get(f'http://localhost:5001/getCitizenData?id={citizen_id}').json()
#     tax = requests.get(f'http://localhost:5002/getTaxData?id={citizen_id}').json()
#     health = requests.get(f'http://localhost:5003/getHealthData?id={citizen_id}').json()
#     project = requests.get(f'http://localhost:5004/getProjectData?region={region}').json()

#     result = {
#         "citizen": citizen,
#         "tax": tax,
#         "health": health,
#         "project": project
#     }
#     return jsonify(result)

# if __name__ == '__main__':
#     app.run(port=8000)
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/getIntegratedData', methods=['GET'])
def get_integrated_data():
    citizen_id = request.args.get('id')
    data = {}

    try:
        res_citizen = requests.get(f"http://localhost:5001/getCitizenData?id={citizen_id}").json()
        data["citizen"] = res_citizen
    except:
        data["citizen"] = {"message": "Gagal mengambil data kependudukan"}

    try:
        res_tax = requests.get(f"http://localhost:5002/getTaxData?id={citizen_id}").json()
        data["tax"] = res_tax
    except:
        data["tax"] = {"message": "Gagal mengambil data pajak"}

    try:
        res_health = requests.get(f"http://localhost:5003/getHealthData?id={citizen_id}").json()
        data["health"] = res_health
    except:
        data["health"] = {"message": "Gagal mengambil data kesehatan"}

    return jsonify(data)

if __name__ == '__main__':
    app.run(port=8000)

