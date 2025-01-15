import { Link, useRouteLoaderData } from 'react-router-dom';
import classes from '../modules/Home.module.css';

export default function Home () {
  
  const token = useRouteLoaderData('root');
  
  return (
    
    <div className="card position-absolute top-50 start-50 translate-middle">
      <div className="card-header">
        PLANFLOW 📋
      </div>
      <div className="card-body">
        <p className="card-text">PlanFlow is a simple project planning tool where authenticated users can manage their projects through an interactive dashboard. Users will be able to create, edit, and delete projects, generate descriptions with AI, export project details as a PDF, and optionally send them via email.</p>
        
        {!token &&
          <div className={classes.button}>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Singup</Link>
          </div>
        }
        
      </div>
    </div>
    
  )
}