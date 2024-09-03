from db import db
from datetime import datetime

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

    # Relationships
    notes = db.relationship('Note', back_populates='job_listing', cascade="all, delete-orphan")
    documents = db.relationship('Document', back_populates='job_listing', cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Job {self.job_title}>'


class Note(db.Model):
    __tablename__ = 'notes'  # Define the table name explicitly

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    stage = db.Column(db.String(50), nullable=False)
    note_text = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    job_listing = db.relationship('JobListing', back_populates='notes')


class Document(db.Model):
    __tablename__ = 'documents'  # Define the table name explicitly

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    stage = db.Column(db.String(50), nullable=False)
    document_name = db.Column(db.String(255), nullable=False)
    document_url = db.Column(db.String(255), nullable=False)
    date_uploaded = db.Column(db.DateTime, default=datetime.utcnow)

    job_listing = db.relationship('JobListing', back_populates='documents')
