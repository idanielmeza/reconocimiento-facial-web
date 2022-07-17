from sqlite3 import connect
import psycopg2

def run_query(query, parametros=()):
    try:
        with connect('DB/db.db') as conn:
            cursor = conn.cursor()
            resultado = cursor.execute(query, parametros)
            conn.commit()
        return resultado
    except Exception as e:

        print(e)

def postgresql(query):
    try:
        conn = psycopg2.connect(
        dbname='reconocimiento_facial',
        user='postgres',
        password='postgrespw',
        host='localhost',
        port='49153'
        )
        
        cur = conn.cursor()
        cur.execute(query)
        rows = cur.fetchall()
        conn.close()
        return rows
    except Exception as e:
        print(e)
        return None

    

