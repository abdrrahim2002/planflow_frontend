import { Link } from "react-router-dom";
import classes from '../modules/Error.module.css';
import { useRouteError } from 'react-router-dom';



export default function Error() {
   const error = useRouteError();
  return (
    <>
      <div className={classes.container}>
        <h1>404</h1>
        <p>Oops! The page you&apos;re looking for could not be found.</p>
        <p>You can return to the <Link to="/">homepage</Link></p>
      </div>
    </>
    
  )
}
