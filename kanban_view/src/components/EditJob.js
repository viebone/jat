import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditJob({ job, onJobEdited, fetchCsrfToken }) {
  const [updatedJob, setUpdatedJob] = useState(job);
  const [newNoteText, setNewNoteText] = useState('');  // For adding new notes
  const [newNoteStage, setNewNoteStage] = useState('Saved');  // For selecting the stage of a new note
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);  // Track the index of the note being edited
  const [editNoteText, setEditNoteText] = useState('');  // Track the text of the note being edited
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);  // Track the index of the note being confirmed for deletion

  const [newDocumentFiles, setNewDocumentFiles] = useState([]);  // For handling new document uploads
  const [removeDocumentIds, setRemoveDocumentIds] = useState([]);  // Track documents to be removed
  const [removeNoteIds, setRemoveNoteIds] = useState([]);  // Track notes to be removed

  // Populate form with job data when the component mounts or when the job prop changes
  useEffect(() => {
    if (job) {
      setUpdatedJob(job);
    }
  }, [job]);

  const handleChange = (e) => {
    setUpdatedJob({ ...updatedJob, [e.target.name]: e.target.value });
  };

  // Add a new note
  const handleAddNote = () => {
    if (newNoteText.trim()) {
      const newNote = { stage: newNoteStage, note_text: newNoteText };
      setUpdatedJob((prevJob) => ({
        ...prevJob,
        notes: [...prevJob.notes, newNote],
      }));
      setNewNoteText('');  // Clear input after adding
    }
  };

  // Start editing a note
  const handleEditNote = (index) => {
    setEditingNoteIndex(index);
    setEditNoteText(updatedJob.notes[index].note_text);  // Set the current note text in the edit field
  };

  // Save the edited note
  const handleSaveNote = (index) => {
    const updatedNotes = [...updatedJob.notes];
    updatedNotes[index].note_text = editNoteText;  // Update the note text
    setUpdatedJob((prevJob) => ({
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
    const noteToRemove = updatedJob.notes[index];
    if (noteToRemove.id) {
      // Add the note ID to removeNoteIds array
      setRemoveNoteIds((prevIds) => [...prevIds, noteToRemove.id]);
    }
    // Remove the note from the UI
    setUpdatedJob((prevJob) => ({
      ...prevJob,
      notes: prevJob.notes.filter((_, i) => i !== index),
    }));
    setConfirmDeleteIndex(null);  // Reset confirmation
  };

  const cancelRemoveNote = () => {
    setConfirmDeleteIndex(null);  // Reset confirmation
  };

  // Handle document file selection
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewDocumentFiles(files);
  };

  // Remove a document from the list of existing documents
  const handleRemoveDocument = (docId) => {
    setRemoveDocumentIds((prevIds) => [...prevIds, docId]);  // Add the document ID to remove
    setUpdatedJob((prevJob) => ({
      ...prevJob,
      documents: prevJob.documents.filter((doc) => doc.id !== docId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch the CSRF token using the prop
    const csrfToken = await fetchCsrfToken();
    if (!csrfToken) {
      console.error('CSRF token not available');
      return;
    }

    // Sanitize input fields
    const sanitizedJobTitle = updatedJob.job_title.trim();
    const sanitizedCompany = updatedJob.company.trim();
    const sanitizedJobPostLink = updatedJob.job_post_link.trim();
    const sanitizedSalary = updatedJob.salary;

    const formData = new FormData();
    formData.append('title', sanitizedJobTitle);
    formData.append('company', sanitizedCompany);
    formData.append('job_post_link', sanitizedJobPostLink);
    formData.append('salary', sanitizedSalary);
    formData.append('location_type', updatedJob.location_type);
    formData.append('job_type', updatedJob.job_type);
    formData.append('status', updatedJob.status);
    formData.append('job_description', updatedJob.job_description);

    // Add notes to formData
    updatedJob.notes.forEach((note, index) => {
      console.log('notes:', note); // Add this line for debugging
      if (note.id) {
        formData.append(`notes[${index}][id]`, note.id);  // Add existing note ID if available
      }
      formData.append(`notes[${index}][stage]`, note.stage);
      formData.append(`notes[${index}][note_text]`, note.note_text);
    });

    // Attach new documents to formData
    newDocumentFiles.forEach((file) => {
      formData.append('documents[]', file);
    });

    // Add IDs of documents to remove
    console.log('Remove Document IDs:', removeDocumentIds); // Add this line for debugging

    removeDocumentIds.forEach((docId) => {
      formData.append('remove_document_ids[]', docId);
    });

    // Add IDs of notes to remove
    removeNoteIds.forEach((noteId) => {
      formData.append('remove_note_ids[]', noteId);
    });

    // Make the PUT request with CSRF token in the headers
  axios.put(`${process.env.REACT_APP_API_URL}/api/jobs/${updatedJob.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-CSRFToken': csrfToken,  // Include the CSRF token
    },
    withCredentials: true,  // Ensure credentials are included
  })
  .then(() => {
    onJobEdited();
  })
  .catch((error) => console.error('Error updating job:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Job fields */}
      <div>
        <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          type="text"
          id="job_title"
          name="job_title"
          value={updatedJob?.job_title || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={updatedJob?.company || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="job_post_link" className="block text-sm font-medium text-gray-700">Job Post Link</label>
        <input
          type="url"
          id="job_post_link"
          name="job_post_link"
          value={updatedJob?.job_post_link || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
        <input
          type="number"
          id="salary"
          name="salary"
          value={updatedJob?.salary || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">Location Type</label>
        <select
          id="location_type"
          name="location_type"
          value={updatedJob?.location_type || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        >
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Office based">Office based</option>
        </select>
      </div>

      <div>
        <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">Job Type</label>
        <select
          id="job_type"
          name="job_type"
          value={updatedJob?.job_type || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        >
          <option value="Full-time">Full-time</option>
          <option value="Half-time">Half-time</option>
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          value={updatedJob?.status || ''}
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

      <div>
        <label htmlFor="job_description" className="block text-sm font-medium text-gray-700">Job Description</label>
        <textarea
          id="job_description"
          name="job_description"
          value={updatedJob?.job_description || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>

      {/* Notes Section */}
      <div>
        <h3 className="block text-sm font-medium text-gray-700">Notes</h3>
        {updatedJob?.notes?.length > 0 ? (
          <ul className="list-disc pl-5">
            {updatedJob.notes.map((note, index) => (
              <li key={index} className="mb-4">
                {/* Edit mode */}
                {editingNoteIndex === index ? (
                  <div className="space-y-2">
                    <textarea
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      className="p-2 block w-full border border-gray-300 rounded-md"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSaveNote(index)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
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
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Edit
                      </button>
                      {confirmDeleteIndex === index ? (
                        <>
                          <span>Are you sure?</span>
                          <button
                            type="button"
                            onClick={() => confirmRemoveNote(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={cancelRemoveNote}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
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
          <p>No notes added yet.</p>
        )}
      </div>

      {/* Add New Note */}
      <div>
        <label htmlFor="note_stage" className="block text-sm font-medium text-gray-700">Note Stage</label>
        <select
          id="note_stage"
          name="note_stage"
          value={newNoteStage}
          onChange={(e) => setNewNoteStage(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        >
          <option value="Saved">Saved</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label htmlFor="note_text" className="block text-sm font-medium text-gray-700">Note Text</label>
        <textarea
          id="note_text"
          name="note_text"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
        <button type="button" onClick={handleAddNote} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">
          Add Note
        </button>
      </div>

      {/* Document Section */}
      <div>
        <h3 className="block text-sm font-medium text-gray-700">Documents</h3>
        <input
          type="file"
          multiple
          onChange={handleDocumentUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 mt-2"
        />
        <ul className="list-disc pl-5 mt-2">
          {updatedJob?.documents?.map((doc) => (
            <li key={doc.id} className="flex justify-between items-center mb-2">
              <a href={`${process.env.REACT_APP_API_URL}/${doc.document_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {doc.document_name}
              </a>
              <button
                type="button"
                onClick={() => handleRemoveDocument(doc.id)}
                className="ml-4 text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditJob;
