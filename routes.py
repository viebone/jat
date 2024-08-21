from sqlalchemy import text  # Import the text function to handle raw SQL queries
from db import db  # Import the db instance
from flask import request, redirect, url_for, flash
from flask import Blueprint, render_template
from models import JobListing

bp = Blueprint('main', __name__)


def register_routes(app):
    @app.route('/')
    def hello():
        return "Hello"
    
    @app.route('/test-db')
    def test_db():
        try:
            # Wrap the SQL query with the text() function
            result = db.session.execute(text('SELECT 1')).scalar()
            return f"Database connection successful: {result}", 200
        except Exception as e:
            return f"Database connection failed: {str(e)}", 500
        
    @app.route('/jobs')
    def jobs():
        job_listings = JobListing.query.order_by(JobListing.date_created.desc()).all()

        return render_template('jobs.html', jobs=job_listings)

        # Debugging: Print job details
        #for job in job_listings:
            #print(f"Job Title: {job.job_title}, Company: {job.company}, Salary: {job.salary}, Status: {job.status}")
            # Return a simple string to avoid the TypeError
            #return "Debugging complete!"
   
    @app.route('/jobs/<int:job_id>')
    def job_details(job_id):
        # Fetch the job by its ID
        job = JobListing.query.get_or_404(job_id)
        
        # Render the job details page
        return render_template('job_details.html', job=job)
    
    @app.route('/jobs/<int:job_id>/edit', methods=['GET', 'POST'])
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
            return redirect(url_for('job_details', job_id=job.id))

        # Render the form pre-filled with the current job data
        return render_template('edit_job.html', job=job)
    
    @app.route('/jobs/add', methods=['GET', 'POST'])
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
            return redirect(url_for('jobs'))

        return render_template('add_job.html')
    
    @app.route('/jobs/delete', methods=['POST'])
    def delete_jobs():
        job_ids = request.form.getlist('job_ids')  # Get the list of job IDs to delete
        if job_ids:
            # Delete the selected jobs from the database
            JobListing.query.filter(JobListing.id.in_(job_ids)).delete(synchronize_session=False)
            db.session.commit()
            flash(f'{len(job_ids)} job(s) deleted successfully!', 'success')
        else:
            flash('No jobs selected for deletion.', 'error')

        return redirect(url_for('jobs'))