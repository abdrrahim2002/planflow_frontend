import { Form, useLoaderData, useNavigation, useActionData } from 'react-router-dom'; 
import { getAuthToken } from '../util/auth';
import classes from '../modules/EmailShare.module.css';
const apiUrl = import.meta.env.VITE_API_URL;

export default function EmailShare() {
  
  const { project } = useLoaderData();

  const data = useActionData();
  
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  
  return(
    <Form className={classes.email_share_form} method='post'>
      {data && data.error && <p style={{ color: 'red' }}>{data.error}</p>}
      {data && data.message && <p style={{ color: 'green' }}>{data.message}</p>}
      
      <h1>Share Project by Email</h1>
      <h3>project name : {project.title}</h3>
      
      <div className="form-group">
        <label htmlFor="email">Recipient Email:</label>
        <input type="email" id='email' name='email' placeholder="Enter recipient's email" required/>
      </div>
      
      <div className='form-group'>
        <label htmlFor="share">Share:</label>
        <select id="share" name="share" required>
          <option value="description">Description Only</option>
          <option value="all">All Project Data (PDF)</option>
        </select>
      </div>
      
      <button className='btn btn-outline-success' disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send'}</button>
      {data && data.error && <p style={{ color: 'red' }}>{data.error}</p>}
      {data && data.message && <p style={{ color: 'green' }}>{data.message}</p>}
    </Form>
  
  )
}


//send the email
export async function action ({request, params}) {
  
  const token = getAuthToken();
  
  const data = await request.formData();
  
  data.append('id', params.projectId);
  
  const response = await fetch(`${apiUrl}/project/share/`, {
    method:'POST',
    headers: {
      'Authorization':`token ${token}`,
    },
    body: data
  })
  
  if (!response.ok) {
    const responseData = await response.json()
    return {'error':responseData.message}
  }
  
  return {'message':'Message sent successfully'}
  
}
