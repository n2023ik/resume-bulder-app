import React, { useState } from "react";
// html2pdf is loaded via CDN in `index.html` and exposed as a global (window.html2pdf).
// We intentionally do not import it here so the bundle size stays small.

// Import icons from lucide-react
import { Plus, Trash2, Download, FileText, User, Briefcase, GraduationCap, Lightbulb, Link2, Mail, Phone, MapPin, Linkedin, Globe, Github, ExternalLink, ChevronDown, Loader2 } from 'lucide-react';
// Note: html2pdf.js is now loaded via a script tag in index.html, so we don't import it here.

// --- Updated Data from Nikhil Pandey's Resume ---
const updatedData = {
  personal: {
    firstName: "Nikhil",
    lastName: "Pandey",
    title: "Web Developer",
    email: "pandeynikhil429@gmail.com",
    phone: "8273646729",
    location: "Agra, India",
    linkedin: "linkedin.com/in/nikhil-pandey-45b276276",
    website: "n2023ik.github.io/my-portfoli",
    summary: "Motivated frontend developer and Computer Science student who builds clean, responsive web apps. Skilled in HTML, CSS, JavaScript and Next.js, with backend experience using Node.js, PHP and databases (MySQL, MongoDB). I enjoy turning ideas into polished interfaces, shipping reliable features, and learning new tools.",
  },
  education: [
    { id: 1, school: "GLA University, Mathura", degree: "Diploma in Computer Science Engineering", start: "2023", end: "Expected Jul 2026", notes: "Certifications: SQL & CSS (HackerRank), AI Fundamentals (Cisco/Infosys)" },
  ],
  experience: [
    { id: 1, company: "ApexPlanet Software Pvt. Ltd.", role: "Web Developer Intern", start: "Jun 2025", end: "Jul 2025", bullets: ["Built a full-stack blog app with PHP & MySQL including CRUD and session-based authentication.", "Optimized database schema and queries for faster response times.", "Collaborated in an agile remote team using Git and GitHub for version control."] },
  ],
  skills: "HTML, CSS, JavaScript (ES6+), React, Next.js, Node.js, PHP, MySQL, MongoDB, Git, GitHub, VS Code, OAuth",
  projects: [
    { id: 1, name: "ChatterBox - Real-time Chat App", description: "A full-stack chat platform with Google Sign-In, instant messaging via WebSockets, and MongoDB for message storage. Features include typing indicators and chat history. Tech: Next.js, Node.js, Socket.IO, OAuth 2.0.", github: "", demo: "https://chatterbox-vly4.onrender.com/" },
    { id: 2, name: "Resume Builder App", description: "A web application that helps users easily create professional resumes with clean templates, live preview, and PDF download support. Built for simplicity and accessibility using React, HTML, CSS, and JavaScript.", github: "https://github.com/n2023ik/Resume-bulder-app", demo: "https://resume-bulder-app.vercel.app/" },
    { id: 3, name: "Fama Barber Shop - Responsive Business Site", description: "Responsive business website with dark/light mode and an interactive gallery, built with HTML, CSS, and JavaScript.", github: "https://github.com/n2023ik/fama-barber", demo: "https://n2023ik-git-main-nikhil-pandeys-projects-ca529d7f.vercel.app/" },
    { id: 4, name: "Harmony Music Player", description: "A music player with custom audio controls, a dynamic playlist, and a clean UI, created using HTML, CSS, and JavaScript.", github: "https://github.com/n2023ik/harmony", demo: "https://harmony-player.vercel.app/" },
  ]
};


// --- Reusable UI Components ---
const Field = ({ label, value, onChange, placeholder = "", type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <input
      type={type}
      className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder = "", rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <textarea
      className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const AccordionItem = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border rounded-lg overflow-hidden mb-4 transition-all duration-300">
            <button
                className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                </div>
                <ChevronDown
                    size={20}
                    className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
};


// --- Resume Preview Templates ---

// Classic Single-Column Template
const ClassicTemplate = ({ personal, experience, education, projects, skills }) => (
  <div className="bg-white p-8 font-serif text-slate-800" style={{minHeight: '29.7cm'}}>
    <div className="text-center mb-8 border-b pb-4">
      <h1 className="text-4xl font-bold tracking-wider uppercase">{personal.firstName} {personal.lastName}</h1>
      <p className="text-lg mt-1">{personal.title}</p>
    </div>
    <div className="flex justify-center text-sm space-x-6 mb-8">
      <span>{personal.email}</span>
      {personal.email && personal.phone && <span>|</span>}
      <span>{personal.phone}</span>
      {personal.phone && personal.location && <span>|</span>}
      <span>{personal.location}</span>
    </div>

    {personal.summary && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Summary</h2>
        <p className="text-sm leading-relaxed whitespace-pre-line">{personal.summary}</p>
      </div>
    )}

    {experience.some(e => e.company) && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-1 mb-3">Experience</h2>
        {experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-medium">{exp.role} at {exp.company}</h3>
              <p className="text-sm text-slate-600">{exp.start} - {exp.end}</p>
            </div>
            <ul className="mt-1 list-disc list-inside text-sm text-slate-700 space-y-1">
              {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    )}

    {education.some(e => e.school) && (
       <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-1 mb-3">Education</h2>
        {education.map((ed) => (
          <div key={ed.id} className="mb-2">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">{ed.degree}, {ed.school}</h3>
              <p className="text-sm text-slate-600">{ed.start} - {ed.end}</p>
            </div>
            {ed.notes && <p className="text-sm italic text-slate-600">{ed.notes}</p>}
          </div>
        ))}
      </div>
    )}

    {projects.some(p => p.name || p.description) && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-1 mb-3">Projects</h2>
        {projects.map((prj) => (
          <div key={prj.id} className="mb-4">
            <h3 className="text-lg font-medium">{prj.name}</h3>
            {prj.description && (
              <p className="mt-1 text-sm text-slate-700 whitespace-pre-line">{prj.description}</p>
            )}
            {(prj.github || prj.demo) && (
              <div className="mt-2 flex gap-3 text-sm">
                {prj.github && (
                  <a className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800" href={prj.github} target="_blank" rel="noreferrer">
                    <Github size={14} /> GitHub
                  </a>
                )}
                {prj.demo && (
                  <a className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800" href={prj.demo} target="_blank" rel="noreferrer">
                    <ExternalLink size={14} /> Live
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {skills && (
      <div>
        <h2 className="text-xl font-semibold border-b pb-1 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.split(",").map((s) => s.trim()).filter(Boolean).map((s, i) => (
            <span key={i} className="bg-slate-200 text-slate-800 text-sm font-medium px-3 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Modern Template with a Sidebar
const ModernTemplate = ({ personal, experience, education, projects, skills }) => {
  const ContactInfo = ({ icon: Icon, text, href }) => (
    text && (
        <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 mb-2 hover:text-indigo-300 transition-colors">
            <Icon size={14} />
            <span className="break-all">{text.replace(/https?:\/\//, '')}</span>
        </a>
    )
  );

  return (
    <div className="flex min-w-full bg-white" style={{minHeight: '29.7cm'}}>
      <div className="w-1/3 bg-slate-800 text-white p-6 font-sans">
        <h1 className="text-3xl font-bold">{personal.firstName}</h1>
        <h1 className="text-3xl font-bold mb-2">{personal.lastName}</h1>
        <p className="text-lg text-slate-300 mb-8">{personal.title}</p>

        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-500 pb-1 mb-4">Contact</h2>
        <div className="text-sm mb-8">
          <ContactInfo icon={Mail} text={personal.email} href={`mailto:${personal.email}`} />
          <ContactInfo icon={Phone} text={personal.phone} href={`tel:${personal.phone}`} />
          <ContactInfo icon={MapPin} text={personal.location} />
          <ContactInfo icon={Linkedin} text={personal.linkedin} href={`https://${personal.linkedin}`} />
          <ContactInfo icon={Globe} text={personal.website} href={`https://${personal.website}`} />
        </div>

        {education.some(e => e.school) && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-500 pb-1 mb-4">Education</h2>
            <div className="text-sm mb-8">
              {education.map(ed => (
                <div key={ed.id} className="mb-3">
                  <p className="font-semibold">{ed.school}</p>
                  <p className="text-slate-300">{ed.degree}</p>
                  <p className="text-xs text-slate-400">{ed.start} - {ed.end}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {skills && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-500 pb-1 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {skills.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                <span key={i} className="bg-slate-600 px-2 py-1 rounded">{s}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="w-2/3 p-8 font-sans">
        {personal.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">Summary</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line">{personal.summary}</p>
          </div>
        )}

        {experience.some(e => e.company) && (
            <div>
            <h2 className="text-xl font-bold text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">{exp.role}</h3>
                  <p className="text-sm text-slate-500">{exp.start} - {exp.end}</p>
                </div>
                <p className="text-md text-slate-600 mb-2">{exp.company}</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-slate-700">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {projects.some(p => p.name || p.description) && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-700 border-b-2 border-slate-300 pb-2 mb-4">Projects</h2>
            {projects.map(prj => (
              <div key={prj.id} className="mb-6">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">{prj.name}</h3>
                  <div className="flex gap-3 text-sm">
                    {prj.github && (
                      <a className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800" href={prj.github} target="_blank" rel="noreferrer">
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {prj.demo && (
                      <a className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800" href={prj.demo} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} /> Live
                      </a>
                    )}
                  </div>
                </div>
                {prj.description && (
                  <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">{prj.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
};

export default function ResumeBuilder() {
  const [personal, setPersonal] = useState(updatedData.personal);
  const [education, setEducation] = useState(updatedData.education);
  const [experience, setExperience] = useState(updatedData.experience);
  const [skills, setSkills] = useState(updatedData.skills);
  const [projects, setProjects] = useState(updatedData.projects);
  
  const [template, setTemplate] = useState("modern");
  const [loading, setLoading] = useState(false);
  
  // Handlers
  function updatePersonal(field, value) { setPersonal((p) => ({ ...p, [field]: value })); }
  function addEducation() { setEducation((e) => [...e, { id: Date.now(), school: "", degree: "", start: "", end: "", notes: "" }]); }
  function updateEducation(id, field, value) { setEducation((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it))); }
  function removeEducation(id) { setEducation((list) => list.filter((it) => it.id !== id)); }
  function addExperience() { setExperience((e) => [...e, { id: Date.now(), company: "", role: "", start: "", end: "", bullets: [""] }]); }
  function updateExperienceField(id, field, value) { setExperience((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it))); }
  function addBullet(id) { setExperience((list) => list.map((it) => (it.id === id ? { ...it, bullets: [...it.bullets, ""] } : it))); }
  function updateBullet(id, idx, value) { setExperience((list) => list.map((it) => (it.id === id ? { ...it, bullets: it.bullets.map((b, i) => (i === idx ? value : b)) } : it))); }
  function removeExperience(id) { setExperience((list) => list.filter((it) => it.id !== id)); }
  function removeBullet(id, idx) { setExperience((list) => list.map((it) => (it.id === id ? { ...it, bullets: it.bullets.filter((_, i) => i !== idx) } : it))); }
  function addProject() { setProjects((list) => [...list, { id: Date.now(), name: "", description: "", github: "", demo: "" }]); }
  function updateProjectField(id, field, value) { setProjects((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it))); }
  function removeProject(id) { setProjects((list) => list.filter((it) => it.id !== id)); }
  
  function resetData() {
    setPersonal(updatedData.personal);
    setEducation(updatedData.education);
    setExperience(updatedData.experience);
    setSkills(updatedData.skills);
    setProjects(updatedData.projects);
  }

  function downloadPDF() {
    setLoading(true);
    const element = document.getElementById('resume-preview');
    if (!element) {
        setLoading(false);
        console.error("Resume preview element not found!");
        return;
    }

    const opt = {
      margin:       0,
      filename:     `${personal.firstName || "Resume"}_${personal.lastName || ""}.pdf`.trim(),
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Use the html2pdf global function loaded from the CDN
    window.html2pdf().from(element).set(opt).save().then(() => {
        setLoading(false);
    }).catch(err => {
        console.error("PDF generation failed:", err);
        setLoading(false);
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- CONTROLS / FORM PANEL --- */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-indigo-600" size={28}/>
                    <h2 className="text-2xl font-bold text-slate-800">Resume Builder</h2>
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Template</label>
                    <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={template} onChange={(e) => setTemplate(e.target.value)}>
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                    </select>
                </div>

                <AccordionItem title="Personal Info" icon={<User size={20} className="text-slate-600"/>}>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="First name" value={personal.firstName} onChange={(v) => updatePersonal("firstName", v)} />
                            <Field label="Last name" value={personal.lastName} onChange={(v) => updatePersonal("lastName", v)} />
                        </div>
                        <Field label="Professional title" value={personal.title} onChange={(v) => updatePersonal("title", v)} />
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Email" type="email" value={personal.email} onChange={(v) => updatePersonal("email", v)} />
                            <Field label="Phone" type="tel" value={personal.phone} onChange={(v) => updatePersonal("phone", v)} />
                        </div>
                        <Field label="Location" value={personal.location} onChange={(v) => updatePersonal("location", v)} />
                        <Field label="LinkedIn" value={personal.linkedin} onChange={(v) => updatePersonal("linkedin", v)} placeholder="linkedin.com/in/..." />
                        <Field label="Website" value={personal.website} onChange={(v) => updatePersonal("website", v)} placeholder="your-portfolio.com" />
                        <Textarea label="Summary" value={personal.summary} onChange={(v) => updatePersonal("summary", v)} placeholder="Short professional summary..."/>
                    </div>
                </AccordionItem>

                <AccordionItem title="Skills" icon={<Lightbulb size={20} className="text-slate-600"/>}>
                    <Field label="Skills (comma separated)" value={skills} onChange={(v) => setSkills(v)} placeholder="e.g. JavaScript, React, CSS" />
                </AccordionItem>

                <AccordionItem title="Education" icon={<GraduationCap size={20} className="text-slate-600"/>}>
                    {education.map((edu, i) => (
                      <div key={edu.id} className={`p-3 my-3 bg-slate-50 rounded-lg relative ${i > 0 ? 'mt-4' : ''}`}>
                          <div className="space-y-3">
                              <Field label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, "school", v)} />
                              <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} />
                              <div className="grid grid-cols-2 gap-3">
                                  <Field label="Start" value={edu.start} onChange={(v) => updateEducation(edu.id, "start", v)} />
                                  <Field label="End" value={edu.end} onChange={(v) => updateEducation(edu.id, "end", v)} />
                              </div>
                              <Field label="Notes" value={edu.notes} onChange={(v) => updateEducation(edu.id, "notes", v)} />
                          </div>
                          <button className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeEducation(edu.id)}>
                              <Trash2 size={16} />
                          </button>
                        </div>
                    ))}
                    <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2" onClick={addEducation}>
                        <Plus size={16} /> Add education
                    </button>
                </AccordionItem>
                
                <AccordionItem title="Experience" icon={<Briefcase size={20} className="text-slate-600"/>}>
                    {experience.map((exp, i) => (
                      <div key={exp.id} className={`p-3 my-3 bg-slate-50 rounded-lg relative ${i > 0 ? 'mt-4' : ''}`}>
                          <div className="space-y-3">
                              <Field label="Company" value={exp.company} onChange={(v) => updateExperienceField(exp.id, "company", v)} />
                              <Field label="Role" value={exp.role} onChange={(v) => updateExperienceField(exp.id, "role", v)} />
                              <div className="grid grid-cols-2 gap-3">
                                  <Field label="Start" value={exp.start} onChange={(v) => updateExperienceField(exp.id, "start", v)} />
                                  <Field label="End" value={exp.end} onChange={(v) => updateExperienceField(exp.id, "end", v)} />
                              </div>
                          </div>
                          <div className="mt-3">
                              <label className="block text-sm font-medium text-slate-600 mb-1">Bullets</label>
                              {exp.bullets.map((b, i) => (
                                <div key={i} className="flex gap-2 items-start mt-1">
                                  <textarea className="flex-1 w-full rounded-md border-slate-300 text-sm shadow-sm" rows={2} value={b} onChange={(e) => updateBullet(exp.id, i, e.target.value)} />
                                  <button className="text-red-500 hover:text-red-700 mt-1" onClick={() => removeBullet(exp.id, i)}> <Trash2 size={16} /> </button>
                                </div>
                              ))}
                              <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2" onClick={() => addBullet(exp.id)}>
                                <Plus size={14} /> Add bullet
                              </button>
                          </div>
                          <button className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeExperience(exp.id)}>
                              <Trash2 size={16} />
                          </button>
                        </div>
                    ))}
                    <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2" onClick={addExperience}>
                        <Plus size={16} /> Add experience
                    </button>
                </AccordionItem>

                <AccordionItem title="Projects" icon={<Link2 size={20} className="text-slate-600"/>}>
                    {projects.map((prj, i) => (
                      <div key={prj.id} className={`p-3 my-3 bg-slate-50 rounded-lg relative ${i > 0 ? 'mt-4' : ''}`}>
                          <div className="space-y-3">
                              <Field label="Project name" value={prj.name} onChange={(v) => updateProjectField(prj.id, "name", v)} />
                              <Textarea label="Description" rows={3} value={prj.description} onChange={(v) => updateProjectField(prj.id, "description", v)} />
                              <div className="grid grid-cols-2 gap-3">
                                  <Field label="GitHub URL" value={prj.github} onChange={(v) => updateProjectField(prj.id, "github", v)} placeholder="https://github.com/..." />
                                  <Field label="Live URL" value={prj.demo} onChange={(v) => updateProjectField(prj.id, "demo", v)} placeholder="https://..." />
                              </div>
                          </div>
                          <button className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeProject(prj.id)}>
                              <Trash2 size={16} />
                          </button>
                        </div>
                    ))}
                    <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-2" onClick={addProject}>
                        <Plus size={16} /> Add project
                    </button>
                </AccordionItem>
                
                {/* --- ACTION BUTTONS --- */}
                <div className="flex gap-3 pt-6 mt-4 border-t">
                    <button 
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors disabled:bg-indigo-400" 
                        onClick={downloadPDF}
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {loading ? 'Exporting...' : 'Export PDF'}
                    </button>
                    <button className="w-full px-4 py-2 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors" onClick={resetData}>
                        Reset
                    </button>
                </div>
            </div>
        </div>

        {/* --- RESUME PREVIEW PANEL --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Preview</h3>
            <div className="bg-slate-200 p-4 sm:p-8 rounded-lg">
                <div id="resume-preview" className="bg-slate-50 border rounded-md overflow-hidden shadow-lg mx-auto" style={{width: '21cm', minHeight: '29.7cm'}}>
                    {template === "modern"
                        ? <ModernTemplate personal={personal} experience={experience} education={education} projects={projects} skills={skills} />
                        : <ClassicTemplate personal={personal} experience={experience} education={education} projects={projects} skills={skills} />
                    }
                </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

