from datetime import datetime

def log(component: str, type: str, message: str) -> None:
    timestamp = Time.clock()
    colors = {
        "FAIL" :    "\033[38;2;200;80;80m",
        "ERROR":    "\033[38;2;200;80;80m",
        "FATAL":    "\033[38;2;200;80;80m",
        "WARN":     "\033[38;2;220;150;80m",
        "SUCCESS":  "\033[38;2;82;164;103m"
    }
    print(f"[{timestamp}] " + f"[{colors.get(type) or ""}{type}\033[0m]" + " " * (8-len(type)) + f"[{component}]" + " " * (9-len(component)) + f"{message}")

class Time():
    """
    A collection of functions that format a datetime or return the current

    #### Functions:
        date(): Returns a date in an european format
        time(): Returns a time in an european format
        clock(): Returns a time with second precision
    """
    @staticmethod
    def date(dt: datetime = None) -> str:
        "Returns a date in an european format"
        return (dt or datetime.now()).strftime("%d.%m.%Y")

    @staticmethod
    def time(dt: datetime = None) -> str:
        "Returns a time in an european format"
        return (dt or datetime.now()).strftime("%H:%M")
    
    @staticmethod
    def clock(dt: datetime = None) -> str:
        "Returns a time in an european format including seconds"
        return (dt or datetime.now()).strftime("%H:%M:%S")