import websocket
import explorerhat
import time

def on_message(ws, data):
    print(data)
    if(data == "forward"):
        explorerhat.motor.one.forwards(80)
        explorerhat.motor.two.forwards(65)
    elif(data == "backward"):
        explorerhat.motor.one.backwards(80)
        explorerhat.motor.two.backwards(65)
    elif(data == "left"):
        explorerhat.motor.one.backwards(40)
        explorerhat.motor.two.forwards(40)
    elif(data == "right"):
        explorerhat.motor.one.forwards(40)
        explorerhat.motor.two.backwards(40)
    elif(data == "stop"):
        explorerhat.motor.one.stop()
        explorerhat.motor.two.stop()
 



def on_error(ws, error):
    print(error)

time.sleep(10)
ws = websocket.WebSocketApp("ws://localhost:3000", on_message = on_message, on_error = on_error)
ws.run_forever()

