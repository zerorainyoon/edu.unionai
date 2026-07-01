import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Home } from './pages/Home';
import { CourseList } from './pages/CourseList';
import { CourseDetail } from './pages/CourseDetail';
import { AdminRegisterCourse } from './pages/admin/AdminRegisterCourse';
import { AdminRegistrations } from './pages/admin/AdminRegistrations';
import { AdminCourses } from './pages/admin/AdminCourses';
import { FAQ } from './pages/FAQ';
import { Board } from './pages/Board';
import { Inquiry } from './pages/Inquiry';
import { Login } from './pages/Login';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
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
                <Route path="/faq" element={<FAQ />} />
                <Route path="/board" element={<Board />} />
                <Route path="/inquiry" element={<Inquiry />} />
                <Route path="/login" element={<Login />} />
                {/* Fallback to homepage */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Premium Footer */}
            <Footer />

            {/* Discord Floating Action Button */}
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 bg-[#5865F2] hover:bg-[#4752C4] text-white p-4 rounded-full shadow-2xl hover:shadow-[#5865F2]/40 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
              aria-label="Discord"
            >
              {/* Vector Discord Logo SVG */}
              <svg viewBox="0 0 127.14 96.36" className="w-6 h-6 fill-current">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.4-5c.9-.65,1.76-1.34,2.58-2.07a75.48,75.48,0,0,0,64.62,0c.82.73,1.68,1.42,2.58,2.07a68.43,68.43,0,0,1-10.4,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,48.24,124.08,25.41,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
              </svg>

              {/* Hover Tooltip */}
              <span className="absolute right-16 bg-slate-900 text-white text-xs font-black px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl pointer-events-none border border-slate-800">
                디스코드 커뮤니티 참여하기
              </span>
            </a>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
