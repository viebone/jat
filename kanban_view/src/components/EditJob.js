import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditJob({ job, onJobEdited }) {
  const [updatedJob, setUpdatedJob] = useState(job);

  // Ensure the form is populated with the job data when the component mounts or the job prop changes
  useEffect(() => {
    if (job) {
      setUpdatedJob(job);  // Ensure the form is prefilled with the job data
    }
  }, [job]);

  const handleChange = (e) => {
    setUpdatedJob({ ...updatedJob, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_URL}/api/jobs/${updatedJob.id}`, {
      title: updatedJob.job_title, // Make sure this is what your backend expects
      company: updatedJob.company,
      job_post_link: updatedJob.job_post_link,
      salary: updatedJob.salary,
      location_type: updatedJob.location_type,
      job_type: updatedJob.job_type,
      status: updatedJob.status,
      job_description: updatedJob.job_description,
      notes: updatedJob.notes,
      documents: updatedJob.documents
    })
    .then(() => {
      onJobEdited();  // Close the modal and refresh jobs after editing
    })
    .catch(error => console.error('Error updating job:', error));
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Job Title</label>
        <input
          type="text"
          id="job_title"
          name="job_title"
          value={updatedJob?.job_title || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Job Title"
          required
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={updatedJob?.company || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Company"
          required
        />
      </div>

      <div>
        <label htmlFor="job_post_link" className="block text-sm font-medium text-gray-700">Job Post Link</label>
        <input
          type="url"
          id="job_post_link"
          name="job_post_link"
          value={updatedJob?.job_post_link || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Job Post Link"
        />
      </div>

      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
        <input
          type="number"
          id="salary"
          name="salary"
          value={updatedJob?.salary || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Salary"
        />
      </div>

      <div>
        <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">Location Type</label>
        <select
          id="location_type"
          name="location_type"
          value={updatedJob?.location_type || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          value={updatedJob?.job_type || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          value={updatedJob?.status || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
          value={updatedJob?.job_description || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Job Description"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={updatedJob?.notes || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Notes"
        />
      </div>

      <div>
        <label htmlFor="documents" className="block text-sm font-medium text-gray-700">Documents</label>
        <textarea
          id="documents"
          name="documents"
          value={updatedJob?.documents || ''}  // Ensure the field is populated
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Documents"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

export default EditJob;
