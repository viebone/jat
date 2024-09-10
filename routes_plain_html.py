# Home route
@bp.route('/plain_html/')
def hello():
    return "Hello"

# List of jobs    
@bp.route('/plain_html/jobs')
def jobs():
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

    if company:
        query = query.filter(JobListing.company.ilike(f'%{company}%'))

    if date_created:
        query = query.filter(JobListing.date_created >= date_created)

    if salary_min:
        query = query.filter(JobListing.salary >= salary_min)

    if salary_max:
        query = query.filter(JobListing.salary <= salary_max)

    job_listings = query.order_by(JobListing.date_created.desc()).all()

    return render_template('/plain_html/jobs.html', jobs=job_listings)

# Job details
@bp.route('/plain_html/jobs/<int:job_id>')
def job_details(job_id):
    job = JobListing.query.get_or_404(job_id)
    return render_template('/plain_html/job_details.html', job=job)

# Add job with document upload
@bp.route('/plain_html/jobs/add', methods=['GET', 'POST'])
def add_job():
    if request.method == 'POST':
        job_title = request.form['job_title']
        company = request.form['company']
        job_post_link = request.form['job_post_link']
        salary = request.form['salary']
        location_type = request.form['location_type']
        job_type = request.form['job_type']
        status = request.form['status']
        job_description = request.form['job_description']
        notes = request.form.getlist('notes')  # Get the notes field (can be JSON formatted)

        new_job = JobListing(
            job_title=job_title,
            company=company,
            job_post_link=job_post_link,
            salary=salary,
            location_type=location_type,
            job_type=job_type,
            status=status,
            job_description=job_description,
        )
        db.session.add(new_job)
        db.session.commit()

        # Handle notes (if applicable)
        for note in notes:
            new_note = Note(
                job_id=new_job.id,
                stage=note.get('stage', 'Saved'),
                note_text=note.get('note_text')
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
                        job_id=new_job.id,
                        stage=request.form.get('document_stage', 'Saved'),
                        document_name=filename,
                        document_url=document_path
                    )
                    db.session.add(new_document)

        db.session.commit()
        flash('New job added successfully!', 'success')
        return redirect(url_for('main.jobs'))

    return render_template('/plain_html/add_job.html')

# Edit job with document upload and deletion
@bp.route('/plain_html/jobs/<int:job_id>/edit', methods=['GET', 'POST'])
def edit_job(job_id):
    job = JobListing.query.get_or_404(job_id)

    if request.method == 'POST':
        # Step 1: Update the job fields
        job.job_title = request.form['job_title']
        job.company = request.form['company']
        job.job_post_link = request.form['job_post_link']
        job.salary = request.form['salary']
        job.location_type = request.form['location_type']
        job.job_type = request.form['job_type']
        job.status = request.form['status']
        job.job_description = request.form['job_description']

        # Step 2: Handle notes update
        notes = request.form.getlist('notes')  # This is assumed to be a list of notes passed from the frontend
        existing_note_ids = [note.id for note in job.notes]  # Keep track of existing notes

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

        # Step 3: Handle new document uploads
        if 'documents[]' in request.files:
            for document in request.files.getlist('documents[]'):
                if document and allowed_file(document.filename):
                    filename = secure_filename(document.filename)
                    document_path = os.path.join(UPLOAD_FOLDER, filename)
                    document.save(document_path)

                    new_document = Document(
                        job_id=job.id,
                        stage=request.form.get('document_stage', 'Saved'),  # Default stage
                        document_name=filename,
                        document_url=document_path
                    )
                    db.session.add(new_document)

        # Step 4: Handle document removal (if any)
        if 'remove_document_ids' in request.form:
            document_ids_to_remove = request.form.getlist('remove_document_ids')
            for document_id in document_ids_to_remove:
                document = Document.query.get(document_id)
                if document:
                    try:
                        # Attempt to remove the file
                        if os.path.exists(document.document_url):
                            os.remove(document.document_url)
                        else:
                            print(f"File {document.document_url} does not exist.")
                    except Exception as e:
                        print(f"Error removing file {document.document_url}: {e}")
                    
                    # Remove the document from the database regardless
                    db.session.delete(document)

        # Step 5: Commit all changes (job, notes, documents)
        db.session.commit()

        # Step 6: Success message and redirect
        flash('Job updated successfully!', 'success')
        return redirect(url_for('main.job_details', job_id=job.id))

    return render_template('/plain_html/edit_job.html', job=job)