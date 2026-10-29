import { createBrowserRouter, Navigate } from "react-router-dom";
import Admin from "../features/Admin/pages/Admin.jsx";
import Arena from "../features/Arena/pages/Arena.jsx";
import Chat from "../features/chat/pages/Chat.jsx";
import Home from "../features/Home/Home.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Video from "../features/video/pages/Video.jsx";
import AppLayout from "./AppLayout.jsx";
import { GuestOnly, Protected } from "./Protected.jsx";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },
      {
        element: <Protected />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/arena", element: <Arena /> },
          { path: "/chat", element: <Chat /> },
          { path: "/video", element: <Video /> },
          {
            element: <Protected adminOnly />,
            children: [{ path: "/admin", element: <Admin /> }],
          },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
