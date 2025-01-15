import { Form, redirect, useNavigation, useActionData, useRouteLoaderData, Navigate } from 'react-router-dom';
import classes from '../modules/Login.module.css';
const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  
  //check if the user submit
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  //check for errors
  const data = useActionData();
  
  //check if user is authenticated and have the token to prevent him to access this url
  const token = useRouteLoaderData('root');
  
  if (token) {
    return <Navigate to="/" replace />;
  }
  
  
  
  return (
    <div className={classes.login_container} >
        <h2>Login</h2>
        <Form method="post">  
          
          {data && data.error && (<p style={{color:'red'}}>{data.error}</p>)}
          
          <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required/>
          </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required/>
            </div>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Loading...' : 'Login'}</button>
        </Form>
    </div>
  );
}

//login action
export async function action({request}) {
  const data = await request.formData();
  
  const eventData = {
    username: data.get('username'),
    password: data.get('password')
  }
  
  const response = await fetch(`${apiUrl}/auth/login/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    return {error:Object.values(errorData)[0][0]};
  }
  
  const responseData = await response.json();
  localStorage.setItem('token', `${responseData.token}`)
  return redirect('/');
}