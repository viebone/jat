from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager  # Import from extensions
from db import init_db
from models import Users  # Import the Users model explicitly
from routes import bp as main_bp  # Import the blueprint

app = Flask(__name__)

# Set a secret key for session management and security
app.config['SECRET_KEY'] = 'admin'

# Configure CORS Headers and other settings
app.config['CORS_HEADERS'] = 'Content-Type'

# Database parameters
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1478@localhost/jat'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for the entire app, allowing specific methods and headers
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
     methods=["GET", "POST", "PUT", "DELETE"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)  # This enables credentials (cookies, auth headers)

# Initialize extensions
db.init_app(app)  # Initialize the database
login_manager.init_app(app)  # Initialize the login manager

# Set login properties
login_manager.login_view = 'main.login'
login_manager.login_message_category = 'info'



# Initialize extensions
login_manager.init_app(app)  # Initialize the login manager here


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))

# Register the blueprint
app.register_blueprint(main_bp)  # Register the blueprint from routes.py

if __name__ == "__main__":
    app.run(debug=True)
