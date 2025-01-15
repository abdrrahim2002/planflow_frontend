import { Form, redirect, useActionData, useNavigation, useRouteLoaderData, Navigate } from 'react-router-dom'
import classes from '../modules/NewProject.module.css';
import { getAuthToken } from '../util/auth';
import { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;


export default function NewProject() {
  //check if the user is logged in
  const token = useRouteLoaderData('root');
  
  if(!token) {
    return <Navigate to="/" replace />;
  }
  
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  const [summarize, setSummarize] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  //use the summarize functionality
  async function handleSummarize() {
    if (summarize.trim() === '') {
      alert('the text in description is empty you need to type on it, so you can use the summarize option');
      return;
    }
    const token = getAuthToken();
    
    const data = new FormData();
    data.append('text', summarize.trim());
    
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
      setIsSummarizing(false)
      return;
    }
    
    const responseData = await response.json();
    setSummarize(responseData.summurize[0].summary_text);
    setIsSummarizing(false)
    
    return;
  }
  
  
  return (
    <Form className={`${classes.new_project_form}`} method='post' encType="multipart/form-data">
      
      {data && data.error && <p style={{ color: 'red' }}>{data.error}</p>}
      
      <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" required/>
      </div>
      
      <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" rows="4" value={summarize} onChange={(event) => setSummarize(event.target.value)} disabled={isSummarizing} required></textarea>
          <button type='button' className='btn btn-outline-primary' onClick={()=>handleSummarize()} disabled={isSummarizing}>{isSummarizing ? 'Summurizing...' : 'Summurize'}</button>
      </div>
      
      <div className="form-group">
          <label htmlFor="startdate">Start Date:</label>
          <input type="date" id="startdate" name="startdate" required/>
      </div>
      
      <div className="form-group">
          <label htmlFor="enddate">End Date:</label>
          <input type="date" id="enddate" name="enddate" required/>
      </div>
      
      <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select id="category" name="category">
              <option value="Planning">Planning</option>
              <option value="Development">Development</option>
              <option value="Strategy">Strategy</option>
              <option value="Management">Management</option>
              <option value="Marketing">Marketing</option>
          </select>
      </div>
      
      <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select id="priority" name="priority">
              <option value="Low"> Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
          </select>
      </div>
      
      <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status">
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
          </select>
      </div>
      
      <div className="form-group">
          <label htmlFor="image1">Image 1:</label>
          <input type="file" id="image1" name="image1" accept="image/*"/>
      </div>
      <div className="form-group">
          <label htmlFor="image2">Image 2:</label>
          <input type="file" id="image2" name="image2" accept="image/*"/>
      </div>
      
      <button className='btn btn-outline-success' type="submit" disabled={isSubmitting || isSummarizing}>{isSubmitting ? 'Submitting...': 'Submit'}</button>
      {data && data.error && <p style={{ color: 'red' }}>{data.error}</p>}
    </Form>
  )
}

export async function action ({request}) {
  //get the data
  const data = await request.formData();
  
  //get the token
  const token = getAuthToken();
  
  // check the enddate > or = startdate
  
  const startdate = new Date(data.get('startdate'));
  const enddate = new Date(data.get('enddate'));
  
  if (startdate > enddate) {
    return {'error' : 'End Date must be after the Start Date'}
  }
  
  
  //send the fetch
  
  
  const response = await fetch(`${apiUrl}/project/new-project/`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`
    },
    body: data
  });
  
  if (!response.ok) {
    return {'error' : 'Could not save the project'};
  }
  
  return redirect('/projects');
  
}