import React, { useState, useReducer, useContext, useEffect, useRef } from "react";

// The imports for 'react-image-crop' have been removed as we are using a custom component now.

import {
  Plus, Trash2, Download, FileText, User, Briefcase, GraduationCap, Lightbulb,
  Link2, Mail, Phone, MapPin, Linkedin, Globe, Github, ExternalLink, ChevronDown,
  Loader2, Eye, Palette, Star, RefreshCcw, XCircle, LayoutTemplate,
  Sparkles, Pencil, Crop, Check, X, Upload, ZoomIn, ZoomOut, Move
} from 'lucide-react';

// --- Data ---
// sampleData and emptyData remain unchanged
const sampleData = {
  personal: {
    firstName: "Nikhil",
    lastName: "Pandey",
    photo: "",
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

const emptyData = {
  personal: { firstName: "", lastName: "", photo: "", title: "", email: "", phone: "", location: "", linkedin: "", website: "", summary: "" },
  education: [],
  experience: [],
  skills: "",
  projects: []
};


// --- State Management (Reducer & Context) ---
const ResumeContext = React.createContext();

function resumeReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE': return action.payload;
    case 'UPDATE_PERSONAL': return { ...state, personal: { ...state.personal, [action.payload.field]: action.payload.value } };
    case 'UPDATE_SKILLS': return { ...state, skills: action.payload };
    case 'ADD_EDUCATION': return { ...state, education: [...state.education, { id: Date.now(), school: "", degree: "", start: "", end: "", notes: "" }] };
    case 'UPDATE_EDUCATION': return { ...state, education: state.education.map(edu => edu.id === action.payload.id ? { ...edu, [action.payload.field]: action.payload.value } : edu) };
    case 'REMOVE_EDUCATION': return { ...state, education: state.education.filter(edu => edu.id !== action.payload.id) };
    case 'ADD_EXPERIENCE': return { ...state, experience: [...state.experience, { id: Date.now(), company: "", role: "", start: "", end: "", bullets: [""] }] };
    case 'UPDATE_EXPERIENCE': return { ...state, experience: state.experience.map(exp => exp.id === action.payload.id ? { ...exp, [action.payload.field]: action.payload.value } : exp) };
    case 'REMOVE_EXPERIENCE': return { ...state, experience: state.experience.filter(exp => exp.id !== action.payload.id) };
    case 'ADD_BULLET': return { ...state, experience: state.experience.map(exp => exp.id === action.payload.id ? { ...exp, bullets: [...exp.bullets, ""] } : exp) };
    case 'UPDATE_BULLET': return { ...state, experience: state.experience.map(exp => exp.id === action.payload.id ? { ...exp, bullets: exp.bullets.map((b, i) => i === action.payload.idx ? action.payload.value : b) } : exp) };
    case 'REMOVE_BULLET': return { ...state, experience: state.experience.map(exp => exp.id === action.payload.id ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== action.payload.idx) } : exp) };
    case 'ADD_PROJECT': return { ...state, projects: [...state.projects, { id: Date.now(), name: "", description: "", github: "", demo: "" }] };
    case 'UPDATE_PROJECT': return { ...state, projects: state.projects.map(prj => prj.id === action.payload.id ? { ...prj, [action.payload.field]: action.payload.value } : prj) };
    case 'REMOVE_PROJECT': return { ...state, projects: state.projects.filter(prj => prj.id !== action.payload.id) };
    case 'RESET_DATA': return sampleData;
    case 'CLEAR_DATA': return emptyData;
    default: return state;
  }
}

const LOCAL_STORAGE_KEY = 'resumeBuilderData';

// --- NEW Custom Image Cropper (Dependency-Free) ---
function CustomImageCropper({ src, onSave, onClose }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const CROP_BOX_SIZE = 300; // The visible crop area size in pixels

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const scaledSize = getScaledImageSize(image.width, image.height, CROP_BOX_SIZE);
      setImageSize(scaledSize);
      // Center the image initially
      setPosition({
        x: (CROP_BOX_SIZE - scaledSize.width) / 2,
        y: (CROP_BOX_SIZE - scaledSize.height) / 2,
      });
      imageRef.current = image;
    };
  }, [src]);

  const getScaledImageSize = (width, height, minSize) => {
    const aspectRatio = width / height;
    if (aspectRatio > 1) { // Landscape
      return { width: minSize * aspectRatio, height: minSize };
    } else { // Portrait or square
      return { width: minSize, height: minSize / aspectRatio };
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (factor) => {
    setScale(prev => Math.max(0.5, Math.min(prev * factor, 3)));
  };

  const handleSave = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    const finalSize = 512;
    canvas.width = finalSize;
    canvas.height = finalSize;
    const ctx = canvas.getContext('2d');

    const currentWidth = imageSize.width * scale;
    const currentHeight = imageSize.height * scale;
    
    // Calculate the source rectangle on the original image
    const sourceX = ((CROP_BOX_SIZE / 2) - position.x) / currentWidth * image.naturalWidth;
    const sourceY = ((CROP_BOX_SIZE / 2) - position.y) / currentHeight * image.naturalHeight;
    const sourceSize = (CROP_BOX_SIZE / Math.min(currentWidth, currentHeight)) * Math.min(image.naturalWidth, image.naturalHeight);
    
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      finalSize,
      finalSize
    );

    onSave(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Crop size={20} /> Edit Your Photo</h2>
        <div ref={containerRef} className="relative mx-auto bg-slate-900/10 rounded-full overflow-hidden cursor-move" style={{ width: CROP_BOX_SIZE, height: CROP_BOX_SIZE }} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          {imageSize.width > 0 && (
            <img src={src} alt="Crop" style={{
              position: 'absolute',
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: `${imageSize.width * scale}px`,
              height: `${imageSize.height * scale}px`,
              pointerEvents: 'none',
              transition: 'transform 0.1s ease-out'
            }} />
          )}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => handleZoom(0.9)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"><ZoomOut size={20} /></button>
          <input type="range" min="0.5" max="3" step="0.01" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-48" />
          <button onClick={() => handleZoom(1.1)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"><ZoomIn size={20} /></button>
        </div>
        <p className="text-center text-sm text-slate-500 flex items-center justify-center gap-2"><Move size={16}/> Drag to move, use slider to zoom</p>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-2"><X size={16} />Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2"><Check size={16} />Save Photo</button>
        </div>
      </div>
    </div>
  );
}


// --- Reusable UI Components ---
const Field = ({ label, value, onChange, placeholder = "", type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <input
      type={type}
      className="w-full rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 text-slate-800 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 hover:border-slate-300"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder = "", rows = 4 }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <textarea
      className="w-full rounded-xl border-2 border-slate-200 bg-white/50 px-4 py-3 text-slate-800 shadow-sm transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 hover:border-slate-300 resize-vertical"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const AccordionItem = ({ title, icon, children, isOpen, onToggle }) => (
    <div className="border-2 border-slate-200/80 rounded-2xl overflow-hidden bg-white/50 transition-all duration-300 hover:border-slate-300 hover:shadow-lg">
      <button className="w-full flex justify-between items-center p-5 font-bold text-slate-800" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">{icon}</div>
          <h3 className="text-lg">{title}</h3>
        </div>
        <ChevronDown size={24} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="p-5 pt-0">{children}</div>
        </div>
      </div>
    </div>
);

const TemplateButton = ({ label, icon: Icon, onClick, isActive }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 w-full ${isActive ? 'border-indigo-500 bg-indigo-50 shadow-lg' : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-slate-50'}`}>
    <Icon size={24} className={isActive ? 'text-indigo-600' : 'text-slate-500'} />
    <span className={`text-sm font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{label}</span>
  </button>
);


// --- Resume Preview Templates ---
// Templates are unchanged
const ClassicTemplate = ({ personal, experience, education, projects, skills, color = "indigo" }) => {
  const colorClasses = {
    indigo: { primary: "text-indigo-600", border: "border-indigo-200" },
    slate: { primary: "text-slate-600", border: "border-slate-200" },
    blue: { primary: "text-blue-600", border: "border-blue-200" },
    emerald: { primary: "text-emerald-600", border: "border-emerald-200" },
    amber: { primary: "text-amber-600", border: "border-amber-200" },
    rose: { primary: "text-rose-600", border: "border-rose-200" },
  };
  const colors = colorClasses[color] || colorClasses.indigo;
  return (
    <div className="bg-white p-8 font-serif text-slate-800 leading-snug" style={{minHeight: '29.7cm'}}>
      <div className="text-center mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">{personal.firstName} <span className={colors.primary}>{personal.lastName}</span></h1>
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
          <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-2 flex items-center gap-2`}><User size={16} />Professional Summary</h2>
          <p className="text-sm text-slate-700 whitespace-pre-line">{personal.summary}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6">
        {experience.length > 0 && (<div>
          <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-3 flex items-center gap-2`}><Briefcase size={16} />Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (<div key={exp.id}>
              <div className="flex justify-between items-start mb-0.5">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{exp.role}</h3>
                  <p className="text-sm font-semibold text-slate-600">{exp.company}</p>
                </div>
                <p className="text-xs font-medium text-slate-500 pt-1">{exp.start} - {exp.end}</p>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-700">
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>))}
          </div>
        </div>)}
        {projects.length > 0 && (<div>
          <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-3 flex items-center gap-2`}><Link2 size={16} />Projects</h2>
          <div className="space-y-3">
            {projects.map((prj) => (<div key={prj.id}>
              <h3 className="text-sm font-bold text-slate-800">{prj.name}</h3>
              {prj.description && (<p className="text-xs text-slate-700 mb-0.5">{prj.description}</p>)}
              {(prj.github || prj.demo) && (<div className="flex gap-3 text-xs">
                {prj.github && <a className={`inline-flex items-center gap-1 font-medium ${colors.primary} hover:underline`} href={prj.github} target="_blank" rel="noreferrer">GitHub</a>}
                {prj.demo && <a className={`inline-flex items-center gap-1 font-medium ${colors.primary} hover:underline`} href={prj.demo} target="_blank" rel="noreferrer">Live Demo</a>}
              </div>)}
            </div>))}
          </div>
        </div>)}
        {education.length > 0 && (<div>
          <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-3 flex items-center gap-2`}><GraduationCap size={16} />Education</h2>
          <div className="space-y-3">
            {education.map((ed) => (<div key={ed.id}>
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-slate-800">{ed.school}</h3>
                <p className="text-xs font-medium text-slate-500">{ed.start} - {ed.end}</p>
              </div>
              <p className="text-xs text-slate-700 font-semibold">{ed.degree}</p>
              {ed.notes && <p className="text-xs text-slate-600 italic">{ed.notes}</p>}
            </div>))}
          </div>
        </div>)}
        {skills && (<div>
          <h2 className={`text-lg font-bold ${colors.primary} border-b ${colors.border} pb-1 mb-2 flex items-center gap-2`}><Lightbulb size={16} />Skills</h2>
          <p className="text-xs text-slate-700">{skills}</p>
        </div>)}
      </div>
    </div>
  );
};

const ModernTemplate = ({ personal, experience, education, projects, skills, color = "indigo" }) => {
  const colorClasses = {
    indigo: { primary: "text-indigo-600", bg: "bg-indigo-700" },
    slate: { primary: "text-slate-600", bg: "bg-slate-700" },
    blue: { primary: "text-blue-600", bg: "bg-blue-700" },
    emerald: { primary: "text-emerald-600", bg: "bg-emerald-700" },
    amber: { primary: "text-amber-600", bg: "bg-amber-700" },
    rose: { primary: "text-rose-600", bg: "bg-rose-700" },
  };
  const colors = colorClasses[color] || colorClasses.indigo;
  const ContactInfo = ({ icon: Icon, text, href }) => (
    text && (<a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors group">
      <div className="p-1 bg-white bg-opacity-10 rounded-full group-hover:bg-opacity-20 transition-all"><Icon size={12} /></div>
      <span className="break-all text-xs">{text.replace(/https?:\/\//, '')}</span>
    </a>)
  );
  return (
    <div className="flex min-w-full bg-white font-sans" style={{minHeight: '29.7cm'}}>
      <div className={`w-1/3 ${colors.bg} text-white p-6`}>
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-white border-opacity-30 overflow-hidden">
            {personal.photo ? (<img src={personal.photo} alt={`${personal.firstName} ${personal.lastName}`} className="w-full h-full object-cover object-center block" />) : (<User size={40} className="text-white" />)}
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
          {education.length > 0 && (<div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-200 border-b border-indigo-500 pb-1 mb-2">Education</h2>
            <div className="space-y-2">
              {education.map(ed => (<div key={ed.id}>
                <p className="font-semibold text-white text-xs">{ed.school}</p>
                <p className="text-indigo-100 text-xs">{ed.degree}</p>
                <p className="text-indigo-300 text-xs">{ed.start} - {ed.end}</p>
                {ed.notes && <p className="text-indigo-200 text-xs mt-0.5 italic">{ed.notes}</p>}
              </div>))}
            </div>
          </div>)}
          {skills && (<div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-200 border-b border-indigo-500 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (<span key={i} className="bg-white bg-opacity-15 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">{s}</span>))}
            </div>
          </div>)}
        </div>
      </div>
      <div className="w-2/3 p-8">
        {personal.summary && (<div className="mb-6">
          <h2 className={`text-xl font-bold ${colors.primary} border-b-2 ${colors.primary.replace('text-', 'border-')} pb-1 mb-2 flex items-center gap-3`}><User size={18} /> Professional Summary</h2>
          <p className="text-sm leading-normal text-slate-700">{personal.summary}</p>
        </div>)}
        {experience.length > 0 && (<div className="mb-6">
          <h2 className={`text-xl font-bold ${colors.primary} border-b-2 ${colors.primary.replace('text-', 'border-')} pb-1 mb-3 flex items-center gap-3`}><Briefcase size={18} /> Experience</h2>
          <div className="space-y-4">
            {experience.map(exp => (<div key={exp.id}>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-lg font-bold text-slate-800">{exp.role}</h3>
                <p className="text-xs font-medium text-slate-500">{exp.start} - {exp.end}</p>
              </div>
              <p className="text-base font-semibold text-slate-600 mb-1">{exp.company}</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-slate-700">
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>))}
          </div>
        </div>)}
        {projects.length > 0 && (<div>
          <h2 className={`text-xl font-bold ${colors.primary} border-b-2 ${colors.primary.replace('text-', 'border-')} pb-1 mb-3 flex items-center gap-3`}><Link2 size={18} /> Projects</h2>
          <div className="space-y-4">
            {projects.map(prj => (<div key={prj.id}>
              <h3 className="text-base font-bold text-slate-800">{prj.name}</h3>
              <p className="text-xs text-slate-700 leading-normal mb-1">{prj.description}</p>
              <div className="flex gap-3">
                {prj.github && <a className={`inline-flex items-center gap-1 font-medium text-xs ${colors.primary} hover:underline`} href={prj.github} target="_blank" rel="noreferrer"><Github size={12} /> GitHub</a>}
                {prj.demo && <a className={`inline-flex items-center gap-1 font-medium text-xs ${colors.primary} hover:underline`} href={prj.demo} target="_blank" rel="noreferrer"><ExternalLink size={12} /> Live</a>}
              </div>
            </div>))}
          </div>
        </div>)}
      </div>
    </div>
  );
};

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
            <div className={`w-32 h-32 ${colors.lightBg} rounded-full mx-auto mb-3 flex items-center justify-center ring-4 ring-offset-2 ${colors.ring} overflow-hidden`}>
              {personal.photo ? (<img src={personal.photo} alt={`${personal.firstName} ${personal.lastName}`} className="w-full h-full object-cover object-center block" />) : (<User size={56} className={colors.primary} />)}
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
            {education.length > 0 && (<div>
              <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider">Education</h3>
              {education.map(ed => (<div key={ed.id} className="mb-2">
                <p className="font-bold text-xs text-slate-800">{ed.school}</p>
                <p className="text-xs text-slate-700">{ed.degree}</p>
                <p className="text-[10px] text-slate-500">{ed.start} - {ed.end}</p>
              </div>))}
            </div>)}
            {skills && (<div>
              <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 uppercase tracking-wider">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (<span key={i} className={`px-2 py-0.5 text-[10px] rounded-full ${colors.lightBg} ${colors.primary}`}>{skill}</span>))}
              </div>
            </div>)}
          </div>
        </div>
        <div className="col-span-2 space-y-6">
          {personal.summary && (<div>
            <h2 className={`text-lg font-extrabold ${colors.primary} mb-1.5 uppercase tracking-wider`}>Profile</h2>
            <p className="text-xs text-slate-700 leading-snug">{personal.summary}</p>
          </div>)}
          {experience.length > 0 && (<div>
            <h2 className={`text-lg font-extrabold ${colors.primary} mb-2 uppercase tracking-wider`}>Work Experience</h2>
            <div className="space-y-4">
              {experience.map(exp => (<div key={exp.id} className="relative pl-4">
                <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${colors.bg}`}></div>
                <p className="text-[10px] text-slate-500 absolute right-0 top-0">{exp.start} - {exp.end}</p>
                <h3 className="text-sm font-bold text-slate-800">{exp.role}</h3>
                <p className="text-xs font-semibold text-slate-600 mb-1">{exp.company}</p>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>))}
            </div>
          </div>)}
          {projects.length > 0 && (<div>
            <h2 className={`text-lg font-extrabold ${colors.primary} mb-2 uppercase tracking-wider`}>Projects</h2>
            <div className="space-y-3">
              {projects.map(prj => (<div key={prj.id}>
                  <h3 className="text-sm font-bold text-slate-800">{prj.name}</h3>
                  <p className="text-xs text-slate-700 leading-snug">{prj.description}</p>
                  <div className="flex gap-3 mt-0.5">
                    {prj.github && <a className={`text-[11px] ${colors.primary} hover:underline`} href={prj.github} target="_blank" rel="noreferrer">GitHub</a>}
                    {prj.demo && <a className={`text-[11px] ${colors.primary} hover:underline`} href={prj.demo} target="_blank" rel="noreferrer">Demo</a>}
                  </div>
              </div>))}
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
};


// --- Editor & Preview Components ---
function EditorPanel() {
  const { state, dispatch } = useContext(ResumeContext);
  const { personal, education, experience, skills, projects } = state;
  const [openSections, setOpenSections] = useState({ personal: true, skills: true, education: true, experience: true, projects: true });
  const [imageToCrop, setImageToCrop] = useState(null);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      dispatch({ type: 'CLEAR_DATA' });
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      {imageToCrop && (
        <CustomImageCropper
          src={imageToCrop}
          onClose={() => setImageToCrop(null)}
          onSave={(croppedDataUrl) => {
            dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'photo', value: croppedDataUrl } });
            setImageToCrop(null);
          }}
        />
      )}
      <div className="space-y-4">
        <AccordionItem title="Personal Info" icon={<User size={20} />} isOpen={openSections.personal} onToggle={() => setOpenSections(p => ({...p, personal: !p.personal}))}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" value={personal.firstName} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'firstName', value: v } })} />
              <Field label="Last name" value={personal.lastName} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'lastName', value: v } })} />
            </div>
            <Field label="Photo URL" value={personal.photo || ''} placeholder="https://..." onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'photo', value: v } })} />
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 font-semibold">
                <Upload size={18} />
                Upload & Edit
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
              <button onClick={() => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'photo', value: '' } })} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300" aria-label="Remove photo">
                <Trash2 size={18} />
              </button>
            </div>
            <Field label="Professional title" value={personal.title} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'title', value: v } })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" type="email" value={personal.email} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'email', value: v } })} />
              <Field label="Phone" type="tel" value={personal.phone} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'phone', value: v } })} />
            </div>
            <Field label="Location" value={personal.location} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'location', value: v } })} />
            <Field label="LinkedIn" value={personal.linkedin} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'linkedin', value: v } })} placeholder="linkedin.com/in/..." />
            <Field label="Website" value={personal.website} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'website', value: v } })} placeholder="your-portfolio.com" />
            <Textarea label="Summary" value={personal.summary} onChange={(v) => dispatch({ type: 'UPDATE_PERSONAL', payload: { field: 'summary', value: v } })} placeholder="Short professional summary..." />
          </div>
        </AccordionItem>
        <AccordionItem title="Skills" icon={<Star size={20} />} isOpen={openSections.skills} onToggle={() => setOpenSections(p => ({...p, skills: !p.skills}))}>
          <Field label="Skills (comma separated)" value={skills} onChange={(v) => dispatch({ type: 'UPDATE_SKILLS', payload: v })} placeholder="e.g. JavaScript, React, CSS" />
        </AccordionItem>
        <AccordionItem title="Education" icon={<GraduationCap size={20} />} isOpen={openSections.education} onToggle={() => setOpenSections(p => ({...p, education: !p.education}))}>
            {education.map((edu, i) => (
                <div key={edu.id} className={`p-4 bg-slate-50 rounded-xl border-2 border-slate-200 relative transition-all duration-300 hover:border-slate-300 ${i > 0 ? 'mt-4' : ''}`}>
                    <div className="space-y-4">
                        <Field label="School" value={edu.school} onChange={(v) => dispatch({ type: 'UPDATE_EDUCATION', payload: { id: edu.id, field: 'school', value: v } })} />
                        <Field label="Degree" value={edu.degree} onChange={(v) => dispatch({ type: 'UPDATE_EDUCATION', payload: { id: edu.id, field: 'degree', value: v } })} />
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Start year" value={edu.start} onChange={(v) => dispatch({ type: 'UPDATE_EDUCATION', payload: { id: edu.id, field: 'start', value: v } })} />
                            <Field label="End year" value={edu.end} onChange={(v) => dispatch({ type: 'UPDATE_EDUCATION', payload: { id: edu.id, field: 'end', value: v } })} />
                        </div>
                        <Field label="Notes" value={edu.notes} onChange={(v) => dispatch({ type: 'UPDATE_EDUCATION', payload: { id: edu.id, field: 'notes', value: v } })} placeholder="Certifications, achievements..." />
                    </div>
                    <button onClick={() => dispatch({ type: 'REMOVE_EDUCATION', payload: { id: edu.id } })} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"><Trash2 size={16} /></button>
                </div>
            ))}
            <button onClick={() => dispatch({ type: 'ADD_EDUCATION' })} className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 font-semibold"><Plus size={18} /> Add Education</button>
        </AccordionItem>
        <AccordionItem title="Experience" icon={<Briefcase size={20} />} isOpen={openSections.experience} onToggle={() => setOpenSections(p => ({...p, experience: !p.experience}))}>
            {experience.map((exp, i) => (
                <div key={exp.id} className={`p-4 bg-slate-50 rounded-xl border-2 border-slate-200 relative transition-all duration-300 hover:border-slate-300 ${i > 0 ? 'mt-4' : ''}`}>
                    <div className="space-y-4">
                        <Field label="Company" value={exp.company} onChange={(v) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id: exp.id, field: 'company', value: v } })} />
                        <Field label="Role" value={exp.role} onChange={(v) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id: exp.id, field: 'role', value: v } })} />
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Start date" value={exp.start} onChange={(v) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id: exp.id, field: 'start', value: v } })} />
                            <Field label="End date" value={exp.end} onChange={(v) => dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id: exp.id, field: 'end', value: v } })} />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Responsibilities</label>
                            {exp.bullets.map((b, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input className="flex-1 rounded-xl border-2 border-slate-200 bg-white/50 px-3 py-2 text-slate-800 shadow-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20" value={b} placeholder="Describe a responsibility..." onChange={(e) => dispatch({ type: 'UPDATE_BULLET', payload: { id: exp.id, idx: idx, value: e.target.value } })} />
                                    <button onClick={() => dispatch({ type: 'REMOVE_BULLET', payload: { id: exp.id, idx: idx } })} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <button onClick={() => dispatch({ type: 'ADD_BULLET', payload: { id: exp.id } })} className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"><Plus size={16} /> Add responsibility</button>
                        </div>
                    </div>
                    <button onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', payload: { id: exp.id } })} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={16} /></button>
                </div>
            ))}
            <button onClick={() => dispatch({ type: 'ADD_EXPERIENCE' })} className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold"><Plus size={18} /> Add Experience</button>
        </AccordionItem>
        <AccordionItem title="Projects" icon={<Link2 size={20} />} isOpen={openSections.projects} onToggle={() => setOpenSections(p => ({...p, projects: !p.projects}))}>
            {projects.map((prj, i) => (
                <div key={prj.id} className={`p-4 bg-slate-50 rounded-xl border-2 border-slate-200 relative transition-all duration-300 hover:border-slate-300 ${i > 0 ? 'mt-4' : ''}`}>
                    <div className="space-y-4">
                        <Field label="Project name" value={prj.name} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT', payload: { id: prj.id, field: 'name', value: v } })} />
                        <Textarea label="Description" value={prj.description} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT', payload: { id: prj.id, field: 'description', value: v } })} rows={3} />
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="GitHub URL" value={prj.github} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT', payload: { id: prj.id, field: 'github', value: v } })} placeholder="https://..." />
                            <Field label="Live Demo URL" value={prj.demo} onChange={(v) => dispatch({ type: 'UPDATE_PROJECT', payload: { id: prj.id, field: 'demo', value: v } })} placeholder="https://..." />
                        </div>
                    </div>
                    <button onClick={() => dispatch({ type: 'REMOVE_PROJECT', payload: { id: prj.id } })} className="absolute top-3 right-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><Trash2 size={16} /></button>
                </div>
            ))}
            <button onClick={() => dispatch({ type: 'ADD_PROJECT' })} className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold"><Plus size={18} /> Add Project</button>
        </AccordionItem>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/80 space-y-4">
          <button onClick={() => dispatch({ type: 'RESET_DATA' })} className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all shadow-sm"><RefreshCcw size={18} /> Reset to Sample</button>
          <button onClick={handleClearData} className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 border-red-200 bg-white text-red-600 font-semibold hover:border-red-400 hover:bg-red-50 transition-all shadow-sm"><XCircle size={18} /> Clear All Data</button>
        </div>
      </div>
    </>
  );
}

function PreviewPanel({ template, colorScheme }) {
  const { state } = useContext(ResumeContext);
  const [loading, setLoading] = useState(false);

  async function downloadPDF() {
    setLoading(true);
    const element = document.getElementById('resume-preview');
    
    if (!element) {
      console.error('Resume preview element not found.');
      setLoading(false);
      return;
    }

    try {
      const safeFirstName = (state.personal.firstName || 'resume').replace(/[^a-z0-9]/gi, '_');
      const safeLastName = (state.personal.lastName || '').replace(/[^a-z0-9]/gi, '_');
      const filename = `${safeFirstName}_${safeLastName}`.replace(/__+/g, '_').replace(/_$/, '').replace(/^_/, '') || 'resume';

      const opt = {
        margin: 0,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      if (typeof window.html2pdf !== 'function') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load html2pdf script'));
          document.body.appendChild(script);
        });
      }
      
      await window.html2pdf().from(element).set(opt).save();

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sticky top-8">
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden">
        <div className="bg-slate-900/80 p-5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Preview</h3>
            <p className="text-slate-300 text-sm">Your resume will look like this</p>
          </div>
          <button onClick={downloadPDF} disabled={loading} className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            {loading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
        <div className="bg-slate-100/70 p-4 sm:p-8 min-h-[calc(100vh-100px)]">
          <div id="resume-preview" className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300">
            {template === "modern" && <ModernTemplate {...state} color={colorScheme} />}
            {template === "classic" && <ClassicTemplate {...state} color={colorScheme} />}
            {template === "creative" && <CreativeTemplate {...state} color={colorScheme} />}
          </div>
        </div>
      </div>
    </div>
  );
}

const Header = () => (
  <header className="bg-white/70 backdrop-blur-lg shadow-sm p-4 rounded-2xl border border-white/80 mb-6 sticky top-4 z-40">
    <div className="max-w-8xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md">
          <FileText className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">ResumeCraft Pro</h1>
      </div>
      <a href="https://github.com/n2023ik/Resume-bulder-app" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-all duration-300 hover:shadow-lg">
        <Github size={16} /> View on GitHub
      </a>
    </div>
  </header>
);

const Footer = () => (
  <footer className="text-center p-8 mt-8 text-slate-500 text-sm">
    <p>Made with &hearts; by <a href="https://github.com/n2023ik" target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline">Nikhil Pandey</a>.</p>
  </footer>
);


// --- Main App Component ---
export default function ResumeBuilder() {
  const initializer = (defaultData) => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : defaultData;
    } catch (e) {
      console.error("Failed to parse local storage data", e);
      return defaultData;
    }
  };

  const [state, dispatch] = useReducer(resumeReducer, sampleData, initializer);
  const [template, setTemplate] = useState("modern");
  const [colorScheme, setColorScheme] = useState("indigo");
  const [view, setView] = useState('editor');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans">
        <Header />
        <div className="max-w-8xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className={`xl:col-span-1 space-y-6 ${view === 'preview' ? 'hidden xl:block' : 'block'}`}>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/80">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Customize Your Resume</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Palette size={16} /> Template Style</label>
                  <div className="grid grid-cols-3 gap-3">
                    <TemplateButton label="Modern" icon={LayoutTemplate} onClick={() => setTemplate('modern')} isActive={template === 'modern'} />
                    <TemplateButton label="Classic" icon={FileText} onClick={() => setTemplate('classic')} isActive={template === 'classic'} />
                    <TemplateButton label="Creative" icon={Sparkles} onClick={() => setTemplate('creative')} isActive={template === 'creative'} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Color Scheme</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {["indigo", "slate", "blue", "emerald", "amber", "rose"].map(color => (
                      <button key={color} onClick={() => setColorScheme(color)} className={`h-10 rounded-xl border-2 transition-all duration-200 w-full ${ colorScheme === color ? `border-${color}-500 ring-4 ring-${color}-500/20` : 'border-slate-200 hover:border-slate-300' } bg-${color}-500`} aria-label={`Set color to ${color}`} aria-pressed={colorScheme === color}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <EditorPanel />
          </div>
          <div className={`xl:col-span-1 ${view === 'editor' ? 'hidden xl:block' : 'block'}`}>
            <PreviewPanel template={template} colorScheme={colorScheme} />
          </div>
        </div>
        <Footer />
        <button onClick={() => setView(v => v === 'editor' ? 'preview' : 'editor')} className="fixed bottom-6 right-6 z-50 flex xl:hidden items-center justify-center gap-3 pl-5 pr-6 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95">
          {view === 'editor' ? <Eye size={20} /> : <Pencil size={20} />}
          <span className="text-lg">{view === 'editor' ? 'Preview' : 'Edit'}</span>
        </button>
      </div>
    </ResumeContext.Provider>
  );
}
