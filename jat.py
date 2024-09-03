from flask import Flask
from flask_cors import CORS
from db import db, init_db
from routes import bp as main_bp  # Import the blueprint

app = Flask(__name__)

# Enable CORS for the entire app and allow specific methods
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
     methods=["GET", "POST", "PUT", "DELETE"],
     allow_headers=["Content-Type", "Authorization"])

# Set a secret key for session management and security
app.config['SECRET_KEY'] = 'admin'

# Database parameters
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1478@localhost/jat'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
init_db(app)

# Register the blueprint
app.register_blueprint(main_bp)  # Register the blueprint from routes.py

if __name__ == "__main__":
    app.run(debug=True)
