"""Levanta un servidor, espera a que su puerto responda, corre un comando y apaga el servidor.

  python con_servidor.py --servidor "npx astro preview --port 4340" --puerto 4340 --carpeta ..\\landing\\web -- python pruebas_landing.py http://localhost:4340/

Sale con el código del comando.
"""
import argparse
import socket
import subprocess
import sys
import time


def esperar_puerto(puerto: int, limite: float) -> bool:
    fin = time.time() + limite
    while time.time() < fin:
        try:
            # «localhost» prueba IPv6 e IPv4: Astro puede escuchar solo en ::1
            with socket.create_connection(("localhost", puerto), timeout=1):
                return True
        except OSError:
            time.sleep(0.5)
    return False


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--servidor", required=True)
    p.add_argument("--puerto", type=int, required=True)
    p.add_argument("--carpeta", default=".")
    p.add_argument("--espera", type=float, default=60)
    p.add_argument("comando", nargs=argparse.REMAINDER)
    a = p.parse_args()
    comando = a.comando[1:] if a.comando[:1] == ["--"] else a.comando

    servidor = subprocess.Popen(a.servidor, cwd=a.carpeta, shell=True)
    try:
        if not esperar_puerto(a.puerto, a.espera):
            print(f"El servidor no respondió en el puerto {a.puerto}", file=sys.stderr)
            return 1
        return subprocess.call(comando)
    finally:
        # En Windows el servidor corre bajo un shell: se termina el árbol completo
        if sys.platform == "win32":
            subprocess.call(["taskkill", "/F", "/T", "/PID", str(servidor.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            servidor.terminate()


if __name__ == "__main__":
    sys.exit(main())
