from flask import Flask, jsonify
from gpiozero import CPUTemperature, Button
from datetime import datetime
app = Flask(__name__)
cpu = CPUTemperature()
button = Button(2, bounce_time=0.05)
@app.get("/api")
def data():
    return jsonify(cpu_c=round(cpu.temperature, 1), button=button.is_pressed,
                   time=datetime.now().isoformat(timespec="seconds"))
@app.get("/")
def home():
    values = data().get_json()
    state = "Pressed" if values["button"] else "Released"
    return ("<meta http-equiv='refresh' content='2'><h1>Pi dashboard</h1>"
            f"<p>CPU: {values['cpu_c']} C</p><p>Button: {state}</p>"
            f"<p>{values['time']}</p><p><a href='/api'>JSON data</a></p>")
if __name__ == "__main__":
    try:
        app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False)
    finally:
        button.close()
        cpu.close()
