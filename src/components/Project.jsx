import classes from '../modules/Project.module.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

const apiUrl = import.meta.env.VITE_API_URL;


export default function Project({ data }) {
  
  const [isExporting, setIsExporting] = useState(false);
  
  //for naviagation 
  const navigate = useNavigate();
  
  //function to send the delete request
  async function handleDelete(id) {
    
    const token = getAuthToken();
    
    // Show a confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this project?');
    if (!confirmed) {
      return; // Stop if the user cancels
    }
    
    
    const response = await fetch(`${apiUrl}/project/project-delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`
      }
    });
    
    if (!response.ok) {
      alert('could not delete')
      return;
    }
    
    // Redirect to the same page
    
    navigate('');
    return;
    
  }
  
  
  
  //handling the extraction
  async function handleExportPdf(projectId, projectTitle){
    setIsExporting(true);
    
    const token = getAuthToken();
    
    try {
      const response = await fetch(
        `${apiUrl}/project/${projectId}/export-pdf/`,
        {
          method: 'GET',
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        console.log('Could not export PDF');
        return { error: 'Could not export PDF' };
      }
      
      // Trigger the download of the PDF file
      const blob = await response.blob();
      console.log(blob);
      
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('Export done');
      return { message: 'Done exporting' };
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return { error: 'Error exporting PDF' };
    } finally{
      setIsExporting(false);
    }
  };
  
  
  
  
  return(
    <>
      <div className={classes.project_card}>
        <h3 className={classes.project_title}>{data.title}</h3>
        <p className={classes.project_description}>{data.description}</p>
        <div className={classes.project_details}>
          <span className="project-date">Start Date: {data.startdate}</span>
          <span className="project-date">End Date: {data.enddate}</span>
          <span className="project-category">Category: {data.category}</span>
          <span className="project-priority">Priority: {data.priority}</span>
          <span className="project-status">Status: In {data.status}</span>
        </div>
        <div className={classes.project_images}>
          { data.image1 && <img src={`${apiUrl}${data.image1}`} alt="Image" className={classes.project_image}/> }
          { data.image2 && <img src={`${apiUrl}${data.image2}`} alt="Image" className={classes.project_image}/> }
        </div>
        
        <div className={classes.editing}>
          <button onClick={() => {handleDelete(data.id)}} className='btn btn-outline-danger' disabled={isExporting}>Delete</button>
          <Link to={`/project/${data.id}`}><button className="btn btn-outline-dark" disabled={isExporting}>Edit</button></Link>
          <button onClick={() => handleExportPdf(data.id, data.title)} className="btn btn-outline-dark" disabled={isExporting}>{isExporting ? 'Exporting...': 'Export as PDF'}</button>
          <Link to={`/share/${data.id}`}><button className='btn btn-outline-dark' disabled={isExporting}>Share by email</button></Link>
          
        </div>
      </div>
    </>
  );
}

