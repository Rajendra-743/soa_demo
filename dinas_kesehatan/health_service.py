from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="db_kesehatan",
        user="postgres",
        password="070403"
    )

@app.route('/getHealthData', methods=['GET'])
def getHealthData():
    citizen_id = request.args.get('id')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT nik, status_vaksin, golongan_darah, riwayat_penyakit 
        FROM kesehatan WHERE nik = %s;
    """, (citizen_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        riwayat = [r.strip() for r in row[3].split(',')] if row[3] else []
        return jsonify({
            "id": row[0],
            "status_vaksin": row[1],
            "golongan_darah": row[2],
            "riwayat": riwayat
        })
    else:
        return jsonify({"message": "Data kesehatan tidak ditemukan"})

if __name__ == '__main__':
    app.run(port=5003)
