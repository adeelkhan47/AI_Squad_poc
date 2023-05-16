from flask import Flask
from flask_cors import CORS

from api import blueprint

app = Flask(__name__, static_folder="../static")

app.register_blueprint(blueprint, url_prefix="")

app.config["CORS_HEADERS"] = "Content-Type"
CORS(app)

app.app_context().push()
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)
