from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


# Create a SQLAlchemy instance
db = SQLAlchemy()

# Function to initialize the app with the database
def init_db(app):
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize Flask-Migrate

