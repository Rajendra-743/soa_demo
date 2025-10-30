from flask import Flask, jsonify, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="db_pendapatan",
        user="postgres",
        password="070403"
    )

@app.route('/getTaxData', methods=['GET'])
def getTaxData():
    citizen_id = request.args.get('id')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT nik, tahun, jumlah_pajak, status_pembayaran FROM pajak WHERE nik = %s;", (citizen_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return jsonify({
            "id": row[0],
            "tahun": row[1],
            "jumlah_pajak": float(row[2]),
            "status_pajak": row[3]
        })
    else:
        return jsonify({"message": "Data pajak tidak ditemukan"})

if __name__ == '__main__':
    app.run(port=5002)
