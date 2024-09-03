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
    documents: ''
  });

  const [noteText, setNoteText] = useState('');  // State to manage individual note text input
  const [noteStage, setNoteStage] = useState('Saved');  // State to manage the stage selection for notes

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleAddNote = () => {
    if (noteText) {
      setNewJob({
        ...newJob,
        notes: [...newJob.notes, { stage: noteStage, note_text: noteText }]
      });
      setNoteText('');  // Clear the note input after adding
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    axios.post(`${apiUrl}/api/jobs`, newJob)
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
          notes: [],  // Clear notes after submission
          documents: ''
        });
      })
      .catch(error => console.error('Error adding job:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Job</h2>

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
        <label htmlFor="note_text" className="block text-sm font-medium text-gray-700">Note</label>
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

      {/* Display added notes */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">Notes</h3>
        {newJob.notes.length > 0 ? (
          <ul className="list-disc pl-5">
            {newJob.notes.map((note, index) => (
              <li key={index}>
                <strong>{note.stage}:</strong> {note.note_text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No notes added yet.</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="documents" className="block text-sm font-medium text-gray-700">Documents</label>
        <textarea
          id="documents"
          name="documents"
          value={newJob.documents}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        ></textarea>
      </div>

      <div className="text-center">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Job
        </button>
      </div>
    </form>
  );
}

export default AddJob;
