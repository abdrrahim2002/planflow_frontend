import { defer, useLoaderData, Await, useRouteLoaderData, Navigate } from "react-router-dom";
import Project from "../components/Project";
import { getAuthToken } from "../util/auth";
import { Suspense } from "react";
import classes from '../modules/ProjectList.module.css';

const apiUrl = import.meta.env.VITE_API_URL;


export default function ProjectsList () {
  //check if the user is logged in
  const token = useRouteLoaderData('root');
  
  if(!token) {
    return <Navigate to="/" replace />;
  }
  
  const { event } = useLoaderData();
  
  
  
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Await resolve={event}>
      
      {(loadedEvent) => {
          // Handle errors
          if (loadedEvent.error) {
            return <p>{loadedEvent.error}</p>;
          }
          
          // Render the list of projects
          return (
            <div className={classes.project_list}>
              {loadedEvent.map((project) => (
                <Project key={project.id} data={project} />
              ))}
            </div>
          );
        }}
        
      </Await>
    </Suspense>  
  )
}

//load the data
async function loaderEvent () {
  
  const token =  getAuthToken();
  
  const response = await fetch(`${apiUrl}/project/projects/`, {
    method:'GET',
    headers: {
      'Authorization': `token ${token}`
    }
  })
  
  if (!response.ok) {
    return {'error':'error happend could not load the data'}
  }
  
  
  const responseData = await response.json();
  
  return responseData;
  
}

export function loader() {
  return defer({
    event: loaderEvent(),
  });
}