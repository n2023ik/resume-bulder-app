import React, { useState } from "react";
import html2pdf from 'html2pdf.js';
import { Plus, Trash2, Download, FileText, User, Briefcase, GraduationCap, Lightbulb, Link2, Mail, Phone, MapPin, Linkedin, Globe, Github, ExternalLink, ChevronDown, Loader2, Eye, EyeOff, Palette, Star } from 'lucide-react';

// --- Data ---
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
const Field = ({ label, value, onChange, placeholder = "", type = "text", icon: Icon }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-indigo-500" />}
      {label}
    </label>
    <input
      type={type}
      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder = "", rows = 4, icon: Icon }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-indigo-500" />}
      {label}
    </label>
    <textarea
      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300 resize-vertical"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const AccordionItem = ({ title, icon, children, isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  return (
    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden mb-4 transition-all duration-300 hover:border-slate-300 hover:shadow-md">
      <button
        className="w-full flex justify-between items-center p-6 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <ChevronDown
          size={24}
          className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Resume Preview Templates ---

// Classic Single-Column Template (v3 - Ultra Compact)
const ClassicTemplate = ({ personal, experience, education, projects, skills, color = "indigo" }) => {
  const colorClasses = {
    indigo: { primary: "text-indigo-600", border: "border-indigo-200", bg: "bg-indigo-50" },
    slate: { primary: "text-slate-600", border: "border-slate-200", bg: "bg-slate-50" },
    blue: { primary: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50" },
    emerald: { primary: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" },
    amber: { primary: "text-amber-600", border: "border-amber-200", bg: "bg-amber-50" },
    rose: { primary: "text-rose-600", border: "border-rose-200", bg: "bg-rose-50" },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  // AGGRESSIVE SPACING REDUCTION: p-8, leading-snug
  return (
    <div className="bg-white p-8 font-serif text-slate-800 leading-snug" style={{minHeight: '29.7cm'}}>
      <div className="text-center mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">
          {personal.firstName} <span className={colors.primary}>{personal.lastName}</span>
        </h1>
        <p className="text-xl font-semibold text-slate-600 mb-3">{personal.title}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {personal.email && <a href={`mailto:${personal.email}`} className="hover:underline">{personal.email}</a>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <a href={`https://${personal.linkedin}`} className="hover:underline">{personal.linkedin}</a>}
          {personal.website && <a href={`https://${personal.website}`} className="hover:underline">{personal.website}</a>}
        </div>
      </div>

      {personal.summary && (
        <div className="mb-6">
          <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-2 flex items-center gap-2`}>
            <User size={16} />
            Professional Summary
          </h2>
          <p className="text-sm text-slate-700 whitespace-pre-line">
            {personal.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {experience.some(e => e.company) && (
          <div>
            <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-3 flex items-center gap-2`}>
              <Briefcase size={16} />
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-0.5">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{exp.role}</h3>
                      <p className="text-sm font-semibold text-slate-600">{exp.company}</p>
                    </div>
                    <p className="text-xs font-medium text-slate-500 pt-1">
                      {exp.start} - {exp.end}
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-700">
                    {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.some(p => p.name || p.description) && (
          <div>
            <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-3 flex items-center gap-2`}>
              <Link2 size={16} />
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((prj) => (
                <div key={prj.id}>
                  <h3 className="text-sm font-bold text-slate-800">{prj.name}</h3>
                  {prj.description && (
                    <p className="text-xs text-slate-700 mb-0.5">{prj.description}</p>
                  )}
                  {(prj.github || prj.demo) && (
                    <div className="flex gap-3 text-xs">
                      {prj.github && <a className={`inline-flex items-center gap-1 font-medium ${colors.primary} hover:underline`} href={prj.github} target="_blank" rel="noreferrer">GitHub</a>}
                      {prj.demo && <a className={`inline-flex items-center gap-1 font-medium ${colors.primary} hover:underline`} href={prj.demo} target="_blank" rel="noreferrer">Live Demo</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.some(e => e.school) && (
          <div>
            <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-3 flex items-center gap-2`}>
              <GraduationCap size={16} />
              Education
            </h2>
            <div className="space-y-3">
              {education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-slate-800">{ed.school}</h3>
                    <p className="text-xs font-medium text-slate-500">{ed.start} - {ed.end}</p>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">{ed.degree}</p>
                  {ed.notes && <p className="text-xs text-slate-600 italic">{ed.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && (
          <div>
            <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-2 flex items-center gap-2`}>
              <Lightbulb size={16} />
              Skills
            </h2>
            <p className="text-xs text-slate-700">{skills}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Modern Template (v3 - Ultra Compact)
const ModernTemplate = ({ personal, experience, education, projects, skills, color = "indigo" }) => {
  const colorClasses = {
    indigo: { primary: "text-indigo-600", bg: "bg-indigo-700", lightBg: "bg-indigo-50" },
    slate: { primary: "text-slate-600", bg: "bg-slate-700", lightBg: "bg-slate-50" },
    blue: { primary: "text-blue-600", bg: "bg-blue-700", lightBg: "bg-blue-50" },
    emerald: { primary: "text-emerald-600", bg: "bg-emerald-700", lightBg: "bg-emerald-50" },
    amber: { primary: "text-amber-600", bg: "bg-amber-700", lightBg: "bg-amber-50" },
    rose: { primary: "text-rose-600", bg: "bg-rose-700", lightBg: "bg-rose-50" },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  const ContactInfo = ({ icon: Icon, text, href }) => (
    text && (
      <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors group">
        <div className="p-1 bg-white bg-opacity-10 rounded-full group-hover:bg-opacity-20 transition-all">
          <Icon size={12} />
        </div>
        <span className="break-all text-xs">{text.replace(/https?:\/\//, '')}</span>
      </a>
    )
  );

  return (
    <div className="flex min-w-full bg-white font-sans" style={{minHeight: '29.7cm'}}>
      <div className={`w-1/3 ${colors.bg} text-white p-6`}>
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-white border-opacity-30">
            <User size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold leading-tight">{personal.firstName} {personal.lastName}</h1>
          <p className="text-md font-light text-indigo-200">{personal.title}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-200 border-b border-indigo-500 pb-1 mb-2">Contact</h2>
            <div className="space-y-1.5">
              <ContactInfo icon={Mail} text={personal.email} href={`mailto:${personal.email}`} />
              <ContactInfo icon={Phone} text={personal.phone} href={`tel:${personal.phone}`} />
              <ContactInfo icon={MapPin} text={personal.location} />
              <ContactInfo icon={Linkedin} text={personal.linkedin} href={`https://${personal.linkedin}`} />
              <ContactInfo icon={Globe} text={personal.website} href={`https://${personal.website}`} />
            </div>
          </div>
          {education.some(e => e.school) && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-200 border-b border-indigo-500 pb-1 mb-2">Education</h2>
              <div className="space-y-2">
                {education.map(ed => (
                  <div key={ed.id}>
                    <p className="font-semibold text-white text-xs">{ed.school}</p>
                    <p className="text-indigo-100 text-xs">{ed.degree}</p>
                    <p className="text-indigo-300 text-xs">{ed.start} - {ed.end}</p>
                    {ed.notes && <p className="text-indigo-200 text-xs mt-0.5 italic">{ed.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-200 border-b border-indigo-500 pb-1 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1">
                {skills.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
                  <span key={i} className="bg-white bg-opacity-15 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-2/3 p-8">
        {personal.summary && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.primary} border-b-2 ${colors.primary.replace('text-', 'border-')} pb-1 mb-2 flex items-center gap-3`}>
              <User size={18} /> Professional Summary
            </h2>
            <p className="text-sm leading-normal text-slate-700">{personal.summary}</p>
          </div>
        )}
        {experience.some(e => e.company) && (
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${colors.primary} border-b-2 ${colors.primary.replace('text-', 'border-')} pb-1 mb-3 flex items-center gap-3`}>
              <Briefcase size={18} /> Experience
            </h2>
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-lg font-bold text-slate-800">{exp.role}</h3>
                    <p className="text-xs font-medium text-slate-500">{exp.start} - {exp.end}</p>
                  </div>
                  <p className="text-base font-semibold text-slate-600 mb-1">{exp.company}</p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-700">
                    {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        {projects.some(p => p.name || p.description) && (
          <div>
            <h2 className={`text-xl font-bold ${colors.primary} border-b-2 ${colors.primary.replace('text-', 'border-')} pb-1 mb-3 flex items-center gap-3`}>
              <Link2 size={18} /> Projects
            </h2>
            <div className="space-y-4">
              {projects.map(prj => (
                <div key={prj.id}>
                  <h3 className="text-base font-bold text-slate-800">{prj.name}</h3>
                  <p className="text-xs text-slate-700 leading-normal mb-1">{prj.description}</p>
                  <div className="flex gap-3">
                    {prj.github && <a className={`inline-flex items-center gap-1 font-medium text-xs ${colors.primary} hover:underline`} href={prj.github} target="_blank" rel="noreferrer"><Github size={12} /> GitHub</a>}
                    {prj.demo && <a className={`inline-flex items-center gap-1 font-medium text-xs ${colors.primary} hover:underline`} href={prj.demo} target="_blank" rel="noreferrer"><ExternalLink size={12} /> Live</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Creative Template (v3 - Ultra Compact)
const CreativeTemplate = ({ personal, experience, education, projects, skills, color = "indigo" }) => {
  const colorClasses = {
    indigo: { primary: "text-indigo-600", bg: "bg-indigo-600", lightBg: "bg-indigo-50", ring: "ring-indigo-200" },
    slate: { primary: "text-slate-600", bg: "bg-slate-600", lightBg: "bg-slate-50", ring: "ring-slate-200" },
    blue: { primary: "text-blue-600", bg: "bg-blue-600", lightBg: "bg-blue-50", ring: "ring-blue-200" },
    emerald: { primary: "text-emerald-600", bg: "bg-emerald-600", lightBg: "bg-emerald-50", ring: "ring-emerald-200" },
    amber: { primary: "text-amber-600", bg: "bg-amber-600", lightBg: "bg-amber-50", ring: "ring-amber-200" },
    rose: { primary: "text-rose-600", bg: "bg-rose-600", lightBg: "bg-rose-50", ring: "ring-rose-200" },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="bg-white p-6 font-sans" style={{minHeight: '29.7cm'}}>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="text-center">
            <div className={`w-32 h-32 ${colors.lightBg} rounded-full mx-auto mb-3 flex items-center justify-center ring-4 ring-offset-2 ${colors.ring}`}>
              <User size={56} className={colors.primary} />
            </div>
            <h1 className="text-xl font-black text-slate-800">{personal.firstName} {personal.lastName}</h1>
            <p className={`text-sm font-semibold ${colors.primary}`}>{personal.title}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider">Contact</h3>
              <div className="space-y-1 text-[11px] text-slate-700">
                {personal.email && <p className="flex items-center gap-1.5"><Mail size={11} /> {personal.email}</p>}
                {personal.phone && <p className="flex items-center gap-1.5"><Phone size={11} /> {personal.phone}</p>}
                {personal.location && <p className="flex items-center gap-1.5"><MapPin size={11} /> {personal.location}</p>}
                {personal.linkedin && <p className="flex items-center gap-1.5"><Linkedin size={11} /> {personal.linkedin}</p>}
                {personal.website && <p className="flex items-center gap-1.5"><Globe size={11} /> {personal.website}</p>}
              </div>
            </div>
            {education.some(e => e.school) && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider">Education</h3>
                {education.map(ed => (
                  <div key={ed.id} className="mb-2">
                    <p className="font-bold text-xs text-slate-800">{ed.school}</p>
                    <p className="text-xs text-slate-700">{ed.degree}</p>
                    <p className="text-[10px] text-slate-500">{ed.start} - {ed.end}</p>
                  </div>
                ))}
              </div>
            )}
            {skills && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                    <span key={i} className={`px-2 py-0.5 text-[10px] rounded-full ${colors.lightBg} ${colors.primary}`}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-2 space-y-6">
          {personal.summary && (
            <div>
              <h2 className={`text-lg font-extrabold ${colors.primary} mb-1.5 uppercase tracking-wider`}>Profile</h2>
              <p className="text-xs text-slate-700 leading-snug">{personal.summary}</p>
            </div>
          )}

          {experience.some(e => e.company) && (
            <div>
              <h2 className={`text-lg font-extrabold ${colors.primary} mb-2 uppercase tracking-wider`}>Work Experience</h2>
              <div className="space-y-4">
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-4">
                    <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${colors.bg}`}></div>
                    <p className="text-[10px] text-slate-500 absolute right-0 top-0">{exp.start} - {exp.end}</p>
                    <h3 className="text-sm font-bold text-slate-800">{exp.role}</h3>
                    <p className="text-xs font-semibold text-slate-600 mb-1">{exp.company}</p>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                      {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.some(p => p.name) && (
            <div>
              <h2 className={`text-lg font-extrabold ${colors.primary} mb-2 uppercase tracking-wider`}>Projects</h2>
              <div className="space-y-3">
                {projects.map(prj => (
                  <div key={prj.id}>
                     <h3 className="text-sm font-bold text-slate-800">{prj.name}</h3>
                     <p className="text-xs text-slate-700 leading-snug">{prj.description}</p>
                     <div className="flex gap-3 mt-0.5">
                        {prj.github && <a className={`text-[11px] ${colors.primary} hover:underline`} href={prj.github} target="_blank" rel="noreferrer">GitHub</a>}
                        {prj.demo && <a className={`text-[11px] ${colors.primary} hover:underline`} href={prj.demo} target="_blank" rel="noreferrer">Demo</a>}
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  const [personal, setPersonal] = useState(updatedData.personal);
  const [education, setEducation] = useState(updatedData.education);
  const [experience, setExperience] = useState(updatedData.experience);
  const [skills, setSkills] = useState(updatedData.skills);
  const [projects, setProjects] = useState(updatedData.projects);
  
  const [template, setTemplate] = useState("modern");
  const [colorScheme, setColorScheme] = useState("indigo");
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  const [openSections, setOpenSections] = useState({
    personal: true,
    skills: true,
    education: true,
    experience: true,
    projects: true
  });

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
  function toggleSection(section) { setOpenSections(prev => ({ ...prev, [section]: !prev[section] })); }
  function resetData() {
    setPersonal(updatedData.personal);
    setEducation(updatedData.education);
    setExperience(updatedData.experience);
    setSkills(updatedData.skills);
    setProjects(updatedData.projects);
  }

  async function downloadPDF() {
    setLoading(true);
    const element = document.getElementById('resume-preview');
    if (!element) {
        setLoading(false);
        return console.error("Element not found");
    }

    const safeFirstName = (personal.firstName || 'Resume').replace(/[^a-z0-9]/gi, '_');
    const safeLastName = (personal.lastName || '').replace(/[^a-z0-9]/gi, '_');
    const filename = `${safeFirstName}_${safeLastName}.pdf`.replace(/__+/g, '_').replace(/_$/, '');

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false 
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      enableLinks: true 
    };

    try {
        await html2pdf().from(element).set(opt).save();
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Sorry, there was an error creating the PDF.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-8xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                <FileText className="text-white" size={32}/>
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Resume Builder
                </h2>
                <p className="text-slate-600 text-sm">Create your perfect resume</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Palette size={16} />
                  Template Style
                </label>
                <select 
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200"
                  value={template} 
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Color Scheme</label>
                <div className="grid grid-cols-3 gap-3">
                  {["indigo", "slate", "blue", "emerald", "amber", "rose"].map(color => (
                    <button
                      key={color}
                      onClick={() => setColorScheme(color)}
                      className={`h-10 rounded-xl border-2 transition-all duration-300 ${
                        colorScheme === color 
                          ? `border-${color}-500 shadow-lg scale-105` 
                          : 'border-slate-200 hover:border-slate-300'
                      } bg-${color}-500 hover:scale-110`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-all duration-300 hover:shadow-lg"
              >
                {previewMode ? <EyeOff size={20} /> : <Eye size={20} />}
                {previewMode ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
          </div>

          <div className={`space-y-4 transition-all duration-500 ${previewMode ? 'opacity-100' : 'opacity-100'}`}>
            <AccordionItem 
              title="Personal Info" 
              icon={<User size={20} className="text-indigo-600"/>}
              isOpen={openSections.personal}
              onToggle={() => toggleSection('personal')}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name" value={personal.firstName} onChange={(v) => updatePersonal("firstName", v)} icon={User} />
                  <Field label="Last name" value={personal.lastName} onChange={(v) => updatePersonal("lastName", v)} icon={User} />
                </div>
                <Field label="Professional title" value={personal.title} onChange={(v) => updatePersonal("title", v)} icon={Briefcase} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email" type="email" value={personal.email} onChange={(v) => updatePersonal("email", v)} icon={Mail} />
                  <Field label="Phone" type="tel" value={personal.phone} onChange={(v) => updatePersonal("phone", v)} icon={Phone} />
                </div>
                <Field label="Location" value={personal.location} onChange={(v) => updatePersonal("location", v)} icon={MapPin} />
                <Field label="LinkedIn" value={personal.linkedin} onChange={(v) => updatePersonal("linkedin", v)} placeholder="linkedin.com/in/..." icon={Linkedin} />
                <Field label="Website" value={personal.website} onChange={(v) => updatePersonal("website", v)} placeholder="your-portfolio.com" icon={Globe} />
                <Textarea label="Summary" value={personal.summary} onChange={(v) => updatePersonal("summary", v)} placeholder="Short professional summary..." icon={FileText} />
              </div>
            </AccordionItem>

            <AccordionItem 
              title="Skills" 
              icon={<Star size={20} className="text-indigo-600"/>}
              isOpen={openSections.skills}
              onToggle={() => toggleSection('skills')}
            >
              <Field label="Skills (comma separated)" value={skills} onChange={(v) => setSkills(v)} placeholder="e.g. JavaScript, React, CSS" icon={Lightbulb} />
            </AccordionItem>

            <AccordionItem 
              title="Education" 
              icon={<GraduationCap size={20} className="text-indigo-600"/>}
              isOpen={openSections.education}
              onToggle={() => toggleSection('education')}
            >
              {education.map((edu, i) => (
                <div key={edu.id} className={`p-6 my-4 bg-slate-50 rounded-2xl border-2 border-slate-200 relative transition-all duration-300 hover:border-slate-300 ${i > 0 ? 'mt-6' : ''}`}>
                  <div className="space-y-4">
                    <Field label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, "school", v)} icon={GraduationCap} />
                    <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Start year" value={edu.start} onChange={(v) => updateEducation(edu.id, "start", v)} />
                      <Field label="End year" value={edu.end} onChange={(v) => updateEducation(edu.id, "end", v)} />
                    </div>
                    <Field label="Notes" value={edu.notes} onChange={(v) => updateEducation(edu.id, "notes", v)} placeholder="Certifications, achievements..." />
                  </div>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addEducation}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 font-semibold"
              >
                <Plus size={20} />
                Add Education
              </button>
            </AccordionItem>

            <AccordionItem 
              title="Experience" 
              icon={<Briefcase size={20} className="text-indigo-600"/>}
              isOpen={openSections.experience}
              onToggle={() => toggleSection('experience')}
            >
              {experience.map((exp, i) => (
                <div key={exp.id} className={`p-6 my-4 bg-slate-50 rounded-2xl border-2 border-slate-200 relative transition-all duration-300 hover:border-slate-300 ${i > 0 ? 'mt-6' : ''}`}>
                  <div className="space-y-4">
                    <Field label="Company" value={exp.company} onChange={(v) => updateExperienceField(exp.id, "company", v)} icon={Briefcase} />
                    <Field label="Role" value={exp.role} onChange={(v) => updateExperienceField(exp.id, "role", v)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Start date" value={exp.start} onChange={(v) => updateExperienceField(exp.id, "start", v)} />
                      <Field label="End date" value={exp.end} onChange={(v) => updateExperienceField(exp.id, "end", v)} />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-700">Responsibilities</label>
                      {exp.bullets.map((b, idx) => (
                        <div key={idx} className="flex gap-3">
                          <input
                            className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200"
                            value={b}
                            placeholder="Describe your responsibilities..."
                            onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                          />
                          <button
                            onClick={() => removeBullet(exp.id, idx)}
                            className="px-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addBullet(exp.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 font-medium"
                      >
                        <Plus size={16} />
                        Add responsibility
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addExperience}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 font-semibold"
              >
                <Plus size={20} />
                Add Experience
              </button>
            </AccordionItem>

            <AccordionItem 
              title="Projects" 
              icon={<Link2 size={20} className="text-indigo-600"/>}
              isOpen={openSections.projects}
              onToggle={() => toggleSection('projects')}
            >
              {projects.map((prj, i) => (
                <div key={prj.id} className={`p-6 my-4 bg-slate-50 rounded-2xl border-2 border-slate-200 relative transition-all duration-300 hover:border-slate-300 ${i > 0 ? 'mt-6' : ''}`}>
                  <div className="space-y-4">
                    <Field label="Project name" value={prj.name} onChange={(v) => updateProjectField(prj.id, "name", v)} icon={Link2} />
                    <Textarea label="Description" value={prj.description} onChange={(v) => updateProjectField(prj.id, "description", v)} rows={3} />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="GitHub URL" value={prj.github} onChange={(v) => updateProjectField(prj.id, "github", v)} placeholder="https://..." />
                      <Field label="Live Demo URL" value={prj.demo} onChange={(v) => updateProjectField(prj.id, "demo", v)} placeholder="https://..." />
                    </div>
                  </div>
                  <button
                    onClick={() => removeProject(prj.id)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addProject}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 font-semibold"
              >
                <Plus size={20} />
                Add Project
              </button>
            </AccordionItem>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-white space-y-4">
              <button
                onClick={downloadPDF}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                {loading ? 'Generating PDF...' : 'Download PDF'}
              </button>
              
              <button
                onClick={resetData}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
              >
                Reset to Sample Data
              </button>
            </div>
          </div>
        </div>
        
        <div className={`xl:col-span-3 transition-all duration-500 ${previewMode ? 'opacity-100' : 'opacity-40'}`}>
          <div className="sticky top-8">
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-white overflow-hidden">
              <div className="bg-slate-800 text-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black">Resume Preview</h3>
                  <p className="text-slate-300">Real-time preview of your resume</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-xl">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live Preview</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-100 p-8 min-h-screen">
                <div id="resume-preview" className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
                  {template === "modern" && (
                    <ModernTemplate 
                      personal={personal} experience={experience} education={education}
                      projects={projects} skills={skills} color={colorScheme}
                    />
                  )}
                  {template === "classic" && (
                     <ClassicTemplate 
                      personal={personal} experience={experience} education={education}
                      projects={projects} skills={skills} color={colorScheme}
                    />
                  )}
                  {template === "creative" && (
                     <CreativeTemplate 
                      personal={personal} experience={experience} education={education}
                      projects={projects} skills={skills} color={colorScheme}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
