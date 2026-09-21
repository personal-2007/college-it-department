import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-200">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-white">Department of IT</h3>
          <p className="mt-4 max-w-md text-sm text-slate-300">
            Empowering students with technology, innovation, and employability through collaborative learning and applied knowledge.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/academics">Academics</Link></li>
            <li><Link to="/faculty">Faculty</Link></li>
            <li><Link to="/labs">Labs</Link></li>
            <li><Link to="/mcq-test">MCQ Test</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Student</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/student/dashboard">Dashboard</Link></li>
            <li><Link to="/student/history">Results</Link></li>
            <li><Link to="/study-materials">Study Materials</Link></li>
            <li><Link to="/timetable">Timetable</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-blue-400" /> Mahendra Engineering College, Namakkal</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-400" /> itdept@college.edu</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-400" /> +91 9876543210</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="section-shell flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">© 2026 Department of Information Technology. All Rights Reserved.</p>
          <div className="flex items-center gap-3 text-slate-300">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-blue-400 hover:text-white"><Linkedin className="h-4 w-4" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-blue-400 hover:text-white"><Youtube className="h-4 w-4" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-blue-400 hover:text-white"><Instagram className="h-4 w-4" /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 hover:border-blue-400 hover:text-white"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
