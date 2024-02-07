import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom"
import App from "./App"
import ErrorPage from "./components/ErrorPage"
import Threads from "./components/Threads"
import Profile from "./components/Profile"
import Thread from "./components/Thread"
import Friends from "./components/Friends"

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },
    {
      path: "users/friends",
      element: <Friends />,
    },
    {
      path: "users/profiles/:profileid",
      element: <ProfileWrapper />,
    },
    {
      path: "users/threads",
      element: <Threads />,
    },
    {
      path: "users/threads/:threadid",
      element: <ThreadWrapper />,
    },
  ])

  return <RouterProvider router={router} />
}

const ProfileWrapper = () => {
  const { profileid } = useParams();
  return <Profile profileId={profileid} />;
};

const ThreadWrapper = () => {
  const { threadid } = useParams();
  return <Thread threadId={threadid} />;
};

export default Router
