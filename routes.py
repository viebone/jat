from sqlalchemy import text
from db import db
from flask import request, redirect, url_for, flash, jsonify, send_from_directory, Blueprint, render_template, current_app
from models import JobListing, Note, Document
import os
from werkzeug.utils import secure_filename

bp = Blueprint('main', __name__)

# Path to store uploaded documents
UPLOAD_FOLDER = 'uploads/documents'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



# API to get jobs with filters
@bp.route('/api/jobs', methods=['GET'])
def get_jobs_api():
    status = request.args.get('status')
    job_type = request.args.get('job_type')
    location_type = request.args.get('location_type')
    salary_min = request.args.get('salary_min')
    salary_max = request.args.get('salary_max')
    company = request.args.get('company')
    date_created = request.args.get('date_created')

    query = JobListing.query

    if status:
        query = query.filter_by(status=status)
    
    if job_type:
        query = query.filter_by(job_type=job_type)
    
    if location_type:
        query = query.filter_by(location_type=location_type)

    if salary_min:
        query = query.filter(JobListing.salary >= salary_min)

    if salary_max:
        query = query.filter(JobListing.salary <= salary_max)

    if company:
        query = query.filter(JobListing.company.ilike(f'%{company}%'))

    if date_created:
        query = query.filter(JobListing.date_created >= date_created)

    job_listings = query.order_by(JobListing.date_created.desc()).all()

    jobs_list = [{
        'id': job.id,
        'job_title': job.job_title,
        'company': job.company,
        'job_post_link': job.job_post_link,
        'salary': job.salary,
        'location_type': job.location_type,
        'job_type': job.job_type,
        'status': job.status,
        'job_description': job.job_description,
        'notes': [{'id': note.id, 'stage': note.stage, 'note_text': note.note_text, 'date_created': note.date_created} for note in job.notes],
        'documents': [{'id': doc.id, 'stage': doc.stage, 'document_name': doc.document_name, 'document_url': doc.document_url, 'date_uploaded': doc.date_uploaded} for doc in job.documents]
    } for job in job_listings]

    return jsonify(jobs_list)

# API to add job with document upload handling
@bp.route('/api/jobs', methods=['POST'])
def add_job_api():
    # Check if the request contains form data
    if 'title' not in request.form:
        return jsonify({'error': 'No job data provided'}), 400

    # Extract job data from the form
    title = request.form['title']
    company = request.form['company']
    job_post_link = request.form.get('job_post_link', None)
    salary = request.form.get('salary', None)
    location_type = request.form.get('location_type', None)
    job_type = request.form.get('job_type', None)
    status = request.form.get('status', None)
    job_description = request.form.get('job_description', None)

    # Handle notes (which are sent as a JSON string)
    notes = request.form.get('notes', '[]')
    notes = eval(notes)  # Convert JSON string back to list

    # Create a new job listing
    new_job = JobListing(
        job_title=title,
        company=company,
        job_post_link=job_post_link,
        salary=salary,
        location_type=location_type,
        job_type=job_type,
        status=status,
        job_description=job_description
    )
    db.session.add(new_job)
    db.session.commit()

    # Add notes if any
    for note in notes:
        new_note = Note(
            job_id=new_job.id,
            stage=note['stage'],
            note_text=note['note_text']
        )
        db.session.add(new_note)
    
    # Handle document uploads
    if 'documents[]' in request.files:
        files = request.files.getlist('documents[]')
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, filename))  # Save the file
                new_document = Document(
                    job_id=new_job.id,
                    document_name=filename,
                    document_url=os.path.join('uploads', filename),
                    stage=request.form.get('stage', 'Saved')  # Optionally handle the stage
                )
                db.session.add(new_document)

    db.session.commit()
    return jsonify({'message': 'Job added successfully', 'job_id': new_job.id})

# Edit job with document upload and deletion
@bp.route('/api/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    job = JobListing.query.get_or_404(job_id)

    # Update job details
    job.job_title = request.form.get('title', job.job_title)
    job.company = request.form.get('company', job.company)
    job.job_post_link = request.form.get('job_post_link', job.job_post_link)
    job.salary = request.form.get('salary', job.salary)
    job.location_type = request.form.get('location_type', job.location_type)
    job.job_type = request.form.get('job_type', job.job_type)
    job.status = request.form.get('status', job.status)
    job.job_description = request.form.get('job_description', job.job_description)

    # Handle notes (add or update)
    notes = request.form.getlist('notes')
    existing_note_ids = [note.id for note in job.notes]
    for note_data in notes:
        if 'id' in note_data and note_data['id'] in existing_note_ids:
            existing_note = Note.query.get(note_data['id'])
            existing_note.stage = note_data['stage']
            existing_note.note_text = note_data['note_text']
        else:
            new_note = Note(
                job_id=job.id,
                stage=note_data['stage'],
                note_text=note_data['note_text']
            )
            db.session.add(new_note)

    # Handle document uploads
    if 'documents[]' in request.files:
        for document in request.files.getlist('documents[]'):
            if document and allowed_file(document.filename):
                filename = secure_filename(document.filename)
                document_path = os.path.join(UPLOAD_FOLDER, filename)
                document.save(document_path)

                new_document = Document(
                    job_id=job.id,
                    stage=request.form.get('document_stage', 'Saved'),
                    document_name=filename,
                    document_url=document_path
                )
                db.session.add(new_document)

    # Handle document removal
    document_ids_to_remove = request.form.getlist('remove_document_ids[]')
    print(f"Document IDs to remove: {document_ids_to_remove}")

    for document_id in document_ids_to_remove:
        document = Document.query.get(document_id)
        if document:
            try:
                # Remove the document from the file system
                print(f"Removing file: {document.document_url}")
                if os.path.exists(document.document_url):
                    os.remove(document.document_url)
                else:
                    print(f"File {document.document_url} does not exist.")
            except Exception as e:
                print(f"Error removing file: {e}")  # Log error if file doesn't exist or can't be deleted

            # Remove the document entry from the database
            db.session.delete(document)

    # Handle note removal (missing part added)
    remove_note_ids = request.form.getlist('remove_note_ids[]')  # Get note IDs to remove
    for note_id in remove_note_ids:
        note = Note.query.get(note_id)
        if note:
            db.session.delete(note)

    # Commit all changes
    db.session.commit()

    return jsonify({'message': 'Job updated successfully'})



# API to delete a job
@bp.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = JobListing.query.get_or_404(job_id)

    # Handle associated documents (delete files from filesystem)
    for document in job.documents:
        try:
            if os.path.exists(document.document_url):
                os.remove(document.document_url)  # Remove file from filesystem
            else:
                print(f"File {document.document_url} does not exist.")
        except Exception as e:
            print(f"Error deleting file {document.document_url}: {e}")
        # Delete the document from the database even if file removal fails
        db.session.delete(document)

    # Delete the job
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'})
