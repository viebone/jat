from sqlalchemy import text
from db import db
from flask import request, redirect, url_for, flash, jsonify, send_from_directory, Blueprint, render_template
from models import JobListing, Note, Document

bp = Blueprint('main', __name__)

# route for plain html template

# Home
@bp.route('/plain_html/')
def hello():
    return "Hello"

# List of jobs    
@bp.route('/plain_html/jobs')
def jobs():
    # Get filter parameters from the query string
    status = request.args.get('status')
    job_type = request.args.get('job_type')
    location_type = request.args.get('location_type')
    salary_min = request.args.get('salary_min')
    salary_max = request.args.get('salary_max')
    company = request.args.get('company')
    date_created = request.args.get('date_created')

    # Start with all jobs
    query = JobListing.query

    # Apply filters dynamically based on input
    if status:
        query = query.filter_by(status=status)
    
    if job_type:
        query = query.filter_by(job_type=job_type)
    
    if location_type:
        query = query.filter_by(location_type=location_type)

    if company:
        query = query.filter(JobListing.company.ilike(f'%{company}%'))

    if date_created:
        query = query.filter(JobListing.date_created >= date_created)

    if salary_min:
        query = query.filter(JobListing.salary >= salary_min)

    if salary_max:
        query = query.filter(JobListing.salary <= salary_max)

    # Execute the query and get filtered results
    job_listings = query.order_by(JobListing.date_created.desc()).all()

    return render_template('/plain_html/jobs.html', jobs=job_listings)

# Job details
@bp.route('/plain_html/jobs/<int:job_id>')
def job_details(job_id):
    # Fetch the job by its ID
    job = JobListing.query.get_or_404(job_id)
    
    # Render the job details page
    return render_template('/plain_html/job_details.html', job=job)

# Edit job
@bp.route('/plain_html/jobs/<int:job_id>/edit', methods=['GET', 'POST'])
def edit_job(job_id):
    job = JobListing.query.get_or_404(job_id)

    if request.method == 'POST':
        # Update the job with the new data from the form
        job.job_title = request.form['job_title']
        job.company = request.form['company']
        job.job_post_link = request.form['job_post_link']
        job.salary = request.form['salary']
        job.location_type = request.form['location_type']
        job.job_type = request.form['job_type']
        job.status = request.form['status']
        job.job_description = request.form['job_description']
        job.notes = request.form['notes']
        job.documents = request.form['documents']

        # Commit the changes to the database
        db.session.commit()

        flash('Job updated successfully!', 'success')
        return redirect(url_for('main.job_details', job_id=job.id))  # Use blueprint name 'main' in url_for

    # Render the form pre-filled with the current job data
    return render_template('/plain_html/edit_job.html', job=job)

# Add job
@bp.route('/plain_html/jobs/add', methods=['GET', 'POST'])
def add_job():
    if request.method == 'POST':
        # Collect form data
        job_title = request.form['job_title']
        company = request.form['company']
        job_post_link = request.form['job_post_link']
        salary = request.form['salary']
        location_type = request.form['location_type']
        job_type = request.form['job_type']
        status = request.form['status']
        job_description = request.form['job_description']
        notes = request.form['notes']
        documents = request.form['documents']

        # Create a new job listing instance
        new_job = JobListing(
            job_title=job_title,
            company=company,
            job_post_link=job_post_link,
            salary=salary,
            location_type=location_type,
            job_type=job_type,
            status=status,
            job_description=job_description,
            notes=notes,
            documents=documents
        )

        # Add the new job to the database
        db.session.add(new_job)
        db.session.commit()

        flash('New job added successfully!', 'success')
        return redirect(url_for('main.jobs'))  # Use blueprint name 'main' in url_for

    return render_template('/plain_html/add_job.html')

# Delete job
@bp.route('/plain_html/jobs/delete', methods=['POST'])
def delete_jobs():
    job_ids = request.form.getlist('job_ids')  # Get the list of job IDs to delete
    if job_ids:
        # Delete the selected jobs from the database
        JobListing.query.filter(JobListing.id.in_(job_ids)).delete(synchronize_session=False)
        db.session.commit()
        flash(f'{len(job_ids)} job(s) deleted successfully!', 'success')
    else:
        flash('No jobs selected for deletion.', 'error')

    return redirect(url_for('main.jobs'))  # Use blueprint name 'main' in url_for

# API to get the list of jobs with filters
@bp.route('/api/jobs', methods=['GET'])
def get_jobs_api():
    # Get filter parameters from the request
    status = request.args.get('status')
    job_type = request.args.get('job_type')
    location_type = request.args.get('location_type')
    salary_min = request.args.get('salary_min')
    salary_max = request.args.get('salary_max')
    company = request.args.get('company')
    date_created = request.args.get('date_created')

    # Start with all jobs
    query = JobListing.query

    # Apply filters dynamically based on input
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

    # Execute the query and get filtered results
    job_listings = query.order_by(JobListing.date_created.desc()).all()

    # Convert to a list of dictionaries with serialized notes and documents
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

# API to add job
@bp.route('/api/jobs', methods=['OPTIONS', 'POST'])
def add_job_api():
    print(request.method)  # Debugging statement to check HTTP method

    if request.method == 'OPTIONS':
        return '', 204

    data = request.json

    # Create a new job listing instance
    new_job = JobListing(
        job_title=data['title'],
        company=data['company'],
        job_post_link=data.get('job_post_link'),
        salary=data.get('salary'),
        location_type=data.get('location_type'),
        job_type=data.get('job_type'),
        status=data.get('status'),
        job_description=data.get('job_description'),
    )

    db.session.add(new_job)
    db.session.commit()

    # Add notes if provided
    notes_data = data.get('notes', [])
    for note in notes_data:
        new_note = Note(
            job_id=new_job.id,
            stage=note.get('stage'),
            note_text=note.get('note_text')
        )
        db.session.add(new_note)

    db.session.commit()

    return jsonify({'message': 'Job added successfully', 'job_id': new_job.id})

# API to update job details
@bp.route('/api/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    data = request.json
    job = JobListing.query.get_or_404(job_id)

    # Update job details
    job.job_title = data.get('title', job.job_title)
    job.company = data.get('company', job.company)
    job.job_post_link = data.get('job_post_link', job.job_post_link)
    job.salary = data.get('salary', job.salary)
    job.location_type = data.get('location_type', job.location_type)
    job.job_type = data.get('job_type', job.job_type)
    job.status = data.get('status', job.status)
    job.job_description = data.get('job_description', job.job_description)
    job.notes = data.get('notes', job.notes)
    job.documents = data.get('documents', job.documents)

    db.session.commit()
    return jsonify({'message': 'Job updated successfully'})

# API to delete a job
@bp.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = JobListing.query.get_or_404(job_id)
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'})
