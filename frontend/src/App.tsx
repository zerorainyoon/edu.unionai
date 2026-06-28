import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { CourseList } from './pages/CourseList';
import { CourseDetail } from './pages/CourseDetail';
import { AdminRegisterCourse } from './pages/admin/AdminRegisterCourse';
import { AdminRegistrations } from './pages/admin/AdminRegistrations';
import { AdminCourses } from './pages/admin/AdminCourses';

export function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased">
          {/* Responsive Header Navigation */}
          <Header />

          {/* Core Page Content Section */}
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/admin/register-course" element={<AdminRegisterCourse />} />
              <Route path="/admin/registrations" element={<AdminRegistrations />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              {/* Fallback to homepage */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Premium Footer */}
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
