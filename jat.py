from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
from db import db, init_db
from routes import register_routes  # Import the function to register routes

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Set a secret key for session management and security
app.config['SECRET_KEY'] = 'admin'

#db parameters
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1478@localhost/jat'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
init_db(app)


# Register routes
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
