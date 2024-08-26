function EditJob({ job, onJobEdited }) {
    const [editedJob, setEditedJob] = useState(job);
  
    const handleChange = (e) => {
      setEditedJob({ ...editedJob, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = () => {
      axios.put(`${process.env.REACT_APP_API_URL}/api/jobs/${job.id}`, editedJob)
        .then(response => {
          onJobEdited();  // Refresh job list after successful edit
        })
        .catch(error => console.error('Error editing job:', error));
    };
  
    return (
      <div>
        <input name="title" placeholder="Job Title" value={editedJob.title} onChange={handleChange} />
        <input name="company" placeholder="Company" value={editedJob.company} onChange={handleChange} />
        {/* Add more input fields as needed */}
        <button onClick={handleSubmit}>Save Changes</button>
      </div>
    );
  }
  
  export default EditJob;
  