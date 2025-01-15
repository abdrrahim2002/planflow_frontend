import { Form, NavLink, useRouteLoaderData } from "react-router-dom"
import classes from '../modules/MainNavigation.module.css';

export default function MainNavication () {
  
  const token = useRouteLoaderData('root');
  
  
  return (
    <nav className={`${classes.mainnavebar} navbar navbar-expand-lg navbar-dark bg-dark`}>
      <div className='container-fluid'>
        <NavLink className={({ isActive }) => `btn btn-outline-success ${classes.home} ${isActive ? 'active' : ''}`}  to="/">PLANFLOW</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              {token ? 
              <>
                <NavLink className={({ isActive }) => `btn btn-outline-light ${isActive ? 'active' : ''}`} aria-current="page" to='/new-project'>Plan new project</NavLink> 
                <NavLink className={({ isActive }) => `btn btn-outline-light ${isActive ? 'active' : ''}`} aria-current="page" to='/projects'>My plans</NavLink> 
                
              </>
                :
                <NavLink className={({ isActive }) => `btn btn-outline-light ${isActive ? 'active' : ''}`} aria-current="page" to="/login">Login</NavLink>
                
              } 
            </li>
            <li className="nav-item">
              {token ?
                <Form action="/logout" method="post">
                  <button type="submit" className="btn btn-outline-danger" >Logout</button>
                </Form> 
                :
                <NavLink className={({ isActive }) => `btn btn-outline-light ${isActive ? 'active' : ''}`} aria-current="page" to="/signup">Signup</NavLink>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
