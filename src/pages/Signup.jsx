import { Form, Navigate, redirect, useActionData, useNavigation, useRouteLoaderData } from 'react-router-dom';
import classes from '../modules/Signup.module.css';

const apiUrl = import.meta.env.VITE_API_URL;


export default function Singup () {
  
  //check if the user submit
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  //check for errors
  const data = useActionData();
  
  //check if user is authenticated and have the token to prevent him to access this url
  const token = useRouteLoaderData('root');
  
  if(token) {
    return <Navigate to='/' replace/>
  }
  
  
  
  return (
    <>
      <div className={classes.signup_container}>
        <h2>Signup</h2>
        <Form method="post">
          
          {data && data.error && (
            <p style={{color: 'red'}}>{data.error}</p>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required/>
          </div>
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input type="password" id="confirm_password" name="confirm_password" required/>
          </div>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submiting' : 'Signup'}</button>
        </Form>
      </div>
    </>
  )
}



export async function action({request}) {
  const data = await request.formData();
  
  const eventData = {
    username : data.get('username'),
    email : data.get('email'),
    password : data.get('password'),
    password2 : data.get('confirm_password')
  };
  
  
  const response = await fetch (`${apiUrl}/auth/signup/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  
  if(!response.ok){
    
    const errorData = await response.json();
    
    return {error: Object.values(errorData.error)};
    
    
    
  }
  const responseData = await response.json()
  localStorage.setItem('token', `${responseData.token}`)  
  
  return redirect('/');
}  
