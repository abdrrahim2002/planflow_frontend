import { createBrowserRouter, RouterProvider } from 'react-router-dom'

//pages
import Root from './pages/Root';
import Error from './pages/Error';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectsList from './pages/ProjectsList';
import ProjectUpdate from './pages/ProjectUpdate';
import EmailShare from './pages/EmailShare';
import NewProject from './pages/NewProject';

//actions
import { action as signupAction } from './pages/Signup';
import { action as logoutAction } from './pages/Logout';
import { action as loginAction } from './pages/Login';
import { action as newProjectAction } from './pages/NewProject';
import { action as updateProjectAction } from './pages/ProjectUpdate';
import { action as shareProjectAction } from './pages/EmailShare';

//loaders
import { getAuthToken as tokenLoader } from './util/auth';
import { loader as loaderProjects } from './pages/ProjectsList';
import { loader as loaderProjectUpdate } from './pages/ProjectUpdate';


const router = createBrowserRouter([
  {
    path:'/', 
    element: <Root/>,
    errorElement:<Error/>,
    loader:tokenLoader,
    id:'root',
    children: [
      {
        index: true,
        element: <Home /> 
      },
      {
        path:'login',
        element:<Login/>,
        action:loginAction
      },
      {
        path: 'signup',
        element: <Signup/>,
        action: signupAction,
      },
      {
        path: 'logout',
        action: logoutAction,
      },
      {
        path:'new-project',
        element: <NewProject/>,
        action: newProjectAction
      },
      {
        path: 'projects',
        element: <ProjectsList/>,
        loader:loaderProjects
      },
      {
        path: 'project/:projectId',
        element: <ProjectUpdate/>,
        loader: loaderProjectUpdate,
        action: updateProjectAction,
        errorElement: <Error />,
        id:'project-detail'
      },
      {
        path: 'share/:projectId',
        element: <EmailShare/>,
        //errorElement: <Error />,
        loader: loaderProjectUpdate,
        action: shareProjectAction
      }
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
