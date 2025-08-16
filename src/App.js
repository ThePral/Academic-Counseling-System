// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import './App.css';

// import { UserProvider } from './components/UserContext';

// import Home from './components/Home';
// import LoginSignup from './components/LoginSignup'; 
// import Forgetpass from './components/Forgetpass';
// import ResetCode from './components/ResetCode';
// import Layout from './components/Layout';
// import Dashboard from './components/Dashboard';
// import Planning from './components/Planning';
// import Resources from './components/Resources';

// import Editprof from './components/Editprof';
// import ChangePassword from "./components/ChangePassword";
// import AdvisorSelector from './components/AdvisorSelector';
// import Payment from './components/Payment';


// import AdvisorLayout from './components/AdvisorLayout'
// import AdvisorDashboard from './components/AdvisorDashboard'
// import AdvisorEditprof from './components/AdvisorEditprof'
// import MyStudents from './components/MyStudents'
// import SetTimes from './components/SetTimes'
// import CounselorProfile from './components/CounselorProfile'








// function App() {
//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<LoginSignup />} />
//           <Route path="/forgetpass" element={<Forgetpass />} />
//           <Route path="/ResetCode" element={<ResetCode />} />

//           {/* دانش آموز */}
//           <Route path="/" element={<Layout />}>
//             <Route path="Dashboard" element={<Dashboard />} />
//             <Route path="Planning" element={<Planning />} />
//             <Route path="resources" element={<Resources />} />
//             <Route path="Editprof" element={<Editprof />} />
//             <Route path="ChangePassword" element={<ChangePassword />} />
//             <Route path="AdvisorSelector" element={<AdvisorSelector />} />
//             <Route path="Payment" element={<Payment />} />

//           </Route>

//           {/* مشاور */}
//           <Route path="/Advisor" element={<AdvisorLayout />}>
//             <Route path="AdvisorDashboard" element={<AdvisorDashboard />} />
//             <Route path="AdvisorEditprof" element={<AdvisorEditprof />} />
//             <Route path="MyStudents" element={<MyStudents />} />
//             <Route path="SetTimes" element={<SetTimes />} />

//             <Route path="ChangePassword" element={<ChangePassword />} />
//             {/* <Route path="CounselorProfile" element={<CounselorProfile />} /> */}
//             <Route path="/counselor/:id" element={<CounselorProfile />} />



//             {/* <Route path="profile" element={<AdvisorProfile />} /> */}
//           </Route>


//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;





// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import './App.css';

// import { UserProvider } from './components/UserContext';

// import Home from './components/Home';
// import LoginSignup from './components/LoginSignup'; 
// import Forgetpass from './components/Forgetpass';
// import ResetCode from './components/ResetCode';
// import NewPass from './components/NewPass';
// import Rules from './components/Rules';
// import AboutUs from './components/AboutUs';


// import Layout from './components/Layout';
// import Dashboard from './components/Dashboard';
// import Planning from './components/Planning';
// import Resources from './components/Resources';
// import Editprof from './components/Editprof';
// import ChangePassword from "./components/ChangePassword";
// import AdvisorSelector from './components/AdvisorSelector';
// import StudentProfile from './components/StudentProfile';
// // import StudentInfoCard from './components/StudentInfoCard';

// import Payment from './components/Payment';
// import AdvisorLayout from './components/AdvisorLayout';
// import AdvisorDashboard from './components/AdvisorDashboard';
// import AdvisorEditprof from './components/AdvisorEditprof';
// import MyStudents from './components/MyStudents';
// import SetTimes from './components/SetTimes';
// import CounselorProfile from './components/CounselorProfile';
// import Messages from './components/Messages';


// function App() {
//   return (
//     <UserProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<LoginSignup />} />
//           <Route path="/forgetpass" element={<Forgetpass />} />
//           <Route path="/ResetCode" element={<ResetCode />} />
//           <Route path="/NewPass" element={<NewPass />} />

//           <Route path="/Rules" element={<Rules />} />
//           <Route path="/AboutUs" element={<AboutUs />} />

//           {/* دانش آموز */}
//           <Route path="/" element={<Layout />}>
//             <Route path="Dashboard" element={<Dashboard />} />
//             <Route path="Planning" element={<Planning />} />
//             <Route path="resources" element={<Resources />} />
//             <Route path="Messages" element={<Messages />} />
//             <Route path="Editprof" element={<Editprof />} />
//             <Route path="ChangePassword" element={<ChangePassword />} />
//             <Route path="AdvisorSelector" element={<AdvisorSelector />} />
//             <Route path="StudentProfile" element={<StudentProfile />} />

//             <Route path="Payment" element={<Payment />} />
//           </Route>

//           {/* مشاور */}
//           <Route path="/Advisor" element={<AdvisorLayout />}>
//             <Route path="AdvisorDashboard" element={<AdvisorDashboard />} />
//             <Route path="AdvisorEditprof" element={<AdvisorEditprof />} />
//             <Route path="MyStudents" element={<MyStudents />} />
//             <Route path="SetTimes" element={<SetTimes />} />
//             <Route path="ChangePassword" element={<ChangePassword />} />
//             {/* <Route path="/students/:id" element={<StudentInfoCard />} /> */}

//           </Route>

//           <Route path="/counselor/:id" element={<CounselorProfile />} />
//           <Route path="/students/:id" element={<StudentProfile />} />


//         </Routes>
//       </Router>
//     </UserProvider>
//   );
// }

// export default App;



// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import { UserProvider } from './components/UserContext';

import Home from './components/Home';
import LoginSignup from './components/LoginSignup';
import Forgetpass from './components/Forgetpass';
import ResetCode from './components/ResetCode';
import NewPass from './components/NewPass';
import Rules from './components/Rules';
import AboutUs from './components/AboutUs';

import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Planning from './components/Planning';
import Resources from './components/Resources';
import StudentRecommendations from './components/StudentRecommendations';

import Editprof from './components/Editprof';
import ChangePassword from "./components/ChangePassword";
import AdvisorSelector from './components/AdvisorSelector';
import StudentProfile from './components/StudentProfile';
import Payment from './components/Payment';

import AdvisorLayout from './components/AdvisorLayout';
import AdvisorDashboard from './components/AdvisorDashboard';
import AdvisorEditprof from './components/AdvisorEditprof';
import MyStudents from './components/MyStudents';
import AdvisorStudentDetail from "./components/AdvisorStudentDetail";
import CounselorStudentPlan from "./components/CounselorStudentPlan";

import SetTimes from './components/SetTimes';
import CounselorProfile from './components/CounselorProfile';
import Messages from './components/Messages';

// ---- Admin imports
import AdminLayout from './admin/layout/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsersList from './admin/pages/users/AdminUsersList';
import AdminUserForm from './admin/pages/users/AdminUserForm';
import AdminStudyPlans from './admin/pages/AdminStudyPlans';
import AdminAppointments from './admin/pages/AdminAppointments';
import AdminCounselorStudents from './admin/pages/counselors/AdminCounselorStudents';
import AdminCounselorGrades from './admin/pages/counselors/AdminCounselorGrades';
import ProtectedAdminRoute from './admin/auth/ProtectedAdminRoute';
import { AdminAuthProvider } from './admin/auth/AdminAuthContext';

function App() {
  return (
    <UserProvider>
      <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/forgetpass" element={<Forgetpass />} />
          <Route path="/ResetCode" element={<ResetCode />} />
          <Route path="/NewPass" element={<NewPass />} />
          <Route path="/Rules" element={<Rules />} />
          <Route path="/AboutUs" element={<AboutUs />} />

          {/* Student */}
          <Route path="/" element={<Layout />}>
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="Planning" element={<Planning />} />
            {/* <Route path="resources" element={<Resources />} /> */}
            <Route path="Recommendations" element={<StudentRecommendations />} />
            <Route path="Messages" element={<Messages />} />
            <Route path="Editprof" element={<Editprof />} />
            <Route path="ChangePassword" element={<ChangePassword />} />
            <Route path="AdvisorSelector" element={<AdvisorSelector />} />
            <Route path="StudentProfile" element={<StudentProfile />} />
            <Route path="Payment" element={<Payment />} />
          </Route>

          {/* Counselor */}
          <Route path="/Advisor" element={<AdvisorLayout />}>
            <Route path="AdvisorDashboard" element={<AdvisorDashboard />} />
            <Route path="AdvisorEditprof" element={<AdvisorEditprof />} />
            <Route path="MyStudents" element={<MyStudents />} />
            <Route path="students/:studentId" element={<AdvisorStudentDetail />} />
            <Route path="students/:studentId/plan" element={<CounselorStudentPlan />} />
            <Route path="SetTimes" element={<SetTimes />} />
            <Route path="ChangePassword" element={<ChangePassword />} />
          </Route>

          <Route path="/counselor/:id" element={<CounselorProfile />} />
          {/* <Route path="/students/:id" element={<StudentProfile />} /> */}
          <Route path="/students/:studentId" element={<StudentProfile />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersList />} />
            <Route path="users/new" element={<AdminUserForm mode="create" />} />
            <Route path="users/:id" element={<AdminUserForm mode="edit" />} />
            <Route path="study-plans" element={<AdminStudyPlans />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="counselors/:id/students" element={<AdminCounselorStudents />} />
            <Route path="counselors/:id/grades" element={<AdminCounselorGrades />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AdminAuthProvider>
    </UserProvider>
  );
}

export default App;
