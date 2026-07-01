/* ResolvrPro LMS Engine — rendering, tabs, lightbox, interactions */
/* This file reads from DATA (js/data.js). Avoid editing unless changing behavior/features. */

// ===== Fallback: SESSION_DETAILS (optional rich content per session) =====
// If data.js doesn't define SESSION_DETAILS, create an empty fallback so openSession doesn't crash.
if (typeof SESSION_DETAILS === 'undefined') { window.SESSION_DETAILS = {}; }

// ===== showLevel: scroll to curriculum and switch to the given level =====
function showLevel(slug) {
  // Switch the LMS to this level
  if (window._lmsSetLevel) window._lmsSetLevel(slug);
  // Scroll to curriculum section
  var el = document.getElementById('curriculum');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== render Levels =====
const levelsGrid = document.getElementById('levels-grid');
if (levelsGrid) {
  DATA.levels.forEach((lvl, i) => {
    levelsGrid.insertAdjacentHTML('beforeend', `
      <div class="bg-white nb-border nb-shadow nb-press flex flex-col" data-slug="${lvl.slug}">
        <div class="p-6 border-b-[3px] border-black" style="background:${lvl.color}">
          <div class="text-xs font-extrabold uppercase tracking-widest text-white/90">Level ${i+1}</div>
          <h3 class="font-heading font-black text-3xl text-white mt-1">${lvl.name}</h3>
          <div class="font-bold text-white/90 text-sm mt-1">${lvl.grades}</div>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="font-extrabold">${lvl.tagline}</div>
          <p class="text-sm text-[#4B5563] mt-1">${lvl.promise}</p>
          <div class="mt-4 pt-3 border-t-[3px] border-dashed border-black/30">
            <div class="text-[10px] font-extrabold uppercase tracking-widest text-[#4B5563]">Annual Project</div>
            <div class="font-bold text-sm mt-1">${lvl.annual_project}</div>
          </div>
          <button class="mt-5 bg-black text-white font-extrabold py-3 px-4 nb-border nb-shadow-sm inline-flex items-center justify-between gap-2" onclick="showLevel('${lvl.slug}')">See all 40 sessions <span>→</span></button>
        </div>
      </div>`);
  });
}

// ===== render Skills =====
const skillsGrid = document.getElementById('skills-grid');
if (skillsGrid) {
  SKILLS.forEach((s,i)=>{
    skillsGrid.insertAdjacentHTML('beforeend', `
    <div class="p-7 nb-border nb-shadow nb-press flex flex-col" style="background:${s[1]}">
      <div class="flex items-center justify-between"><div class="bg-white nb-border w-12 h-12 grid place-items-center font-heading font-black">${String(i+1).padStart(2,'0')}</div></div>
      <h3 class="mt-5 font-heading font-black text-3xl">${s[0]}</h3>
      <p class="mt-1 font-medium">${s[2]}</p>
    </div>`);
  });
}

// ===== render Sponsor =====
const sponsorGrid = document.getElementById('sponsor-grid');
if (sponsorGrid) {
  SPONSOR.forEach(m=>{
    const waMsg = `🎓 *ResolvrPro – Sponsorship Inquiry*\n\n📋 Model: *${m.title}*\n\nHi! I'd like to know more about this option. Please share details, pricing and next steps.\n\nThanks! 🙏`;
    sponsorGrid.insertAdjacentHTML('beforeend', `
    <div class="bg-white nb-border nb-shadow flex flex-col">
      <div class="p-6 border-b-[3px] border-black" style="background:${m.color}">
        <h3 class="font-heading font-black text-2xl text-white leading-tight">${m.title}</h3>
        <p class="text-white/90 text-sm mt-2">${m.pitch}</p>
      </div>
      <div class="p-5 flex-1 flex flex-col">
        <div class="space-y-2">
          ${m.tiers.map(t=>`<div class="flex items-center justify-between gap-3 bg-[#FAFAFA] nb-border p-3"><div><div class="font-extrabold text-sm">${t[0]}</div><div class="text-xs text-[#4B5563]">${t[1]}</div></div><div class="font-heading font-black text-base text-right whitespace-nowrap">${t[2]}</div></div>`).join('')}
        </div>
        <ul class="mt-4 space-y-1.5 text-sm flex-1">
          ${m.inc.map(x=>`<li class="flex items-start gap-2"><span class="mt-2 w-2 h-2" style="background:${m.color}"></span><span class="font-semibold">${x}</span></li>`).join('')}
        </ul>
        <a href="${waLink(waMsg)}" target="_blank" rel="noopener" class="mt-5 btn-wa font-extrabold py-3 px-4 nb-border nb-shadow-sm inline-flex items-center justify-between">💬 Get in touch on WhatsApp <span>→</span></a>
      </div>
    </div>`);
  });
}

// ===== Modal state =====
let modalState = {slug:null, num:null};

function openSession(slug, num){
  modalState = {slug, num};
  const lvl = DATA.levels.find(l=>l.slug===slug);
  const s = DATA.sessions[slug][num-1];
  const total = DATA.sessions[slug].length;
  const details = SESSION_DETAILS[slug]?.[num];
  
  document.getElementById('modal-head').innerHTML = `
    <div class="text-[10px] font-extrabold uppercase tracking-widest text-[#4B5563]">Session ${num} of ${total} · ${lvl.name} · ${lvl.grades}</div>
    <h3 class="mt-2 font-heading font-black text-2xl md:text-3xl leading-tight">${esc(s.title)}</h3>
    <p class="mt-2 text-[#4B5563]">${esc(s.objective)}</p>`;
  document.getElementById('modal-head').style.background = lvl.color+'22';
  
  // Build tabs
  let tabsHtml = `<div class="session-tabs">
    <button class="session-tab active" onclick="switchTab('theory')">📚 Theory</button>
    <button class="session-tab" onclick="switchTab('videos')">🎬 Videos</button>
    <button class="session-tab" onclick="switchTab('practice')">🛠 Practice</button>
    <button class="session-tab" onclick="switchTab('tools')">🔧 Tools</button>
    <button class="session-tab" onclick="switchTab('homework')">📝 Homework</button>
    ${s.ai_prompt ? `<button class="session-tab" onclick="switchTab('ai')">✦ AI Prompt</button>` : ''}
  </div>`;
  
  // Build tab contents
  let theoryContent = '';
  let videosContent = '';
  let practiceContent = '';
  let toolsContent = '';
  let homeworkContent = '';
  let aiContent = '';
  
  if (details) {
    // Theory tab
    theoryContent = `<div class="theory-section">${details.theory}</div>`;
    
    // Videos tab
    const sessionFolder = `videos/${slug}/session-${String(num).padStart(2,'0')}`;
    videosContent = `
      <div class="mb-4">
        <div class="bg-[#FFD166]/30 nb-border p-4 mb-4">
          <div class="font-heading font-black text-sm uppercase tracking-widest text-[#FF6B6B]">Session ${num} Video Library</div>
          <p class="text-sm mt-1 text-[#4B5563]">Watch curated videos for this session. Each video is stored in the structured folder for easy access.</p>
          <div class="mt-2 text-xs font-mono bg-[#1d1d1d] text-white/80 px-3 py-2 nb-border">📁 ${sessionFolder}/</div>
        </div>
        <div id="video-gallery-${slug}-${num}" class="video-gallery">
          <div class="video-empty-state">
            <h4>📂 Video Folder Ready</h4>
            <p>Place your session videos in the folder below. Supported formats: MP4, WebM, or embed YouTube/Vimeo links.</p>
            <div class="folder-path">${sessionFolder}/</div>
            <div class="mt-4 text-xs text-[#4B5563]">
              <b>Folder structure:</b> videos/${slug}/session-${String(num).padStart(2,'0')}/<br/>
              <b>Expected files:</b> video-1.mp4, video-2.mp4, video-3.mp4, etc.<br/>
              <b>Or create a</b> <code class="bg-[#f3f4f6] nb-border px-1">videos.json</code> <b>file</b> in this folder with video metadata for rich gallery display.
            </div>
          </div>
        </div>
      </div>`;
    
    // Practice tab
    practiceContent = details.practice.map((p, i) => `
      <div class="practice-step">
        <div class="flex items-start">
          <div class="practice-step-num">${i+1}</div>
          <div class="flex-1">
            <div class="font-heading font-black text-lg mb-2">${esc(p.step)}</div>
            <div class="mb-3"><strong>Instructions:</strong> ${esc(p.instruction)}</div>
            <div class="example-box">
              <strong>Example:</strong>
              <div style="white-space:pre-wrap;font-size:14px;line-height:1.6">${esc(p.example)}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    // Tools tab
    toolsContent = details.tools.map(t => `
      <div class="tool-card">
        <h5>${esc(t.name)}</h5>
        <p class="text-sm mb-2"><strong>What it is:</strong> ${esc(t.description)}</p>
        <p class="text-sm"><strong>How to use it:</strong> ${t.howToUse}</p>
      </div>
    `).join('');
    
    // Homework tab
    homeworkContent = details.homework.map((h, i) => `
      <div class="homework-item">
        <div class="font-heading font-black text-base mb-2">Homework ${i+1}</div>
        <div class="mb-3">${esc(h.question)}</div>
        <button class="toggle-solution" onclick="toggleSolution(${i})">Show Solution</button>
        <div class="homework-solution" id="solution-${i}">
          <div class="text-sm"><strong>Solution / Example Answer:</strong></div>
          <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;margin-top:8px">${esc(h.solution)}</div>
        </div>
      </div>
    `).join('');
    
    // AI prompt tab
    if (s.ai_prompt) {
      aiContent = `
        <div class="bg-black text-white nb-border p-4">
          <div class="font-heading font-black text-sm uppercase tracking-widest text-[#D4FF33]">✦ AI Practice Prompt</div>
          <p class="mt-1 text-xs text-white/70">Edit if needed, then click Copy and paste into ChatGPT / Claude / Gemini.</p>
          <textarea id="prompt-box" rows="5" class="mt-3 dark-input font-mono text-xs">${esc(s.ai_prompt)}</textarea>
          <div class="mt-3 flex flex-wrap gap-2">
            <button onclick="copyPrompt()" class="bg-[#D4FF33] text-black font-extrabold py-2 px-4 nb-border nb-shadow-sm nb-press">Copy prompt</button>
            <a href="https://chatgpt.com" target="_blank" rel="noopener" class="bg-white text-black font-extrabold py-2 px-4 nb-border nb-shadow-sm nb-press">Open ChatGPT ↗</a>
            <a href="https://gemini.google.com" target="_blank" rel="noopener" class="bg-white text-black font-extrabold py-2 px-4 nb-border nb-shadow-sm nb-press">Open Gemini ↗</a>
          </div>
        </div>`;
    }
  } else {
    // Fallback for sessions without detailed content
    const sessionFolder = `videos/${slug}/session-${String(num).padStart(2,'0')}`;
    theoryContent = `<div class="theory-section">
      <h4>Session Overview</h4>
      <p>${esc(s.objective)}</p>
      ${s.concepts?.length ? `<h4>Key Concepts</h4><ul>${s.concepts.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>` : ''}
      <h4>Real-World Example</h4>
      <p>${esc(s.example)}</p>
    </div>`;
    
    // Videos tab fallback
    videosContent = `
      <div class="mb-4">
        <div class="bg-[#FFD166]/30 nb-border p-4 mb-4">
          <div class="font-heading font-black text-sm uppercase tracking-widest text-[#FF6B6B]">Session ${num} Video Library</div>
          <p class="text-sm mt-1 text-[#4B5563]">Video content for this session will appear here once added to the folder.</p>
          <div class="mt-2 text-xs font-mono bg-[#1d1d1d] text-white/80 px-3 py-2 nb-border">📁 ${sessionFolder}/</div>
        </div>
        <div id="video-gallery-${slug}-${num}" class="video-gallery">
          <div class="video-empty-state">
            <h4>📂 Video Folder Ready</h4>
            <p>Place your session videos in the folder structure below. The gallery will automatically display them.</p>
            <div class="folder-path">${sessionFolder}/</div>
          </div>
        </div>
      </div>`;
    
    practiceContent = `<div class="practice-step">
      <div class="font-heading font-black text-lg mb-2">Practice Task</div>
      <div class="mb-3">${esc(s.practice)}</div>
      ${s.tools?.length ? `<div class="example-box"><strong>Tools You'll Need:</strong><div>${s.tools.map(t=>esc(t)).join(', ')}</div></div>` : ''}
    </div>`;
    
    toolsContent = s.tools?.length ? s.tools.map(t => `
      <div class="tool-card">
        <h5>${esc(t)}</h5>
        <p class="text-sm">Use this tool to complete the practice task. Ask your tutor for help if needed.</p>
      </div>
    `).join('') : '<p class="text-sm text-[#4B5563]">No specific tools required for this session.</p>';
    
    homeworkContent = `<div class="homework-item">
      <div class="font-heading font-black text-base mb-2">Homework</div>
      <div class="mb-3">${esc(s.practice)}</div>
      <button class="toggle-solution" onclick="toggleSolution(0)">Show Example Solution</button>
      <div class="homework-solution" id="solution-0">
        <div class="text-sm"><strong>Example Approach:</strong></div>
        <div style="font-size:14px;line-height:1.6;margin-top:8px">Complete the practice task step by step. Document your process, challenges, and what you learned. Share your work with your tutor for feedback.</div>
      </div>
    </div>`;
    
    if (s.ai_prompt) {
      aiContent = `
        <div class="bg-black text-white nb-border p-4">
          <div class="font-heading font-black text-sm uppercase tracking-widest text-[#D4FF33]">✦ AI Practice Prompt</div>
          <p class="mt-1 text-xs text-white/70">Edit if needed, then click Copy and paste into ChatGPT / Claude / Gemini.</p>
          <textarea id="prompt-box" rows="5" class="mt-3 dark-input font-mono text-xs">${esc(s.ai_prompt)}</textarea>
          <div class="mt-3 flex flex-wrap gap-2">
            <button onclick="copyPrompt()" class="bg-[#D4FF33] text-black font-extrabold py-2 px-4 nb-border nb-shadow-sm nb-press">Copy prompt</button>
            <a href="https://chatgpt.com" target="_blank" rel="noopener" class="bg-white text-black font-extrabold py-2 px-4 nb-border nb-shadow-sm nb-press">Open ChatGPT ↗</a>
            <a href="https://gemini.google.com" target="_blank" rel="noopener" class="bg-white text-black font-extrabold py-2 px-4 nb-border nb-shadow-sm nb-press">Open Gemini ↗</a>
          </div>
        </div>`;
    }
  }
  
  document.getElementById('modal-body').innerHTML = `
    ${tabsHtml}
    <div id="tab-theory" class="session-tab-content active">${theoryContent}</div>
    <div id="tab-videos" class="session-tab-content">${videosContent}</div>
    <div id="tab-practice" class="session-tab-content">${practiceContent}</div>
    <div id="tab-tools" class="session-tab-content">${toolsContent}</div>
    <div id="tab-homework" class="session-tab-content">${homeworkContent}</div>
    ${s.ai_prompt ? `<div id="tab-ai" class="session-tab-content">${aiContent}</div>` : ''}
    <div class="bg-[#25D366]/15 nb-border p-3 text-sm flex items-center justify-between flex-wrap gap-2 mt-6">
      <span>Need help with this session?</span>
      <a href="${waLink('🎓 *ResolvrPro – Session Help*\\n\\n📚 Session: '+s.title+' ('+lvl.name+' Level '+num+')\\n\\nHi! I need help with this session. Can you guide me?')}" target="_blank" class="btn-wa font-extrabold py-2 px-3 nb-border nb-shadow-sm nb-press">💬 Ask on WhatsApp</a>
    </div>`;
  
  document.getElementById('modal-prev').disabled = num===1;
  document.getElementById('modal-next').disabled = num===total;
  document.getElementById('modal-prev').style.opacity = num===1 ? .4 : 1;
  document.getElementById('modal-next').style.opacity = num===total ? .4 : 1;
  document.getElementById('modal').classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function switchTab(tabName) {
  document.querySelectorAll('.session-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.session-tab-content').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById('tab-' + tabName).classList.add('active');
}

function toggleSolution(index) {
  const solution = document.getElementById('solution-' + index);
  const button = event.currentTarget;
  if (solution.classList.contains('show')) {
    solution.classList.remove('show');
    button.textContent = 'Show Solution';
  } else {
    solution.classList.add('show');
    button.textContent = 'Hide Solution';
  }
}
function closeModal(){ document.getElementById('modal').classList.add('hidden'); document.body.classList.remove('modal-open'); }
function copyPrompt(){
  const box = document.getElementById('prompt-box');
  box.select(); document.execCommand('copy');
  const btn = event.currentTarget; const t = btn.textContent; btn.textContent = 'Copied ✓';
  setTimeout(()=>btn.textContent=t, 1500);
}
document.getElementById('modal-close').onclick = closeModal;
document.getElementById('modal-backdrop').onclick = closeModal;
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
document.getElementById('modal-prev').onclick = ()=>{ if(modalState.num>1) openSession(modalState.slug, modalState.num-1); };
document.getElementById('modal-next').onclick = ()=>{
  const total = DATA.sessions[modalState.slug].length;
  if(modalState.num<total) openSession(modalState.slug, modalState.num+1);
};

// ===== Mobile menu =====
document.getElementById('mobile-toggle').onclick = ()=>{
  document.getElementById('mobile-menu').classList.toggle('hidden');
};

// ===== WhatsApp CTAs =====
const TALK_MSG = `🎓 *ResolvrPro – Demo Request*\n\nHi! I'd like to book a 45-min demo for my school / family.\n\nPlease share available slots.\n\nThanks! 🙏`;

['nav-talk','m-nav-talk','hero-talk','footer-talk','fab-wa'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.href = waLink(TALK_MSG);
});

// ===== Booking form -> WhatsApp =====
document.getElementById('book-form').onsubmit = (e)=>{
  e.preventDefault();
  const f = new FormData(e.target);
  const lines = [
    '🎓 *ResolvrPro – Inquiry*',
    '',
    `🏫 *School / Org:* ${f.get('school')||'—'}`,
    `👤 *Name:* ${f.get('name')||'—'}`,
    `📧 *Email:* ${f.get('email')||'—'}`,
    `📞 *Phone:* ${f.get('phone')||'—'}`,
    `👨‍👩‍👧 *Learners:* ${f.get('learners')||'—'}`,
    `🎯 *Role:* ${f.get('role')||'—'}`,
    '',
    '💬 *Message:*',
    f.get('msg') || '(none)',
    '',
    '_Sent via resolvrpro.in_ 🚀'
  ].join('\n');
  window.open(waLink(lines), '_blank');
};

// ===== util =====
function esc(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s){ return esc(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
document.getElementById('year').textContent = new Date().getFullYear();

// ===================================================================
// ===== FIT TEST QUIZ =====
// ===================================================================
const FIT_QUESTIONS = [
  {
    q: "How comfortable are you with using a computer or smartphone for learning?",
    opts: [
      { text: "I can turn it on and open apps, but that's about it", score: 1 },
      { text: "I use it for schoolwork, browsing, and basic tasks", score: 2 },
      { text: "I'm comfortable with multiple tools — docs, sheets, editing apps", score: 3 },
      { text: "I can set up workflows, automate tasks, and troubleshoot issues", score: 4 }
    ]
  },
  {
    q: "Have you ever created any digital content (poster, video, website, presentation)?",
    opts: [
      { text: "No, I've never made anything digital from scratch", score: 1 },
      { text: "I've made simple presentations or posters for school", score: 2 },
      { text: "I've edited videos, designed social posts, or built basic websites", score: 3 },
      { text: "I've built full projects — websites, apps, campaigns, or portfolios", score: 4 }
    ]
  },
  {
    q: "How would you describe your experience with AI tools (ChatGPT, Gemini, etc.)?",
    opts: [
      { text: "I've heard of them but never used one", score: 1 },
      { text: "I've tried asking it simple questions or fun prompts", score: 2 },
      { text: "I use AI regularly for research, writing help, or learning", score: 3 },
      { text: "I write advanced prompts, use custom GPTs, and integrate AI into my workflow", score: 4 }
    ]
  },
  {
    q: "If you had to solve a problem you've never seen before, what would you do first?",
    opts: [
      { text: "Ask a teacher or parent for the answer", score: 1 },
      { text: "Google it and follow the first result", score: 2 },
      { text: "Research from multiple sources, compare, then try a solution", score: 3 },
      { text: "Break it down, prototype a solution, test it, and iterate", score: 4 }
    ]
  },
  {
    q: "How confident are you in presenting an idea to a group of people?",
    opts: [
      { text: "Very nervous — I avoid speaking in front of others", score: 1 },
      { text: "I can read from slides but struggle without notes", score: 2 },
      { text: "I can present clearly with some preparation", score: 3 },
      { text: "I'm comfortable pitching ideas, handling questions, and storytelling", score: 4 }
    ]
  },
  {
    q: "Can you work with data — like reading a chart, making a graph, or analysing numbers?",
    opts: [
      { text: "I find charts confusing and don't work with data", score: 1 },
      { text: "I can read basic bar charts and pie charts", score: 2 },
      { text: "I can create charts in Sheets/Excel and spot trends", score: 3 },
      { text: "I can analyse datasets, build dashboards, and derive business insights", score: 4 }
    ]
  },
  {
    q: "Have you ever worked on a team project where you had a specific role?",
    opts: [
      { text: "No, I mostly work alone on assignments", score: 1 },
      { text: "Yes, in school group projects — but the teacher usually assigned roles", score: 2 },
      { text: "Yes, I've collaborated on projects and taken ownership of my part", score: 3 },
      { text: "I've led teams, managed timelines, and coordinated deliverables", score: 4 }
    ]
  },
  {
    q: "How do you approach learning a completely new skill?",
    opts: [
      { text: "I need someone to teach me step-by-step", score: 1 },
      { text: "I watch tutorials and follow along", score: 2 },
      { text: "I experiment, learn by doing, and figure things out", score: 3 },
      { text: "I set goals, find mentors, build projects, and teach others", score: 4 }
    ]
  },
  {
    q: "Do you understand how the internet works — websites, domains, hosting?",
    opts: [
      { text: "I just use apps and websites, I don't know how they work", score: 1 },
      { text: "I know basics like browsers and URLs", score: 2 },
      { text: "I understand domains, hosting, and how content gets published online", score: 3 },
      { text: "I've built and deployed websites, understand APIs, and can set up integrations", score: 4 }
    ]
  },
  {
    q: "How do you feel about entrepreneurship and business ideas?",
    opts: [
      { text: "I've never thought about starting something", score: 1 },
      { text: "I find it interesting but don't know where to start", score: 2 },
      { text: "I've brainstormed ideas and understand basic business concepts", score: 3 },
      { text: "I've built a business plan, validated ideas, or launched something real", score: 4 }
    ]
  },
  {
    q: "How well can you write clearly and persuasively — in an email, essay, or message?",
    opts: [
      { text: "I struggle to put my thoughts into words", score: 1 },
      { text: "I can write okay for school assignments", score: 2 },
      { text: "I write clearly and can adapt my tone for different audiences", score: 3 },
      { text: "I can craft compelling pitches, proposals, and content that gets results", score: 4 }
    ]
  },
  {
    q: "Have you ever used design tools like Canva, Figma, or similar?",
    opts: [
      { text: "Never used any design tool", score: 1 },
      { text: "I've used Canva with templates to make simple designs", score: 2 },
      { text: "I'm comfortable creating original designs, brand kits, and layouts", score: 3 },
      { text: "I can do advanced UI/UX design, wireframes, and prototypes", score: 4 }
    ]
  },
  {
    q: "How do you handle feedback or criticism on your work?",
    opts: [
      { text: "It makes me uncomfortable — I take it personally", score: 1 },
      { text: "I listen but find it hard to act on it", score: 2 },
      { text: "I appreciate feedback and use it to improve my work", score: 3 },
      { text: "I actively seek feedback, create iteration loops, and thrive on it", score: 4 }
    ]
  },
  {
    q: "If you could build anything for your school or community, what would excite you most?",
    opts: [
      { text: "A fun digital story or poster to share with friends", score: 1 },
      { text: "A social media campaign or brand for a local cause", score: 2 },
      { text: "A website or app that solves a real problem", score: 3 },
      { text: "An AI-powered solution or startup that creates real impact", score: 4 }
    ]
  },
  {
    q: "Where do you see yourself after completing this program?",
    opts: [
      { text: "I want to build confidence and explore what's possible", score: 1 },
      { text: "I want to create a strong portfolio and learn to communicate well", score: 2 },
      { text: "I want to build real projects and solve actual problems", score: 3 },
      { text: "I want to lead, innovate, and be ready for college or entrepreneurship", score: 4 }
    ]
  }
];

const LEVEL_RESULTS = {
  explorer: {
    name: "Explorer",
    level: 1,
    color: "#10B981",
    tagline: "Build Curiosity. Build Confidence.",
    description: "You're at the start of an exciting journey! The Explorer level will build your digital foundation — from using computers confidently to creating your first digital story and personal website. You'll discover skills you didn't know you had.",
    promise: "By the end: You'll create a digital story, build a personal website, and present with confidence."
  },
  creator: {
    name: "Creator",
    level: 2,
    color: "#3B82F6",
    tagline: "Create. Design. Communicate.",
    description: "You've got solid basics and a creative spark! The Creator level will turn your ideas into real digital content — brand design, video editing, social media strategy, and a complete brand website for a real business.",
    promise: "By the end: You'll have designed a full brand, built a business website, and run a content campaign."
  },
  builder: {
    name: "Builder",
    level: 3,
    color: "#8B5CF6",
    tagline: "Build. Innovate. Solve.",
    description: "You're ready to go beyond content into real solutions. The Builder level will equip you with advanced AI tools, web development, marketing funnels, automation, and the skills to ship complete digital products.",
    promise: "By the end: You'll have built a multi-page website, run marketing campaigns, and shipped a digital solution."
  },
  innovator: {
    name: "Innovator",
    level: 4,
    color: "#F59E0B",
    tagline: "Innovate. Lead. Transform.",
    description: "You're operating at an advanced level! The Innovator level is where you'll build AI-powered apps, create investor pitch decks, master business strategy, and deliver a capstone project that rivals college-level work.",
    promise: "By the end: You'll have built an AI-powered app, created an investor deck, and shipped a capstone project."
  }
};

let quizState = { current: 0, answers: [] };

function openFitTest() {
  quizState = { current: 0, answers: [] };
  renderQuizQuestion();
  document.getElementById('fit-test-modal').classList.remove('hidden');
  document.body.classList.add('modal-open');
  // Scroll quiz to top
  document.getElementById('fit-test-modal').scrollTop = 0;
}

function closeFitTest() {
  document.getElementById('fit-test-modal').classList.add('hidden');
  document.body.classList.remove('modal-open');
}

function renderQuizQuestion() {
  const idx = quizState.current;
  const total = FIT_QUESTIONS.length;
  const q = FIT_QUESTIONS[idx];
  const pct = ((idx) / total) * 100;

  document.getElementById('quiz-inner').innerHTML = `
    <div class="p-5 border-b-[3px] border-black flex items-center justify-between">
      <div>
        <div class="font-heading font-black text-lg">Fit Test</div>
        <div class="text-xs font-bold text-[#4B5563]">Find your level · 15 questions</div>
      </div>
      <button onclick="closeFitTest()" class="bg-black text-white nb-border py-2 px-4 font-extrabold nb-press">Close ✕</button>
    </div>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    <div class="p-6 md:p-8">
      <div class="text-xs font-extrabold uppercase tracking-widest text-[#4B5563] mb-3">Question ${idx + 1} of ${total}</div>
      <h3 class="font-heading font-black text-2xl md:text-3xl leading-tight mb-6">${esc(q.q)}</h3>
      <div class="space-y-3">
        ${q.opts.map((opt, oi) => `
          <button class="quiz-option w-full text-left bg-white nb-border p-4 font-semibold text-sm md:text-base flex items-start gap-3" onclick="selectAnswer(${oi}, ${opt.score})">
            <div class="w-8 h-8 nb-border grid place-items-center font-heading font-black text-sm shrink-0 mt-0.5">${String.fromCharCode(65 + oi)}</div>
            <span>${esc(opt.text)}</span>
          </button>
        `).join('')}
      </div>
      <div class="mt-6 flex items-center justify-between">
        <button onclick="quizPrev()" class="font-extrabold py-2 px-4 nb-border nb-shadow-sm nb-press ${idx === 0 ? 'opacity-30 pointer-events-none' : ''}" ${idx === 0 ? 'disabled' : ''}>← Back</button>
        <div class="flex gap-1.5">${Array.from({length: total}, (_, i) => `<div class="w-3 h-3 nb-border ${i < idx ? 'bg-black' : i === idx ? 'bg-[#FF6B6B]' : 'bg-white'}"></div>`).join('')}</div>
      </div>
    </div>
  `;
}

function selectAnswer(optIdx, score) {
  quizState.answers[quizState.current] = { optIdx, score };
  if (quizState.current < FIT_QUESTIONS.length - 1) {
    quizState.current++;
    renderQuizQuestion();
    document.getElementById('fit-test-modal').scrollTop = 0;
  } else {
    showQuizResult();
  }
}

function quizPrev() {
  if (quizState.current > 0) {
    quizState.current--;
    renderQuizQuestion();
    document.getElementById('fit-test-modal').scrollTop = 0;
  }
}

function showQuizResult() {
  const totalScore = quizState.answers.reduce((sum, a) => sum + (a ? a.score : 0), 0);
  const maxScore = FIT_QUESTIONS.length * 4;
  const pct = Math.round((totalScore / maxScore) * 100);

  let slug;
  if (totalScore <= 22) slug = 'explorer';
  else if (totalScore <= 37) slug = 'creator';
  else if (totalScore <= 50) slug = 'builder';
  else slug = 'innovator';

  const result = LEVEL_RESULTS[slug];
  const levelNum = result.level;

  const waResultMsg = `🎓 *My Fit Test Result*\n\n` +
    `📊 Score: ${totalScore}/${maxScore} (${pct}%)\n` +
    `🏆 Level ${levelNum} – ${result.name}\n` +
    `📋 "${result.tagline}"\n\n` +
    `Hi ResolvrPro team! I just completed the Fit Test. I'd like to learn more about the ${result.name} level and next steps.\n\nThanks! 🙏`;

  document.getElementById('quiz-inner').innerHTML = `
    <div class="p-5 border-b-[3px] border-black flex items-center justify-between">
      <div>
        <div class="font-heading font-black text-lg">Fit Test Complete!</div>
        <div class="text-xs font-bold text-[#4B5563]">Your result is ready</div>
      </div>
      <button onclick="closeFitTest()" class="bg-black text-white nb-border py-2 px-4 font-extrabold nb-press">Close ✕</button>
    </div>
    <div class="p-6 md:p-8">
      <div class="quiz-result-badge text-center mb-8">
        <div class="inline-block nb-border nb-shadow-lg p-1 quiz-pulse" style="background:${result.color}">
          <div class="bg-white nb-border p-6 md:p-8">
            <div class="text-xs font-extrabold uppercase tracking-widest text-[#4B5563]">Your Fit Test Result</div>
            <div class="font-heading font-black text-5xl md:text-6xl mt-2" style="color:${result.color}">Level ${levelNum}</div>
            <div class="font-heading font-black text-3xl md:text-4xl mt-1">${result.name}</div>
            <div class="font-accent text-2xl mt-1" style="color:${result.color};transform:rotate(-2deg);display:inline-block">${result.tagline}</div>
            <div class="mt-4 text-sm font-bold text-[#4B5563]">Score: ${totalScore} / ${maxScore} (${pct}%)</div>
          </div>
        </div>
      </div>

      <div class="bg-white nb-border nb-shadow p-5 mb-5">
        <p class="text-base leading-relaxed">${result.description}</p>
        <div class="mt-4 bg-[#D4FF33]/40 nb-border p-3">
          <div class="font-extrabold text-sm">🎯 ${result.promise}</div>
        </div>
      </div>

      <div class="bg-white nb-border nb-shadow-sm p-5 mb-5">
        <div class="font-heading font-black text-sm uppercase tracking-widest mb-3">All 4 Levels</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          ${['explorer','creator','builder','innovator'].map(s => {
            const r = LEVEL_RESULTS[s];
            const isActive = s === slug;
            return `<div class="nb-border p-2 text-center ${isActive ? 'quiz-pulse' : 'opacity-60'}" style="background:${isActive ? r.color : '#fff'};color:${isActive ? '#fff' : '#111'}">
              <div class="font-heading font-black text-sm">L${r.level}</div>
              <div class="font-bold text-xs">${r.name}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <a href="${waLink(waResultMsg)}" target="_blank" rel="noopener" class="btn-wa font-extrabold py-4 px-6 nb-border nb-shadow nb-press text-center flex items-center justify-center gap-2">
          💬 Send My Result to ResolvrPro
        </a>
        <button onclick="retakeFitTest()" class="bg-white font-extrabold py-4 px-6 nb-border nb-shadow-sm nb-press text-center">
          Retake Test
        </button>
      </div>

      <div class="mt-4 text-center text-xs text-[#4B5563]">
        Your result will be shared with the ResolvrPro support team via WhatsApp.
      </div>
    </div>
  `;
  document.getElementById('fit-test-modal').scrollTop = 0;
}

function retakeFitTest() {
  quizState = { current: 0, answers: [] };
  renderQuizQuestion();
  document.getElementById('fit-test-modal').scrollTop = 0;
}

// Close quiz on backdrop click
document.getElementById('fit-test-modal').addEventListener('click', function(e) {
  if (e.target === this) closeFitTest();
});

// ===================================================================
// ===== LMS MODULE =====
// ===================================================================
(function(){
  const LMS_KEY = 'resolvrpro_lms_progress';
  function getProgress(){ try{ return JSON.parse(localStorage.getItem(LMS_KEY))||{}; }catch(e){ return{}; } }
  function setProgress(slug,num,val){ const p=getProgress(); const k=slug+'_'+num; if(val) p[k]=true; else delete p[k]; localStorage.setItem(LMS_KEY,JSON.stringify(p)); renderLMS(); }
  function isDone(slug,num){ return !!getProgress()[slug+'_'+num]; }
  function countDone(slug){ const p=getProgress(); let c=0; Object.keys(p).forEach(k=>{ if(k.startsWith(slug+'_')&&p[k]) c++; }); return c; }

  let lmsActiveLevel = 'explorer';

  function renderLMS(){
    // Stats
    const statsEl = document.getElementById('lms-stats');
    if(!statsEl) return;
    let totalDone = 0;
    DATA.levels.forEach(l=>{ totalDone += countDone(l.slug); });
    const pct = Math.round(totalDone/160*100);
    statsEl.innerHTML = `
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl text-black">${totalDone}</div><div class="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Sessions Done</div></div>
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl text-black">${160-totalDone}</div><div class="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Remaining</div></div>
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl text-black">${pct}%</div><div class="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Complete</div></div>
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl text-black">160</div><div class="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Total Sessions</div></div>`;

    // Level buttons
    const btnsEl = document.getElementById('lms-level-btns');
    btnsEl.innerHTML = DATA.levels.map(l=>{
      const c = countDone(l.slug);
      const isActive = l.slug === lmsActiveLevel;
      return `<button onclick="window._lmsSetLevel('${l.slug}')" class="font-extrabold py-3 px-5 nb-border nb-shadow-sm nb-press" style="background:${isActive?l.color:'#fff'};color:${isActive?'#fff':'#111'}">${l.name} <span class="opacity-70 font-normal text-xs">· ${c}/40</span></button>`;
    }).join('');

    // Sessions grid
    const sessEl = document.getElementById('lms-sessions');
    const lvl = DATA.levels.find(l=>l.slug===lmsActiveLevel);
    const sessions = DATA.sessions[lmsActiveLevel];
    const groups = [0,1,2,3].map(i=>sessions.slice(i*10,(i+1)*10));
    const lvlDone = countDone(lmsActiveLevel);
    const lvlPct = Math.round(lvlDone/40*100);

    sessEl.innerHTML = `
      <div class="fade-in">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 class="font-heading font-black text-2xl md:text-3xl">${lvl.name} Level</h3>
            <p class="text-sm text-[#4B5563]">${lvl.tagline} · ${lvl.grades}</p>
          </div>
          <div class="text-right">
            <div class="font-heading font-black text-2xl" style="color:${lvl.color}">${lvlDone}/40</div>
            <div class="text-xs text-[#4B5563]">${lvlPct}% complete</div>
          </div>
        </div>
        <div class="lms-progress-bar mb-6"><div class="lms-progress-fill" style="width:${lvlPct}%;background:${lvl.color}"></div></div>
        <div class="bg-white nb-border nb-shadow-sm p-4 mb-6">
          <div class="text-[10px] font-extrabold uppercase tracking-widest text-[#4B5563]">Annual Project</div>
          <div class="font-bold mt-1 text-black">${esc(lvl.annual_project)}</div>
        </div>
        ${groups.map((g,gi)=>`
          <div class="mb-8">
            <div class="inline-flex items-center gap-2 nb-border px-4 py-2 nb-shadow-sm font-extrabold text-xs tracking-widest uppercase text-white mb-4" style="background:${lvl.color}">Sessions ${gi*10+1} – ${gi*10+g.length}</div>
            <div class="lms-detail-grid">
              ${g.map(s=>{
                const done = isDone(lmsActiveLevel, s.number);
                return `<div class="lms-session-card bg-white text-black nb-border p-4 flex flex-col ${done?'lms-done':''}" onclick="window._lmsOpenSession('${lmsActiveLevel}',${s.number})">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 nb-border grid place-items-center font-heading font-black text-sm text-white" style="background:${lvl.color}">${s.number}</div>
                    <span class="lms-badge" style="background:${done?'#10B981':'#f3f4f6'};color:${done?'#fff':'#666'}">${done?'Done':'Pending'}</span>
                  </div>
                  <div class="font-heading font-black text-sm leading-tight mt-2">${esc(s.title)}</div>
                  <div class="text-[11px] text-[#4B5563] mt-1 leading-snug">${esc(s.objective).slice(0,80)}…</div>
                  ${s.concepts?.length?`<div class="mt-2 flex flex-wrap gap-1">${s.concepts.slice(0,2).map(c=>`<span class="text-[9px] font-bold bg-[#f3f4f6] nb-border px-1.5 py-0.5">${esc(c)}</span>`).join('')}</div>`:''}
                </div>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  // Expose level setter
  window._lmsSetLevel = function(slug){
    lmsActiveLevel = slug;
    renderLMS();
  };

  // Open session detail — uses existing modal
  window._lmsOpenSession = function(slug, num){
    openSession(slug, num);
    // Inject "Mark Complete" toggle into the modal header
    setTimeout(()=>{
      const head = document.getElementById('modal-head');
      if(!head) return;
      // Check if our button already exists
      if(document.getElementById('lms-complete-btn')) return;
      const done = isDone(slug, num);
      const btnHtml = `<div class="mt-3 flex items-center gap-3">
        <button id="lms-complete-btn" onclick="window._lmsToggle('${slug}',${num})" class="font-extrabold text-xs py-2 px-4 nb-border nb-shadow-sm nb-press" style="background:${done?'#10B981':'#fff'};color:${done?'#fff':'#111'}">${done?'✓ Completed':'Mark as Complete'}</button>
        <span class="text-xs text-[#4B5563]">Track your progress in the LMS Dashboard</span>
      </div>`;
      head.insertAdjacentHTML('beforeend', btnHtml);
    }, 100);
  };

  window._lmsToggle = function(slug, num){
    const now = isDone(slug, num);
    setProgress(slug, num, !now);
    const btn = document.getElementById('lms-complete-btn');
    if(btn){
      if(!now){
        btn.textContent = '✓ Completed';
        btn.style.background = '#10B981';
        btn.style.color = '#fff';
      } else {
        btn.textContent = 'Mark as Complete';
        btn.style.background = '#fff';
        btn.style.color = '#111';
      }
    }
  };

  // Initial render
  renderLMS();
})();

// ===================================================================
// ===== MODAL MINIMIZE/MAXIMIZE/CLOSE CONTROLS =====
// ===================================================================
(function(){
  const modalCard = document.getElementById('modal-card');
  const minimizeBtn = document.getElementById('modal-minimize');
  const maximizeBtn = document.getElementById('modal-maximize');
  const closeXBtn = document.getElementById('modal-close-x');
  const titleText = document.getElementById('modal-title-text');
  
  if (!modalCard || !minimizeBtn || !maximizeBtn || !closeXBtn) return;
  
  let isMaximized = false;
  let isMinimized = false;
  
  // Minimize
  minimizeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isMinimized) {
      // Restore
      modalCard.classList.remove('modal-minimized');
      isMinimized = false;
    } else {
      modalCard.classList.add('modal-minimized');
      isMinimized = true;
      if (isMaximized) {
        modalCard.classList.remove('modal-maximized');
        isMaximized = false;
      }
    }
  });
  
  // Maximize
  maximizeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isMaximized) {
      // Restore to normal
      modalCard.classList.remove('modal-maximized');
      isMaximized = false;
    } else {
      modalCard.classList.add('modal-maximized');
      isMaximized = true;
      if (isMinimized) {
        modalCard.classList.remove('modal-minimized');
        isMinimized = false;
      }
    }
  });
  
  // Close (X button)
  closeXBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeModal();
  });
  
  // Update title when modal opens
  const originalOpen = window.openSession;
  window.openSession = function(slug, num) {
    originalOpen(slug, num);
    // Update title bar
    setTimeout(() => {
      const s = DATA.sessions[slug][num-1];
      const lvl = DATA.levels.find(l=>l.slug===slug);
      if (titleText && s && lvl) {
        titleText.textContent = `${lvl.name} · Session ${num}: ${s.title}`;
      }
      // Reset modal state
      modalCard.classList.remove('modal-maximized', 'modal-minimized');
      isMaximized = false;
      isMinimized = false;
    }, 50);
  };
})();

// ===================================================================
// ===== VIDEO GALLERY & PLAYER =====
// ===================================================================
(function(){
  // Load videos.json for a session and render gallery
  window.loadSessionVideos = function(slug, num) {
    const folder = `videos/${slug}/session-${String(num).padStart(2,'0')}`;
    const galleryEl = document.getElementById(`video-gallery-${slug}-${num}`);
    if (!galleryEl) return;
    
    fetch(`${folder}/videos.json`)
      .then(r => r.json())
      .then(data => {
        if (!data.videos || data.videos.length === 0) {
          galleryEl.innerHTML = `<div class="video-empty-state">
            <h4>📂 No videos yet</h4>
            <p>Add video files to <code>${folder}/</code> and update videos.json</p>
          </div>`;
          return;
        }
        galleryEl.innerHTML = data.videos.map((v, i) => `
          <div class="video-card" onclick="openVideoPlayer('${escAttr(folder+'/'+v.file)}', '${escAttr(v.title)}', '${escAttr(v.description)}')">
            <div class="video-card-thumb">
              ${v.thumbnail ? `<img src="${folder}/${v.thumbnail}" alt="${escAttr(v.title)}">` : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1d1d1d 0%,#333 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-size:48px">🎬</div>`}
              <div class="play-icon"></div>
            </div>
            <div class="video-card-info">
              <h5>${esc(v.title)}</h5>
              <p>${esc(v.description)}</p>
              <div>
                ${v.duration ? `<span class="video-duration">${esc(v.duration)}</span>` : ''}
                ${v.type ? `<span class="video-type">${esc(v.type)}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('');
      })
      .catch(err => {
        // videos.json not found or invalid — show placeholder
      });
  };
  
  // Open video player modal
  window.openVideoPlayer = function(src, title, desc) {
    // Remove existing player if any
    const existing = document.getElementById('video-player-overlay');
    if (existing) existing.remove();
    
    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
    const isVimeo = src.includes('vimeo.com');
    const isEmbed = isYouTube || isVimeo;
    
    let playerHTML = '';
    if (isEmbed) {
      playerHTML = `<iframe src="${src}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
    } else {
      playerHTML = `<video controls autoplay><source src="${src}" type="video/mp4">Your browser does not support video.</video>`;
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'video-player-overlay';
    overlay.className = 'video-player-overlay';
    overlay.innerHTML = `
      <div class="video-player-container" id="video-player-container">
        <div class="video-player-header">
          <h4>${esc(title)}</h4>
          <button class="close-video" onclick="closeVideoPlayer()">✕</button>
        </div>
        <div class="video-player-frame" id="video-player-frame">
          ${playerHTML}
        </div>
        <div class="video-resize-btns">
          <button onclick="resizeVideoPlayer('normal')" class="active-resize" id="resize-normal">Normal</button>
          <button onclick="resizeVideoPlayer('large')" id="resize-large">Large</button>
          <button onclick="resizeVideoPlayer('fullscreen')" id="resize-fullscreen">Fullscreen</button>
          <div style="flex:1"></div>
          <span style="color:#fff;font-size:12px;padding:6px">${esc(desc || '')}</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Close on backdrop click
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeVideoPlayer();
    });
    
    // Close on Escape
    document.addEventListener('keydown', handleVideoEsc);
  };
  
  // Close video player
  window.closeVideoPlayer = function() {
    const overlay = document.getElementById('video-player-overlay');
    if (overlay) {
      // Stop video playback
      const video = overlay.querySelector('video');
      if (video) video.pause();
      const iframe = overlay.querySelector('iframe');
      if (iframe) iframe.src = '';
      overlay.remove();
    }
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleVideoEsc);
  };
  
  function handleVideoEsc(e) {
    if (e.key === 'Escape') closeVideoPlayer();
  }
  
  // Resize video player
  window.resizeVideoPlayer = function(size) {
    const container = document.getElementById('video-player-container');
    if (!container) return;
    
    // Reset all buttons
    document.querySelectorAll('.video-resize-btns button').forEach(b => b.classList.remove('active-resize'));
    
    if (size === 'normal') {
      container.style.maxWidth = '900px';
      container.style.width = '100%';
      container.style.height = 'auto';
      document.getElementById('resize-normal').classList.add('active-resize');
    } else if (size === 'large') {
      container.style.maxWidth = '1200px';
      container.style.width = '100%';
      container.style.height = 'auto';
      document.getElementById('resize-large').classList.add('active-resize');
    } else if (size === 'fullscreen') {
      container.style.maxWidth = '100vw';
      container.style.width = '100vw';
      container.style.height = '100vh';
      document.getElementById('resize-fullscreen').classList.add('active-resize');
    }
  };
  
  // Auto-load videos when session modal opens
  const originalOpenSession = window.openSession;
  window.openSession = function(slug, num) {
    originalOpenSession(slug, num);
    // Load videos after modal renders
    setTimeout(() => loadSessionVideos(slug, num), 150);
  };
})();
