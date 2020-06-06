import SimpleHTTPServer
import SocketServer

PORT = 8047

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print("starting webserver at {0}", PORT)
httpd.serve_forever()
