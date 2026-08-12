import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Storage key & default passcode
  const ADMIN_PASS_KEY = 'tre_admin_auth_pass';
  const DEFAULT_PASS = 'admin123';

  useEffect(() => {
    const savedAuth = localStorage.getItem('tre_admin_logged_in');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedPass = localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASS;
    if (passcode === storedPass) {
      setIsAuthenticated(true);
      localStorage.setItem('tre_admin_logged_in', 'true');
      setAuthError('');
    } else {
      setAuthError('गलत Passcode! सही Admin Key दर्ज करें। (Default: admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tre_admin_logged_in');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="login-backdrop-glow"></div>
        <div className="admin-login-card">
          <div className="admin-brand">
            <div className="logo-badge">TRE</div>
            <h2>TRE Publications</h2>
            <p className="subtitle">Super Admin Control Hub</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label>Admin Access Key / Passcode</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">🔑</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Passcode दर्ज करें (Default: admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                />
              </div>
            </div>

            {authError && <div className="error-alert">⚠️ {authError}</div>}

            <button type="submit" className="btn-primary w-100 btn-glow">
              Unlock Admin Portal 🚀
            </button>
          </form>

          <div className="login-footer">
            <button onClick={() => navigate('/')} className="btn-link">
              ← Main Website पर वापस जाएँ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Mobile Header Bar */}
      <header className="mobile-header">
        <div className="brand-title">
          <span className="logo-sm">TRE</span> Admin Panel
        </div>
        <button className="menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? '✖' : '☰'}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-area">
            <div className="logo-badge">TRE</div>
            <div>
              <h3>TRE Admin</h3>
              <span className="live-status">● Live Sync Active</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
          >
            📊 Dashboard Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); }}
          >
            📖 Courses & Subjects
          </button>
          <button
            className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
          >
            💼 Jobs & Vacancies
          </button>
          <button
            className={`nav-item ${activeTab === 'updates' ? 'active' : ''}`}
            onClick={() => { setActiveTab('updates'); setMobileMenuOpen(false); }}
          >
            🔔 Recent Updates
          </button>
          <button
            className={`nav-item ${activeTab === 'study' ? 'active' : ''}`}
            onClick={() => { setActiveTab('study'); setMobileMenuOpen(false); }}
          >
            📚 Study Materials
          </button>
          <button
            className={`nav-item ${activeTab === 'topic-mcq' ? 'active' : ''}`}
            onClick={() => { setActiveTab('topic-mcq'); setMobileMenuOpen(false); }}
          >
            🎯 Topic-wise MCQs
          </button>
          <button
            className={`nav-item ${activeTab === 'mocks' ? 'active' : ''}`}
            onClick={() => { setActiveTab('mocks'); setMobileMenuOpen(false); }}
          >
            📝 Test Series (Mocks)
          </button>
          <button
            className={`nav-item ${activeTab === 'solved-papers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('solved-papers'); setMobileMenuOpen(false); }}
          >
            📄 Solved Papers & Keys
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
          >
            ⚙️ Security & Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => navigate('/')} className="btn-secondary w-100 mb-2">
            🌐 Live Website देखें
          </button>
          <button onClick={handleLogout} className="btn-danger w-100">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="admin-topbar">
          <div className="topbar-title">
            <h2>
              {activeTab === 'dashboard' && 'Welcome to TRE Admin Dashboard'}
              {activeTab === 'courses' && 'Courses, Subjects & Syllabus Manager'}
              {activeTab === 'jobs' && 'Job Vacancies & Career Hub Manager'}
              {activeTab === 'updates' && 'Recent Updates Notification Center'}
              {activeTab === 'study' && 'Study Materials & PDF Resources Manager'}
              {activeTab === 'topic-mcq' && 'Topic-wise MCQ & Bulk Question Manager'}
              {activeTab === 'mocks' && 'Full Mock Tests & Test Series'}
              {activeTab === 'solved-papers' && 'Solved Papers & Official Answer Keys'}
              {activeTab === 'settings' && 'Admin Passcode & Security Preferences'}
            </h2>
            <p>Direct Control Center - Add, upload and manage all site resources effortlessly</p>
          </div>
          <div className="admin-profile-pill">
            <span className="avatar">👑</span>
            <span className="admin-name">Super Admin</span>
          </div>
        </header>

        <div className="admin-tab-body">
          {activeTab === 'dashboard' && <DashboardOverview setActiveTab={setActiveTab} />}
          {activeTab === 'courses' && <CoursesSubjectsManager />}
          {activeTab === 'jobs' && <JobsManager />}
          {activeTab === 'updates' && <UpdatesManager />}
          {activeTab === 'study' && <StudyMaterialManager />}
          {activeTab === 'topic-mcq' && <TopicMcqManager />}
          {activeTab === 'mocks' && <MockTestManager />}
          {activeTab === 'solved-papers' && <SolvedPaperManager />}
          {activeTab === 'settings' && <SettingsManager ADMIN_PASS_KEY={ADMIN_PASS_KEY} />}
        </div>
      </main>
    </div>
  );
};

const API_BASE = 'https://trehousing2.onrender.com';

/* --- DASHBOARD OVERVIEW COMPONENT --- */
const DashboardOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState({ jobs: 0, updates: 0, mocks: 0, papers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, updatesRes, mocksRes, papersRes] = await Promise.all([
          fetch(`${API_BASE}/api/job/`),
          fetch(`${API_BASE}/api/recent-updates/`),
          fetch(`${API_BASE}/api/v1/quiz/`),
          fetch(`${API_BASE}/api/v1/solved-papers/`)
        ]);
        const jobs = jobsRes.ok ? await jobsRes.json() : [];
        const updates = updatesRes.ok ? await updatesRes.json() : [];
        const mocks = mocksRes.ok ? await mocksRes.json() : [];
        const papersData = papersRes.ok ? await papersRes.json() : {};
        
        setStats({
          jobs: jobs.length || 0,
          updates: updates.length || 0,
          mocks: Array.isArray(mocks) ? mocks.length : 0,
          papers: papersData.data ? papersData.data.length : 0
        });
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-overview">
      <div className="stat-cards-grid">
        <div className="stat-card card-blue" onClick={() => setActiveTab('jobs')}>
          <div className="stat-icon">💼</div>
          <div className="stat-details">
            <h3>{stats.jobs}</h3>
            <p>Active Job Vacancies</p>
          </div>
          <span className="stat-arrow">→</span>
        </div>

        <div className="stat-card card-purple" onClick={() => setActiveTab('updates')}>
          <div className="stat-icon">🔔</div>
          <div className="stat-details">
            <h3>{stats.updates}</h3>
            <p>Recent Updates</p>
          </div>
          <span className="stat-arrow">→</span>
        </div>

        <div className="stat-card card-green" onClick={() => setActiveTab('mocks')}>
          <div className="stat-icon">📝</div>
          <div className="stat-details">
            <h3>{stats.mocks}</h3>
            <p>Mock Test Series</p>
          </div>
          <span className="stat-arrow">→</span>
        </div>

        <div className="stat-card card-orange" onClick={() => setActiveTab('solved-papers')}>
          <div className="stat-icon">📄</div>
          <div className="stat-details">
            <h3>{stats.papers}</h3>
            <p>Solved Papers</p>
          </div>
          <span className="stat-arrow">→</span>
        </div>
      </div>

      <div className="quick-actions-banner">
        <h3>⚡ Quick Operations</h3>
        <div className="quick-actions-btns">
          <button className="action-chip" onClick={() => setActiveTab('jobs')}>➕ Post New Job</button>
          <button className="action-chip" onClick={() => setActiveTab('updates')}>📢 Post Update Notification</button>
          <button className="action-chip" onClick={() => setActiveTab('topic-mcq')}>⚡ Bulk Upload Questions</button>
        </div>
      </div>
    </div>
  );
};

/* --- COURSES & SUBJECTS MANAGER COMPONENT --- */
const CoursesSubjectsManager = () => {
  const [courses, setCourses] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('course'); // 'course' or 'subject'
  
  // Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  
  // Subject Form State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('');
  const [subjectDesc, setSubjectDesc] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(100);
  const [totalMarks, setTotalMarks] = useState(100);

  const fetchCourses = () => {
    fetch(`${API_BASE}/api/v1/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
          if (data.length > 0 && !selectedCourseId) {
            setSelectedCourseId(data[0].id);
          }
        }
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/v1/courses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: courseTitle, description: courseDesc })
      });
      const data = await res.json();
      if (res.ok || data.success) {
        alert('Course Created Successfully!');
        fetchCourses();
        setCourseTitle('');
        setCourseDesc('');
      } else {
        alert('Error adding course: ' + (data.error || 'Failed'));
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/v1/subjects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: selectedCourseId,
          title: subjectTitle,
          description: subjectDesc,
          total_questions: totalQuestions,
          total_marks: totalMarks
        })
      });
      const data = await res.json();
      if (res.ok || data.success) {
        alert('Subject Created & Linked Successfully!');
        fetchCourses();
        setSubjectTitle('');
        setSubjectDesc('');
      } else {
        alert('Error adding subject');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="manager-grid">
      <div className="form-card">
        <div className="sub-tabs mb-3" style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn-sm ${activeSubTab === 'course' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('course')}
          >
            ➕ Add New Course
          </button>
          <button
            className={`btn-sm ${activeSubTab === 'subject' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('subject')}
          >
            📙 Add Subject to Course
          </button>
        </div>

        {activeSubTab === 'course' ? (
          <form onSubmit={handleAddCourse}>
            <h3>📖 Add New Course</h3>
            <div className="form-group">
              <label>Course Title*</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. BPSC Foundation / UPSC CSE"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Course details..."
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-100">
              🚀 Publish Course
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddSubject}>
            <h3>📙 Add Subject to Course</h3>
            <div className="form-group">
              <label>Select Parent Course*</label>
              <select
                className="form-input"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Subject Title*</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Indian History / General Studies"
                value={subjectTitle}
                onChange={(e) => setSubjectTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Subject info..."
                value={subjectDesc}
                onChange={(e) => setSubjectDesc(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Total Questions</label>
                <input
                  type="number"
                  className="form-input"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                />
              </div>
              <div className="form-group flex-1">
                <label>Total Marks</label>
                <input
                  type="number"
                  className="form-input"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-100">
              🚀 Save Subject
            </button>
          </form>
        )}
      </div>

      <div className="table-card">
        <h3>Existing Courses & Linked Subjects ({courses.length})</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Linked Subjects</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.title}</strong></td>
                  <td>
                    {c.subjects && c.subjects.length > 0 ? (
                      c.subjects.map((sub) => (
                        <span key={sub.id} className="badge badge-govt me-1 mb-1">
                          {sub.title}
                        </span>
                      ))
                    ) : (
                      <small className="text-muted">No subjects added yet</small>
                    )}
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center">No courses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- JOBS MANAGER COMPONENT --- */
const JobsManager = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    eligibility: '',
    form_fee: 0,
    apply_date: new Date().toISOString().split('T')[0],
    last_date: '',
    official_website: '',
    apply_link: '',
    category_badge: 'UPSC',
    vacancy_count: '100+',
    qualification: 'Graduation',
    job_type: 'GOVT',
    status: true
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/job/`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingJob ? `${API_BASE}/api/job/${editingJob.id}/` : `${API_BASE}/api/job/`;
      const method = editingJob ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(editingJob ? 'Job Vacancy Updated Successfully!' : 'Job Vacancy Created Successfully!');
        fetchJobs();
        resetForm();
      } else {
        alert('Operation failed. Please check form data.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      organization: job.organization || '',
      eligibility: job.eligibility || '',
      form_fee: job.form_fee || 0,
      apply_date: job.apply_date || '',
      last_date: job.last_date || '',
      official_website: job.official_website || '',
      apply_link: job.apply_link || '',
      category_badge: job.category_badge || 'UPSC',
      vacancy_count: job.vacancy_count || '',
      qualification: job.qualification || '',
      job_type: job.job_type || 'GOVT',
      status: job.status ?? true
    });
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      organization: '',
      eligibility: '',
      form_fee: 0,
      apply_date: new Date().toISOString().split('T')[0],
      last_date: '',
      official_website: '',
      apply_link: '',
      category_badge: 'UPSC',
      vacancy_count: '100+',
      qualification: 'Graduation',
      job_type: 'GOVT',
      status: true
    });
  };

  return (
    <div className="manager-grid">
      <div className="form-card">
        <h3>{editingJob ? '✏️ Edit Job Vacancy' : '➕ Post New Job Vacancy'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Job Title*</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. SSC CGL 2026 Notification"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Organization Name*</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Staff Selection Commission"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Job Type*</label>
              <select
                className="form-input"
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
              >
                <option value="GOVT">Government Job</option>
                <option value="PRIVATE">Private Job</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Category Badge</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BPSC, SSC, UPSC, RAILWAY"
                value={formData.category_badge}
                onChange={(e) => setFormData({ ...formData, category_badge: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Vacancy Count</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 500+ Posts"
                value={formData.vacancy_count}
                onChange={(e) => setFormData({ ...formData, vacancy_count: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Qualification</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10th / 12th / Graduate"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Eligibility Details</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Age 18-30, Any Bachelor Degree"
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Application Fee (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0 for Free"
                value={formData.form_fee}
                onChange={(e) => setFormData({ ...formData, form_fee: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Start Apply Date*</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.apply_date}
                onChange={(e) => setFormData({ ...formData, apply_date: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Last Date to Apply*</label>
              <input
                type="date"
                className="form-input"
                required
                value={formData.last_date}
                onChange={(e) => setFormData({ ...formData, last_date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Direct Apply Link (URL)*</label>
              <input
                type="url"
                className="form-input"
                required
                placeholder="https://..."
                value={formData.apply_link}
                onChange={(e) => setFormData({ ...formData, apply_link: e.target.value })}
              />
            </div>
            <div className="form-group flex-1">
              <label>Official Website Link</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={formData.official_website}
                onChange={(e) => setFormData({ ...formData, official_website: e.target.value })}
              />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn-primary flex-1">
              {editingJob ? '💾 Save Changes' : '🚀 Publish Job Vacancy'}
            </button>
            {editingJob && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-card">
        <h3>📋 Live Job Listings ({jobs.length})</h3>
        {loading ? (
          <p className="loading-text">Loading active jobs...</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title & Org</th>
                  <th>Type</th>
                  <th>Badge</th>
                  <th>Last Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>#{job.id}</td>
                    <td>
                      <strong>{job.title}</strong>
                      <br />
                      <small className="sub-text">{job.organization}</small>
                    </td>
                    <td>
                      <span className={`badge ${job.job_type === 'GOVT' ? 'badge-govt' : 'badge-pvt'}`}>
                        {job.job_type}
                      </span>
                    </td>
                    <td>{job.category_badge || '-'}</td>
                    <td>{job.last_date}</td>
                    <td>
                      <button onClick={() => handleEdit(job)} className="btn-action edit-btn">
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">No active jobs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- RECENT UPDATES MANAGER COMPONENT --- */
const UpdatesManager = () => {
  const [updates, setUpdates] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', link: '' });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/recent-updates/`);
      if (res.ok) {
        const data = await res.json();
        setUpdates(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/recent-updates/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Recent update published!');
        fetchUpdates();
        setFormData({ title: '', description: '', link: '' });
      } else {
        alert('Failed to publish update.');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="manager-grid">
      <div className="form-card">
        <h3>🔔 Publish Recent Update / News Banner</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Update Title*</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. BPSC 68th Mains Result Declared"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description / Details</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="e.g. Check your merit list and cut-off marks now."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Target URL / Result PDF Link</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-100">
            📢 Broadcast Update
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Recent Notification Stream</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((upd, idx) => (
                <tr key={idx}>
                  <td><strong>{upd.title}</strong></td>
                  <td>{upd.description || '-'}</td>
                  <td>
                    {upd.link ? (
                      <a href={upd.link} target="_blank" rel="noreferrer" className="btn-link">
                        Open ↗
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
              {updates.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">No recent updates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- STUDY MATERIAL MANAGER COMPONENT --- */
const StudyMaterialManager = () => {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    exam_name: 'UPSC',
    subject_name: 'General Studies',
    title: '',
    file_link: ''
  });

  const fetchMaterials = () => {
    fetch(`${API_BASE}/api/v1/study-materials/`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setMaterials(resData.data);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/v1/study-materials/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'document', ...formData })
      });
      const data = await res.json();
      if (data.success || res.ok) {
        alert('Study Material PDF successfully published!');
        fetchMaterials();
        setFormData({ exam_name: 'UPSC', subject_name: 'General Studies', title: '', file_link: '' });
      } else {
        alert('Error publishing material');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="manager-grid">
      <div className="form-card">
        <h3>📚 Add Study Material / PDF Document</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Exam Category (e.g. UPSC, BPSC, SSC)</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. UPSC"
              value={formData.exam_name}
              onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Subject Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Modern History"
              value={formData.subject_name}
              onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Document Title / Chapter Name*</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Freedom Struggle Chapter 1 Notes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>PDF Link (Google Drive / S3 / Direct Link)*</label>
            <input
              type="url"
              className="form-input"
              required
              placeholder="https://drive.google.com/..."
              value={formData.file_link}
              onChange={(e) => setFormData({ ...formData, file_link: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-100">
            🚀 Add Study Material
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Active Study Materials</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Subjects & PDFs</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((exam) => (
                <tr key={exam.id}>
                  <td><strong className="text-primary">{exam.name}</strong></td>
                  <td>
                    {exam.materials_subjects?.map((sub) => (
                      <div key={sub.id} className="sub-group-pill">
                        <span className="subject-tag">📙 {sub.name}</span>
                        <ul className="doc-list">
                          {sub.documents?.map((doc) => (
                            <li key={doc.id}>
                              📄 <span>{doc.title}</span> — {' '}
                              <a href={doc.file_link} target="_blank" rel="noreferrer" className="btn-link">
                                View PDF ↗
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center">No study materials configured yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- TOPIC MCQ MANAGER COMPONENT --- */
const TopicMcqManager = () => {
  const [subjectName, setSubjectName] = useState('History');
  const [topicName, setTopicName] = useState('');
  const [bulkJson, setBulkJson] = useState('');

  const sampleJson = `[
  {
    "text": "What is the capital of India?",
    "choices": [
      {"text": "New Delhi", "is_correct": true},
      {"text": "Mumbai", "is_correct": false},
      {"text": "Kolkata", "is_correct": false},
      {"text": "Chennai", "is_correct": false}
    ]
  }
]`;

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    try {
      JSON.parse(bulkJson);
      const res = await fetch(`${API_BASE}/api/v1/topic-wise-mcq/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'topic',
          subject_name: subjectName,
          topic_name: topicName,
          bulk_json: bulkJson
        })
      });
      const data = await res.json();
      if (data.success || res.ok) {
        alert('Topic and Questions Uploaded Successfully!');
        setTopicName('');
        setBulkJson('');
      } else {
        alert('Error uploading questions: ' + (data.error || 'Check backend log'));
      }
    } catch (err) {
      alert('Invalid JSON Syntax! Please check format.');
    }
  };

  return (
    <div className="manager-grid">
      <div className="form-card">
        <h3>⚡ Bulk Upload MCQs via JSON</h3>
        <form onSubmit={handleBulkUpload}>
          <div className="form-group">
            <label>Subject Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. History / Geography / Polity"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Topic Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ancient History - Indus Valley"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div className="label-with-action">
              <label>Paste JSON Question Array</label>
              <button
                type="button"
                className="btn-link-sm"
                onClick={() => setBulkJson(sampleJson)}
              >
                Load Sample JSON
              </button>
            </div>
            <textarea
              className="form-input json-textarea"
              rows="10"
              placeholder="Paste JSON array here..."
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-100">
            ⚡ Upload & Parse MCQs
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>📖 Bulk Upload Instructions</h3>
        <div className="help-box">
          <p><strong>JSON Format Rule:</strong></p>
          <pre className="code-snippet">{sampleJson}</pre>
          <p className="sub-text mt-2">
            Each item must have a <code>text</code> string and <code>choices</code> array with exactly 4 options. Mark the right answer with <code>"is_correct": true</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- MOCK TEST MANAGER COMPONENT --- */
const MockTestManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    description: ''
  });

  const fetchQuizzes = () => {
    fetch(`${API_BASE}/api/v1/quiz/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuizzes(data);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/v1/quiz/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Mock Test Series Created Successfully!');
        fetchQuizzes();
        setFormData({ title: '', category: 'General', description: '' });
      } else {
        alert('Failed to create mock test.');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="manager-grid">
      <div className="form-card">
        <h3>📝 Create New Mock Test Series</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Test Title*</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. BPSC Prelims Full Mock Test 1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category (e.g. UPSC, BPSC, SSC)</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. BPSC"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Test Series Details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-100">
            🚀 Publish Mock Test
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Active Test Series ({quizzes.length})</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Test Series Title</th>
                <th>Total Questions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <tr key={q.id}>
                  <td>#{q.id}</td>
                  <td><span className="badge badge-govt">{q.category}</span></td>
                  <td><strong>{q.title}</strong></td>
                  <td>{q.questions?.length || 0} Questions</td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No mock test series found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- SOLVED PAPER MANAGER COMPONENT --- */
const SolvedPaperManager = () => {
  const [papers, setPapers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    paper_link: '',
    answer_key_link: '',
    subject: 1
  });

  const fetchPapers = () => {
    fetch(`${API_BASE}/api/v1/solved-papers/`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setPapers(resData.data);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/v1/solved-papers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Solved Paper Link Published Successfully!');
        fetchPapers();
        setFormData({ title: '', year: new Date().getFullYear(), paper_link: '', answer_key_link: '', subject: 1 });
      } else {
        alert('Failed to save paper link.');
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="manager-grid">
      <div className="form-card">
        <h3>📄 Add Solved Paper & Answer Key Link</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Paper Title*</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. UPSC Prelims 2024 GS Paper 1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Year*</label>
            <input
              type="number"
              className="form-input"
              required
              placeholder="2024"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Question Paper Drive Link*</label>
            <input
              type="url"
              className="form-input"
              required
              placeholder="https://drive.google.com/..."
              value={formData.paper_link}
              onChange={(e) => setFormData({ ...formData, paper_link: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Official Answer Key Link (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://drive.google.com/..."
              value={formData.answer_key_link}
              onChange={(e) => setFormData({ ...formData, answer_key_link: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-100">
            🚀 Publish Solved Paper
          </button>
        </form>
      </div>

      <div className="table-card">
        <h3>Solved Papers ({papers.length})</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Paper Link</th>
                <th>Answer Key</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong></td>
                  <td>{p.year}</td>
                  <td>
                    <a href={p.paper_link} target="_blank" rel="noreferrer" className="btn-link">
                      Paper PDF ↗
                    </a>
                  </td>
                  <td>
                    {p.answer_key_link ? (
                      <a href={p.answer_key_link} target="_blank" rel="noreferrer" className="btn-link">
                        Answer Key ↗
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
              {papers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No solved papers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* --- SETTINGS MANAGER COMPONENT --- */
const SettingsManager = ({ ADMIN_PASS_KEY }) => {
  const [newPass, setNewPass] = useState('');
  const [msg, setMsg] = useState('');

  const handleChangePass = (e) => {
    e.preventDefault();
    if (newPass.length < 6) {
      alert('Passcode 6 अक्षरों से अधिक लंबा होना चाहिए!');
      return;
    }
    localStorage.setItem(ADMIN_PASS_KEY, newPass);
    setMsg('Admin Passcode सफलतापूर्वक अपडेट हो गया! अगली बार लॉगिन के लिए नये पासवर्ड का उपयोग करें।');
    setNewPass('');
  };

  return (
    <div className="form-card max-w-500">
      <h3>🔐 Update Admin Passcode</h3>
      <form onSubmit={handleChangePass}>
        <div className="form-group">
          <label>New Passcode</label>
          <input
            type="password"
            className="form-input"
            required
            placeholder="नया Passcode दर्ज करें"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
        </div>
        {msg && <div className="success-alert mb-2">{msg}</div>}
        <button type="submit" className="btn-primary w-100">
          💾 Change Passcode
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
