from gpiozero import CPUTemperature
from pathlib import Path
from datetime import datetime
from time import sleep
import csv
cpu = CPUTemperature()
path = Path.home() / "pi-health.csv"
new_file = not path.exists() or path.stat().st_size == 0
with path.open("a", newline="") as file:
    writer = csv.writer(file)
    if new_file:
        writer.writerow(["timestamp", "cpu_celsius"])
    for sample in range(10):
        row = [datetime.now().isoformat(timespec="seconds"), round(cpu.temperature, 1)]
        writer.writerow(row)
        file.flush()
        print(*row)
        sleep(2)
print("Saved:", path)
