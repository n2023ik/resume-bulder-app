import React, { useState } from "react";
// Import icons from lucide-react
import { Plus, Trash2, Download, FileText, Mail, Phone, MapPin, Linkedin, Globe, Github, ExternalLink } from 'lucide-react';

// --- Reusable UI Components ---
// Updated Field component with better focus styles
const Field = ({ label, value, onChange, placeholder = "", type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <input
      type={type}
      className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Updated Textarea with better focus styles
const Textarea = ({ label, value, onChange, placeholder = "", rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <textarea
      className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// --- Resume Preview Templates (New Components for better organization) ---

// Classic Single-Column Template
const ClassicTemplate = ({ personal, experience, education, projects, skills }) => (
  <div className="bg-white p-8 font-serif text-slate-800">
    {/* Header */}
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

    {/* Summary */}
    {personal.summary && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Summary</h2>
        <p className="text-sm leading-relaxed">{personal.summary}</p>
      </div>
    )}

    {/* Experience */}
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

    {/* Education */}
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

    {/* Projects */}
    {projects.some(p => p.name || p.description) && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-1 mb-3">Projects</h2>
        {projects.map((prj) => (
          <div key={prj.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-medium">{prj.name}</h3>
            </div>
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

    {/* Skills */}
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
  const ContactInfo = ({ icon: Icon, text }) => (
    text && <div className="flex items-center gap-2 mb-2"><Icon size={14} /><span className="break-all">{text}</span></div>
  );

  return (
    <div className="flex min-w-full font-sans text-slate-800" style={{minHeight: '29.7cm'}}>
      {/* Left Sidebar */}
      <div className="w-1/3 bg-slate-800 text-white p-6">
        <h1 className="text-3xl font-bold">{personal.firstName}</h1>
        <h1 className="text-3xl font-bold mb-2">{personal.lastName}</h1>
        <p className="text-lg text-slate-300 mb-8">{personal.title}</p>

        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-500 pb-1 mb-4">Contact</h2>
        <div className="text-sm mb-8">
          <ContactInfo icon={Mail} text={personal.email} />
          <ContactInfo icon={Phone} text={personal.phone} />
          <ContactInfo icon={MapPin} text={personal.location} />
          <ContactInfo icon={Linkedin} text={personal.linkedin} />
          <ContactInfo icon={Globe} text={personal.website} />
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

      {/* Main Content */}
      <div className="w-2/3 p-8">
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
  const [personal, setPersonal] = useState({
    firstName: "", lastName: "", title: "", email: "", phone: "", location: "",
    linkedin: "", website: "", summary: "",
  });

  const [education, setEducation] = useState([
    { id: Date.now(), school: "", degree: "", start: "", end: "", notes: "" },
  ]);

  const [experience, setExperience] = useState([
    { id: Date.now() + 1, company: "", role: "", start: "", end: "Present", bullets: [""] },
  ]);

  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState([
    { id: Date.now() + 2, name: "", description: "", github: "", demo: "" },
  ]);
  const [template, setTemplate] = useState("modern");

  // --- Handlers (no changes needed here) ---
  function updatePersonal(field, value) {
    setPersonal((p) => ({ ...p, [field]: value }));
  }
  function addEducation() {
    setEducation((e) => [...e, { id: Date.now(), school: "", degree: "", start: "", end: "", notes: "" }]);
  }
  function updateEducation(id, field, value) {
    setEducation((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function removeEducation(id) {
    setEducation((list) => list.filter((it) => it.id !== id));
  }
  function addExperience() {
    setExperience((e) => [...e, { id: Date.now(), company: "", role: "", start: "", end: "", bullets: [""] }]);
  }
  function updateExperienceField(id, field, value) {
    setExperience((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function addBullet(id) {
    setExperience((list) => list.map((it) => (it.id === id ? { ...it, bullets: [...it.bullets, ""] } : it)));
  }
  function updateBullet(id, idx, value) {
    setExperience((list) =>
      list.map((it) => (it.id === id ? { ...it, bullets: it.bullets.map((b, i) => (i === idx ? value : b)) } : it))
    );
  }
  function removeExperience(id) {
    setExperience((list) => list.filter((it) => it.id !== id));
  }
  function removeBullet(id, idx) {
    setExperience((list) =>
      list.map((it) => (it.id === id ? { ...it, bullets: it.bullets.filter((_, i) => i !== idx) } : it))
    );
  }
  function addProject() {
    setProjects((list) => [...list, { id: Date.now(), name: "", description: "", github: "", demo: "" }]);
  }
  function updateProjectField(id, field, value) {
    setProjects((list) => list.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }
  function removeProject(id) {
    setProjects((list) => list.filter((it) => it.id !== id));
  }
  function downloadPDF() {
    const printArea = document.getElementById("resume-preview");
    if (!printArea) return window.print();
    const originalTitle = document.title;
    document.title = `${personal.firstName || "Resume"} ${personal.lastName || ""}`;
    const newWin = window.open("", "_blank");
    if (!newWin) return alert("Please allow popups to export the resume.");
    newWin.document.write(`
      <html>
        <head>
          <title>${document.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style> 
            @media print { 
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 0; size: A4; }
            } 
          </style>
        </head>
        <body>
          <div style="width: 21cm; min-height: 29.7cm;">${printArea.innerHTML}</div>
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    setTimeout(() => {
      newWin.print();
      newWin.close();
      document.title = originalTitle;
    }, 500);
  }

  // --- Main Render with updated UI ---
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- CONTROLS / FORM PANEL --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-indigo-600" size={28}/>
            <h2 className="text-2xl font-bold text-slate-800">Resume Builder</h2>
          </div>

          <div className="space-y-6">
            {/* Template Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Template</label>
              <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={template} onChange={(e) => setTemplate(e.target.value)}>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
              </select>
            </div>

            {/* Personal Info */}
            <div className="space-y-3 p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-slate-700">Personal Info</h3>
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
              <Field label="LinkedIn" value={personal.linkedin} onChange={(v) => updatePersonal("linkedin", v)} placeholder="Profile URL" />
              <Field label="Website" value={personal.website} onChange={(v) => updatePersonal("website", v)} placeholder="Portfolio URL" />
              <Textarea label="Summary" value={personal.summary} onChange={(v) => updatePersonal("summary", v)} placeholder="Short professional summary..."/>
            </div>

             {/* Skills */}
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Skills</h3>
              <Field label="Skills (comma separated)" value={skills} onChange={(v) => setSkills(v)} placeholder="e.g. JavaScript, React, CSS" />
            </div>

            {/* Education */}
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-slate-700">Education</h3>
              {education.map((edu) => (
                <div key={edu.id} className="border rounded-md p-3 my-3 bg-slate-50 relative">
                  <Field label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, "school", v)} />
                  <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Field label="Start" value={edu.start} onChange={(v) => updateEducation(edu.id, "start", v)} />
                    <Field label="End" value={edu.end} onChange={(v) => updateEducation(edu.id, "end", v)} />
                  </div>
                  <Field label="Notes" value={edu.notes} onChange={(v) => updateEducation(edu.id, "notes", v)} />
                  <button className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeEducation(edu.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={addEducation}>
                <Plus size={16} /> Add education
              </button>
            </div>

            {/* Experience */}
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-slate-700">Experience</h3>
              {experience.map((exp) => (
                <div key={exp.id} className="border rounded-md p-3 my-3 bg-slate-50 relative">
                  <Field label="Company" value={exp.company} onChange={(v) => updateExperienceField(exp.id, "company", v)} />
                  <Field label="Role" value={exp.role} onChange={(v) => updateExperienceField(exp.id, "role", v)} />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Field label="Start" value={exp.start} onChange={(v) => updateExperienceField(exp.id, "start", v)} />
                    <Field label="End" value={exp.end} onChange={(v) => updateExperienceField(exp.id, "end", v)} />
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Bullets</label>
                    {exp.bullets.map((b, i) => (
                      <div key={i} className="flex gap-2 items-center mt-1">
                        <textarea className="flex-1 rounded-md border-slate-300 text-sm" rows={2} value={b} onChange={(e) => updateBullet(exp.id, i, e.target.value)} />
                        <button className="text-red-500 hover:text-red-700" onClick={() => removeBullet(exp.id, i)}> <Trash2 size={16} /> </button>
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
              <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={addExperience}>
                <Plus size={16} /> Add experience
              </button>
            </div>

            {/* Projects */}
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold text-slate-700">Projects</h3>
              {projects.map((prj) => (
                <div key={prj.id} className="border rounded-md p-3 my-3 bg-slate-50 relative">
                  <Field label="Project name" value={prj.name} onChange={(v) => updateProjectField(prj.id, "name", v)} />
                  <Textarea label="Description" rows={3} value={prj.description} onChange={(v) => updateProjectField(prj.id, "description", v)} />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Field label="GitHub URL" value={prj.github} onChange={(v) => updateProjectField(prj.id, "github", v)} placeholder="https://github.com/..." />
                    <Field label="Live URL" value={prj.demo} onChange={(v) => updateProjectField(prj.id, "demo", v)} placeholder="https://..." />
                  </div>
                  <button className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeProject(prj.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={addProject}>
                <Plus size={16} /> Add project
              </button>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex gap-3 pt-4 border-t">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors" onClick={downloadPDF}>
                <Download size={16} /> Export PDF
              </button>
              <button className="w-full px-4 py-2 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => window.location.reload()}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* --- RESUME PREVIEW PANEL --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Preview</h3>
            <div id="resume-preview" className="bg-slate-50 border rounded-md overflow-hidden transform scale-[0.9] origin-top">
              {/* The selected template will be rendered here */}
              {template === "modern"
                ? <ModernTemplate personal={personal} experience={experience} education={education} projects={projects} skills={skills} />
                : <ClassicTemplate personal={personal} experience={experience} education={education} projects={projects} skills={skills} />
              }
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}