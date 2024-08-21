from flask import Flask
from db import db, init_db
from routes import register_routes  # Import the function to register routes

app = Flask(__name__)

# Set a secret key for session management and security
app.config['SECRET_KEY'] = 'admin'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1478@localhost/jat'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
init_db(app)


# Register routes
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
