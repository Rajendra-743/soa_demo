from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="db_kependudukan",
        user="postgres",
        password="070403"
    )

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    nik = data.get('nik')
    nama = data.get('nama')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Cek apakah NIK dan Nama cocok di database
    cur.execute("SELECT nik, nama FROM warga WHERE nik = %s AND nama = %s;", (nik, nama))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return jsonify({
            "success": True,
            "message": "Login berhasil",
            "data": {
                "nik": row[0],
                "nama": row[1]
            }
        })
    else:
        return jsonify({
            "success": False,
            "message": "NIK atau Nama tidak sesuai"
        })

@app.route('/getCitizenData', methods=['GET'])
def getCitizenData():
    citizen_id = request.args.get('id')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT nik, nama, alamat, status, tanggal_lahir FROM warga WHERE nik = %s;", (citizen_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return jsonify({
            "id": row[0],
            "nama": row[1],
            "alamat": row[2],
            "status": row[3],
            "tanggal_lahir": row[4].isoformat() if row[4] else None
        })
    else:
        return jsonify({"message": "Data tidak ditemukan"})

if __name__ == '__main__':
    app.run(port=5001, debug=True)