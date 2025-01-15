import { useLoaderData, Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useState } from 'react';
import classes from '../modules/ProjectUpdate.module.css';
import { getAuthToken } from '../util/auth';

const apiUrl = import.meta.env.VITE_API_URL;


export default function ProjectUpdate(){
  
  const { project } = useLoaderData();
  const data = useActionData();
  
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  
  //handle input changes
  
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    startdate: project.startdate,
    enddate: project.enddate,
    category: project.category,
    priority: project.priority,
    status: project.status,
    deleteImage1:false,
    deleteImage2:false,
    image1: project.image1,
    image2: project.image2,
    newImage1:null,
    newImage2:null
  });
  
  //traking action
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  
  //send the summarize request
  async function handleSummarize() {
    if (formData.description.trim() === '') {
      alert('the text in description is empty you need to type on it, so you can use the summarize option');
      return;
    }
    const token = getAuthToken();
    
    const data = new FormData();
    data.append('text', formData.description.trim());
    
    setIsSummarizing(true);
    
    const response = await fetch(`${apiUrl}/project/summarize-text/`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`
      },
      body: data
    });

    if(!response.ok) {
      alert('could not do the summurize');
      setIsSummarizing(false);
      return;
    }

    const responseData = await response.json();


    setFormData({
      ...formData,
      description: responseData.summurize[0].summary_text,
    });
    setIsSummarizing(false)

    return;

    
    
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  
  
  //function to delete the image
  const handleDeleteImage = (image) => {
    
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [image]: true, // Remove the image
      };
      
      return updatedFormData;
    });
  };
  
  
  
  return (
    <>
      
      
      <Form className={`${classes.update_project_form}`} method='post' encType="multipart/form-data">
        
        {data && data.error && <p style={{ color: 'red' }}>{data.error}</p>}
        
        <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleInputChange} required></textarea>
            <button type='button' className='btn btn-outline-primary' onClick={()=>handleSummarize()} disabled={isSummarizing}>{isSummarizing ? 'Summurizing...' : 'Summurize'}</button>
        </div>
        
        <div className="form-group">
            <label htmlFor="startdate">Start Date:</label>
            <input type="date" id="startdate" name="startdate" value={formData.startdate} onChange={handleInputChange} required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="enddate">End Date:</label>
            <input type="date" id="enddate" name="enddate" value={formData.enddate} onChange={handleInputChange} required/>
        </div>
        
        <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Planning">Planning</option>
                <option value="Development">Development</option>
                <option value="Strategy">Strategy</option>
                <option value="Management">Management</option>
                <option value="Marketing">Marketing</option>
            </select>
        </div>
        
        <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="Low"> Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
        
        <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        </div>
        
        {!formData.deleteImage1 && formData.image1 ? 
          <div>
            <img
              src={`${apiUrl}${project.image1}`}
              alt="Existing Image 1"
              style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
            />
            <button
              disabled={isSubmitting || isSummarizing}
              type="button"
              onClick={() => handleDeleteImage('deleteImage1')}
              className="btn btn-outline-danger"
            >
              Delete Image
            </button>
          </div>
        :         
          <div className="form-group">
              <label htmlFor="image1">Image 1:</label>
              <input type="file" id="image1" name="image1" accept="image/*"/>
          </div>
        }
        
        {!formData.deleteImage2 && formData.image2 ? 
          <div>
            <img
              src={`${apiUrl}${project.image2}`}
              alt="Existing Image 1"
              style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
            />
            <button
              disabled={isSubmitting || isSummarizing}
              type="button"
              onClick={() => handleDeleteImage('deleteImage2')}
              className="btn btn-outline-danger"
            >
              Delete Image
            </button>
          </div>
        : 
          <div className="form-group">
            <label htmlFor="image2">Image 2:</label>
            <input type="file" id="image2" name="image2" accept="image/*"/>
          </div>
        }
        
        
        <button type="submit" className='btn btn-outline-success' disabled={isSubmitting || isSummarizing}>{isSubmitting ? 'Updating...':'Update'}</button>
        {data && data.error && <p style={{ color: 'red' }}>{data.error}</p>}
      </Form>
      
    </>
  );
}



//for the loading
async function loadEvent(id){
  
  const token = getAuthToken();
  
  const response = await fetch(`${apiUrl}/project/detail/${id}`,{
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`
    }
  });

  // Handle 403 Forbidden (permission denied) and other errors
  if (!response.ok) {
    throw new Error('page not found');
  }
  
  const responseData = await response.json();
  
  return responseData;
}




export async function loader ({params}) {
  const id = params.projectId;
  
  const project = await loadEvent(id);
  return {project};
  
}



//for the action

export async function action({request, params}) {
  //get the user token
  const token = getAuthToken();
  
  //get and format the data
  const data = await request.formData();
  
  
  // check the enddate > or = startdate
  
  const startdate = new Date(data.get('startdate'));
  const enddate = new Date(data.get('enddate'));
  
  if (startdate > enddate) {
    return {'error' : 'End Date must be after the Start Date'}
  }
  
  
  const response = await fetch(`${apiUrl}/project/detail/${params.projectId}`, {
    method:'PATCH',
    headers: {
      'Authorization':`token ${token}`
    },
    body:data
  })
  
  if (!response.ok) {
    return {'error': 'could not update'};
  }
  
  return redirect('/projects');
}
