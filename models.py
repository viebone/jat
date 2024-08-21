from db import db
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)



class JobListing(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    job_title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    job_post_link = db.Column(db.Text)
    salary = db.Column(db.Numeric(10, 2))
    location_type = db.Column(db.String(50))
    job_type = db.Column(db.String(50))
    status = db.Column(db.String(50))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    job_description = db.Column(db.Text)
    notes = db.Column(db.Text)
    documents = db.Column(db.Text)


    def __repr__(self):
        return f'<Job {self.job_title}>'

