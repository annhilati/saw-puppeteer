from datetime import timedelta
tdiff = round((timedelta(seconds=5)).total_seconds())

print(r" _  _                _  _      _                       ___  _  _  _      _                                 _    ")
print(r"| || | ___  _ _  ___| |(_) __ | |_   ___  _ _         / __|| |(_)(_) __ | |__ _ __ __  _  _  _ _   ___ __ | |_  ")
print(r"| __ |/ -_)| '_||_ /| || |/ _||   \ / -_)| ' \       | (_ || || || |/ _|| / / \ V  V /| || || ' \ (_-// _||   \ ")
print(r"|_||_|\___||_|  /__||_||_|\__||_||_|\___||_||_|       \___||_| \_._|\__||_\_\  \_/\_/  \_._||_||_|/__/\__||_||_|")
print("")
msg = f"Der Stahlsoldat hat deine Kurse innerhalb von {f"{tdiff} Sekunden" if tdiff < 100 else f'{tdiff // 60}:{tdiff % 60} Minuten'} gewählt"
print(" " * round((117 - len(msg)) / 2) + msg)
print("")