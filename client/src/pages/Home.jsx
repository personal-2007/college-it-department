import { ArrowRight, BarChart3, BookOpenText, Brain, BriefcaseBusiness, Calendar, Code2, Database, Download, GraduationCap, Laptop, Monitor, Phone, Rocket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Syllabus', icon: BookOpenText, link: '/academics' },
  { label: 'Time Table', icon: Calendar, link: '/timetable' },
  { label: 'Results', icon: BarChart3, link: '/student/history' },
  { label: 'Placement', icon: BriefcaseBusiness, link: '/placement' },
  { label: 'Downloads', icon: Download, link: '/study-materials' },
  { label: 'Contact Us', icon: Phone, link: '/contact' },
];

const features = [
  { title: 'Experienced Faculty', description: 'Industry-focused mentorship and academic guidance from experts in IT and software engineering.', icon: Users },
  { title: 'Modern Labs', description: 'Well-equipped digital labs with the latest hardware, networking, and software environments.', icon: Monitor },
  { title: 'Industry Exposure', description: 'Real-world projects, value-added courses, and interactions with technology leaders.', icon: Rocket },
  { title: 'Placement Support', description: 'Career-focused training, platform prep, and recruitment support for students.', icon: BriefcaseBusiness },
  { title: 'Student Community', description: 'Vibrant tech clubs, coding culture, and collaborative peer learning initiatives.', icon: GraduationCap },
];

const yearCards = [
  { year: '1st Year – IT', subjects: '6 Subjects', questions: '120+ MCQs', link: '/mcq-test' },
  { year: '2nd Year – IT', subjects: '8 Subjects', questions: '180+ MCQs', link: '/mcq-test' },
  { year: '3rd Year – IT', subjects: '10 Subjects', questions: '250+ MCQs', link: '/mcq-test' },
  { year: '4th Year – IT', subjects: '6 Subjects', questions: '150+ MCQs', link: '/mcq-test' },
  { year: 'All Years', subjects: 'All Subjects', questions: 'Previous Year Papers', link: '/mcq-test' },
];

const announcements = [
  { title: 'Internship drive registrations open', date: '12 Sep 2026' },
  { title: 'Cyber security seminar scheduled', date: '15 Sep 2026' },
  { title: 'Hackathon team shortlist released', date: '22 Sep 2026' },
];

export default function Home() {
  return (
    <div className="bg-background">
      <section className="section-shell grid gap-10 py-8 md:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="badge">Welcome To</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Department of <span className="text-primaryBlue">Information Technology</span>
          </h1>
          <p className="mt-4 text-2xl font-medium text-slate-700">Learn | Build | Innovate</p>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Empowering students with modern technology, practical skills and industry-ready knowledge for a better tomorrow.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/about" className="gradient-button">
              Explore Department <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="panel p-4">
              <p className="text-3xl font-bold text-primaryBlue">15+</p>
              <p className="mt-2 text-sm text-slate-600">Industry ties</p>
            </div>
            <div className="panel p-4">
              <p className="text-3xl font-bold text-primaryBlue">12</p>
              <p className="mt-2 text-sm text-slate-600">Labs</p>
            </div>
            <div className="panel p-4">
              <p className="text-3xl font-bold text-primaryBlue">90%</p>
              <p className="mt-2 text-sm text-slate-600">Placement support</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="panel relative overflow-hidden p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-800 p-5 text-white">
                <Laptop className="h-10 w-10 text-blue-200" />
                <p className="mt-8 text-xl font-bold">Software</p>
                <p className="mt-2 text-sm text-blue-100">Full stack development</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-5 text-slate-900">
                <Database className="h-10 w-10 text-primaryBlue" />
                <p className="mt-8 text-xl font-bold">Database</p>
                <p className="mt-2 text-sm text-slate-600">Architecture and design</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-5 text-slate-900">
                <Code2 className="h-10 w-10 text-primaryBlue" />
                <p className="mt-8 text-xl font-bold">Coding</p>
                <p className="mt-2 text-sm text-slate-600">Problem solving</p>
              </div>
              <div className="rounded-2xl bg-slate-100 p-5 text-slate-900">
                <Brain className="h-10 w-10 text-violet-600" />
                <p className="mt-8 text-xl font-bold">AI</p>
                <p className="mt-2 text-sm text-slate-600">Data-driven intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 lg:grid lg:grid-cols-[1.3fr_0.7fr] lg:gap-8">
        <div className="space-y-8">
          <div className="panel p-6">
            <h2 className="text-3xl font-bold text-slate-900">Department Features</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map(({ title, description, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-primaryBlue">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-800">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900">MCQ Test</h2>
              <Link to="/mcq-test" className="text-sm font-semibold text-primaryBlue">View all</Link>
            </div>
            <p className="mt-4 max-w-2xl text-slate-600">
              Practice previous year questions and improve your preparation with subject-wise MCQs.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                'All Years Available',
                'Subject Wise',
                'Instant Result',
                'Track Progress',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-3xl font-bold text-slate-900">Year-wise MCQ</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {yearCards.map(({ year, subjects, questions, link }) => (
                <div key={year} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-soft">
                  <h3 className="text-xl font-bold text-slate-900">{year}</h3>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>{subjects}</p>
                    <p>{questions}</p>
                  </div>
                  <Link to={link} className="mt-5 inline-flex items-center rounded-full bg-primaryBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    View Tests <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="panel h-fit p-6">
          <h3 className="text-2xl font-bold text-slate-900">Quick Links</h3>
          <div className="mt-6 space-y-3">
            {quickLinks.map(({ label, icon: Icon, link }) => (
              <Link key={label} to={link} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-200 hover:bg-blue-50">
                <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primaryBlue">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="section-shell py-8">
        <div className="panel p-6">
          <h2 className="text-3xl font-bold text-slate-900">Announcements</h2>
          <div className="mt-6 space-y-4">
            {announcements.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.date}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-primaryBlue" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
