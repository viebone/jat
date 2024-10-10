import React, { useState } from 'react';
import axios from 'axios';

function AddJob({ onJobAdded }) {
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    job_post_link: '',
    salary: '',
    location_type: 'Remote',
    job_type: 'Full-time',
    status: 'Saved',
    job_description: '',
    notes: [],  // Initialize notes as an array to hold multiple notes
    documents: [],  // Initialize documents as an array to hold multiple files
  });

  const [noteText, setNoteText] = useState('');  // State to manage individual note text input
  const [noteStage, setNoteStage] = useState('Saved');  // State to manage the stage selection for notes
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);  // Track the index of the note being edited
  const [editNoteText, setEditNoteText] = useState('');  // Track the text of the note being edited
  const [editNoteStage, setEditNoteStage] = useState('Saved');  // Track the stage of the note being edited
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);  // Track the index of the note being confirmed for deletion

  const [documentFiles, setDocumentFiles] = useState([]);  // Track uploaded document files

  // Handle input changes for job fields
  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Handle adding a new note
  const handleAddNote = () => {
    if (noteText.trim()) {
      const newNote = { stage: noteStage, note_text: noteText };
      setNewJob((prevJob) => ({
        ...prevJob,
        notes: [...prevJob.notes, newNote],
      }));
      setNoteText('');  // Clear input after adding
    }
  };

  // Start editing a note
  const handleEditNote = (index) => {
    setEditingNoteIndex(index);
    setEditNoteText(newJob.notes[index].note_text);
    setEditNoteStage(newJob.notes[index].stage);
  };

  // Save the edited note
  const handleSaveNote = (index) => {
    const updatedNotes = [...newJob.notes];
    updatedNotes[index].note_text = editNoteText;
    updatedNotes[index].stage = editNoteStage;
    setNewJob((prevJob) => ({
      ...prevJob,
      notes: updatedNotes,
    }));
    setEditingNoteIndex(null);  // Exit edit mode
  };

  // Cancel editing a note
  const handleCancelEdit = () => {
    setEditingNoteIndex(null);  // Exit edit mode without saving
  };

  // Handle removing a note with confirmation
  const handleRemoveNote = (index) => {
    setConfirmDeleteIndex(index);  // Prompt for confirmation
  };

  const confirmRemoveNote = (index) => {
    const updatedNotes = [...newJob.notes];
    updatedNotes.splice(index, 1);  // Remove the note at the specified index
    setNewJob((prevJob) => ({
      ...prevJob,
      notes: updatedNotes,
    }));
    setConfirmDeleteIndex(null);  // Reset confirmation
  };

  const cancelRemoveNote = () => {
    setConfirmDeleteIndex(null);  // Reset confirmation
  };

  // Handle document file selection
  const handleFileChange = (e) => {
    setDocumentFiles([...e.target.files]);
  };

  // Handle removing a document before submission
  const handleRemoveDocument = (index) => {
    const updatedFiles = [...documentFiles];
    updatedFiles.splice(index, 1);  // Remove the document at the specified index
    setDocumentFiles(updatedFiles);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // Create form data to handle file uploads
    const formData = new FormData();

    // Sanitize input fields
    const sanitizedJobTitle =  newJob.title.trim();
    const sanitizedCompany = newJob.company.trim();
    const sanitizedJobPostLink = newJob.job_post_link.trim();
    

    // Append job details
    formData.append('title', sanitizedJobTitle);
    formData.append('company', sanitizedCompany);
    formData.append('job_post_link', sanitizedJobPostLink);
    formData.append('salary', newJob.salary);
    formData.append('location_type', newJob.location_type);
    formData.append('job_type', newJob.job_type);
    formData.append('status', newJob.status);
    formData.append('job_description', newJob.job_description);

    // Append notes as JSON string
    formData.append('notes', JSON.stringify(newJob.notes));

    // Append documents
    documentFiles.forEach((file, index) => {
      formData.append(`documents[]`, file);  // Multiple file uploads
    });

    // Send form data to the server
    axios.post(`${apiUrl}/api/jobs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true  // Include credentials (session cookie)
    })
      .then(() => {
        onJobAdded();  // Refresh the job list
        setNewJob({
          title: '',
          company: '',
          job_post_link: '',
          salary: '',
          location_type: 'Remote',
          job_type: 'Full-time',
          status: 'Saved',
          job_description: '',
          notes: [],
          documents: []
        });
        setDocumentFiles([]);  // Clear document files after submission
      })
      .catch(error => console.error('Error adding job:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Job</h2>

      {/* Job fields */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newJob.title}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={newJob.company}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="job_post_link" className="block text-sm font-medium text-gray-700">Job Post Link</label>
        <input
          type="url"
          id="job_post_link"
          name="job_post_link"
          value={newJob.job_post_link}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
        <input
          type="number"
          id="salary"
          name="salary"
          value={newJob.salary}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">Location Type</label>
        <select
          id="location_type"
          name="location_type"
          value={newJob.location_type}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        >
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Office based">Office based</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">Job Type</label>
        <select
          id="job_type"
          name="job_type"
          value={newJob.job_type}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        >
          <option value="Full-time">Full-time</option>
          <option value="Half-time">Half-time</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          value={newJob.status}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        >
          <option value="Saved">Saved</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="job_description" className="block text-sm font-medium text-gray-700">Job Description</label>
        <textarea
          id="job_description"
          name="job_description"
          value={newJob.job_description}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        ></textarea>
      </div>

      {/* Notes Section */}
      <div className="mb-4">
        <label htmlFor="note_stage" className="block text-sm font-medium text-gray-700">Note Stage</label>
        <select
          id="note_stage"
          name="note_stage"
          value={noteStage}
          onChange={(e) => setNoteStage(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        >
          <option value="Saved">Saved</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="note_text" className="block text-sm font-medium text-gray-700">Note Text</label>
        <textarea
          id="note_text"
          name="note_text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        ></textarea>
        <button type="button" onClick={handleAddNote} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Note
        </button>
      </div>

      {/* Display and manage added notes */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">Notes</h3>
        {newJob.notes.length > 0 ? (
          <ul className="list-disc pl-5">
            {newJob.notes.map((note, index) => (
              <li key={index} className="mb-2">
                {editingNoteIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                    />
                    <select
                      value={editNoteStage}
                      onChange={(e) => setEditNoteStage(e.target.value)}
                      className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                    >
                      <option value="Saved">Saved</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveNote(index)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>{note.stage}:</strong> {note.note_text}
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleEditNote(index)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md"
                      >
                        Edit
                      </button>
                      {confirmDeleteIndex === index ? (
                        <>
                          <span>Are you sure?</span>
                          <button
                            type="button"
                            onClick={() => confirmRemoveNote(index)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={cancelRemoveNote}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(index)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No notes added yet.</p>
        )}
      </div>

      {/* Documents Section */}
      <div className="mb-4">
        <label htmlFor="documents" className="block text-sm font-medium text-gray-700">Upload Documents</label>
        <input
          type="file"
          id="documents"
          name="documents"
          multiple
          onChange={handleFileChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Display and manage added documents */}
      {documentFiles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Documents</h3>
          <ul className="list-disc pl-5">
            {documentFiles.map((file, index) => (
              <li key={index} className="mb-2">
                {file.name}
                <button
                  type="button"
                  onClick={() => handleRemoveDocument(index)}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Job
        </button>
      </div>
    </form>
  );
}

export default AddJob;
