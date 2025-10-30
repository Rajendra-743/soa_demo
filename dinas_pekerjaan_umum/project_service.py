from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="db_pekerjaan_umum",
        user="postgres",
        password="070403"
    )

@app.route('/getProjectData', methods=['GET'])
def get_project_data():
    region = request.args.get('region')
    nama_proyek = request.args.get('nama_proyek')

    # Bersihkan input (hilangkan spasi dan huruf besar)
    region_clean = region.strip().lower() if region else None
    nama_clean = nama_proyek.strip().lower() if nama_proyek else None

    conn = get_db_connection()
    cur = conn.cursor()

    if region_clean and nama_clean:
        cur.execute("""
            SELECT id, nama_proyek, wilayah, anggaran, status 
            FROM proyek
            WHERE LOWER(wilayah) = %s AND LOWER(nama_proyek) = %s;
        """, (region_clean, nama_clean))
    elif region_clean:
        cur.execute("""
            SELECT id, nama_proyek, wilayah, anggaran, status 
            FROM proyek
            WHERE LOWER(wilayah) = %s;
        """, (region_clean,))
    elif nama_clean:
        cur.execute("""
            SELECT id, nama_proyek, wilayah, anggaran, status 
            FROM proyek
            WHERE LOWER(nama_proyek) = %s;
        """, (nama_clean,))
    else:
        cur.execute("SELECT id, nama_proyek, wilayah, anggaran, status FROM proyek;")

    rows = cur.fetchall()
    cur.close()
    conn.close()

    if rows:
        proyek_list = [{
            "id": r[0],
            "nama_proyek": r[1],
            "wilayah": r[2],
            "anggaran": float(r[3]),
            "status": r[4]
        } for r in rows]
        return jsonify({"list": proyek_list})
    else:
        return jsonify({"message": "Data proyek tidak ditemukan"})

if __name__ == '__main__':
    app.run(port=5004)
