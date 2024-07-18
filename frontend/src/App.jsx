import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth,} from "@/layouts";
import { SignIn, SignUp } from "./pages/auth";
import UserList from "./UserList";
import Profile from "./pages/dashboard/profile";


function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/sign-in"    element={<SignIn />} />
        <Route path="/auth/sign-up"    element={<SignUp />} />
        <Route path="/userlist"    element={<UserList />} />
        <Route path="/"    element={<SignUp />} />
        <Route path="/dashboard/profile" element={<Profile />} />

        


      
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/web" element={<Navigate to="/web/home" replace />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
