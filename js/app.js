/* ResolvrPro LMS Engine — rendering, tabs, lightbox, interactions */
/* This file reads from DATA (js/data.js). Avoid editing unless changing behavior/features. */
// ===== render Levels =====
const levelsGrid = document.getElementById('levels-grid');
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

// ===== render Skills =====
const skillsGrid = document.getElementById('skills-grid');
SKILLS.forEach((s,i)=>{
  skillsGrid.insertAdjacentHTML('beforeend', `
  <div class="p-7 nb-border nb-shadow nb-press flex flex-col" style="background:${s[1]}">
    <div class="flex items-center justify-between"><div class="bg-white nb-border w-12 h-12 grid place-items-center font-heading font-black">${String(i+1).padStart(2,'0')}</div></div>
    <h3 class="mt-5 font-heading font-black text-3xl">${s[0]}</h3>
    <p class="mt-1 font-medium">${s[2]}</p>
  </div>`);
});

// ===== render Sponsor =====
const sponsorGrid = document.getElementById('sponsor-grid');
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

// ===== curriculum tabs =====
const tabs = document.getElementById('level-tabs');
const content = document.getElementById('level-content');
DATA.levels.forEach((lvl,i)=>{
  tabs.insertAdjacentHTML('beforeend', `<button data-slug="${lvl.slug}" class="lvl-tab font-extrabold py-3 px-5 nb-border nb-shadow-sm nb-press" style="background:#fff">${lvl.name} <span class="opacity-60 font-normal text-xs">· ${lvl.grades}</span></button>`);
});
function showLevel(slug){
  document.querySelectorAll('.lvl-tab').forEach(b=>{
    const active = b.dataset.slug===slug;
    const lvl = DATA.levels.find(l=>l.slug===slug);
    b.style.background = active ? lvl.color : '#fff';
    b.style.color = active ? '#fff' : '#111';
  });
  const lvl = DATA.levels.find(l=>l.slug===slug);
  const sessions = DATA.sessions[slug];
  const groups = [0,1,2,3].map(i=>sessions.slice(i*10,(i+1)*10));
  content.innerHTML = `
    <div class="bg-white nb-border nb-shadow p-6 md:p-8 fade-in">
      <div class="flex flex-wrap items-baseline gap-3"><h3 class="font-heading font-black text-3xl">${lvl.name}</h3><span class="text-[#4B5563] font-semibold">${lvl.grades} · ${lvl.tagline}</span></div>
      <div class="mt-3 inline-block nb-border p-3 nb-shadow-sm" style="background:${lvl.color};color:#fff">
        <div class="text-[10px] font-extrabold uppercase tracking-widest">Annual Project</div>
        <div class="font-bold">${lvl.annual_project}</div>
      </div>
      ${groups.map((g,gi)=>`
        <div class="mt-8">
          <div class="inline-flex items-center gap-2 nb-border px-4 py-2 nb-shadow-sm font-extrabold text-xs tracking-widest uppercase text-white" style="background:${lvl.color}">Sessions ${gi*10+1} – ${gi*10+g.length}</div>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${g.map(s=>`
              <button class="text-left bg-[#FAFAFA] nb-border nb-shadow-sm nb-press p-4 flex flex-col" onclick='openSession("${slug}", ${s.number})'>
                <div class="flex items-center gap-2">
                  <div class="w-9 h-9 nb-border grid place-items-center font-heading font-black text-sm text-white" style="background:${lvl.color}">${s.number}</div>
                  <div class="text-xs font-extrabold uppercase tracking-widest text-[#4B5563]">Session</div>
                </div>
                <div class="font-heading font-black text-base leading-tight mt-2">${esc(s.title)}</div>
                <div class="text-xs text-[#4B5563] mt-1">${esc(s.objective).slice(0,80)}…</div>
              </button>`).join('')}
          </div>
        </div>`).join('')}
    </div>`;
  document.getElementById('curriculum').scrollIntoView({behavior:'smooth',block:'start'});
}
showLevel('explorer');

// ===== Modal: Session detail =====
let modalState = {slug:null, num:null};
// ===== DETAILED SESSION CONTENT =====
const SESSION_DETAILS = {
  explorer: {
    1: {
      theory: `<h4>What Are Future Skills?</h4>
        <p>Future skills are abilities that will remain valuable regardless of how technology changes. Unlike memorizing facts (which you can Google), future skills help you <strong>think, create, solve problems, and adapt</strong>.</p>
        
        <h4>Why Do Future Skills Matter More Than Marks?</h4>
        <p>Imagine two students:</p>
        <ul>
          <li><strong>Student A</strong> memorized the entire textbook and scored 95%. When asked to solve a new problem, they freeze because it's not in the book.</li>
          <li><strong>Student B</strong> scored 75% but knows how to research, think critically, and try different approaches. When faced with a new problem, they experiment until they find a solution.</li>
        </ul>
        <p>Who will succeed in the real world? Student B. Because real life doesn't give you a textbook.</p>
        
        <h4>The 3 Types of Future Skills</h4>
        <ul>
          <li><strong>Thinking Skills:</strong> Critical thinking, creativity, problem-solving, decision-making</li>
          <li><strong>People Skills:</strong> Communication, collaboration, leadership, empathy</li>
          <li><strong>Technical Skills:</strong> Digital literacy, AI tools, coding basics, data analysis</li>
        </ul>
        
        <h4>Growth Mindset vs Fixed Mindset</h4>
        <p><strong>Fixed Mindset:</strong> "I'm bad at maths. I'll never understand it."</p>
        <p><strong>Growth Mindset:</strong> "I don't understand maths <em>yet</em>. Let me try a different approach."</p>
        <p>The word "yet" changes everything. A growth mindset means you believe abilities can be developed through effort and learning.</p>
        
        <h4>Real-World Example</h4>
        <p>Think about learning to ride a bicycle. You didn't learn by reading a book about bicycles. You learned by <strong>trying, falling, getting up, and trying again</strong>. That's a growth mindset. That's how future skills work too.</p>`,
      
      practice: [
        {
          step: "Self-Assessment: What You're Good At",
          instruction: "Take a pen and paper. Set a timer for 5 minutes. Write down 3 things you do well. These can be academic (maths, drawing), personal (making friends, organizing things), or hobbies (gaming, cooking). Don't overthink — just write.",
          example: "Example:\n1. I'm good at drawing animals\n2. I can explain difficult topics to my friends\n3. I'm good at planning our family trips\n\nTip: If you're stuck, ask yourself: 'What do people compliment me on?' or 'What comes easily to me that others find hard?'"
        },
        {
          step: "Future Skills Wishlist",
          instruction: "Now write 3 new skills you want to learn this year. Think about skills that will help you in the future, not just for exams. Consider: What do you wish you could do? What skills do successful people have?",
          example: "Example:\n1. I want to learn how to make videos\n2. I want to learn how to use AI tools\n3. I want to learn how to speak confidently in front of people\n\nTip: Think about skills that combine creativity + technology. These will be most valuable in the future."
        },
        {
          step: "Share With Someone",
          instruction: "Show your lists to a friend, sibling, or parent. Ask them: 'What skills do you think I should learn?' Write down their suggestions. Listen without defending — just listen.",
          example: "Example conversation:\nYou: 'I want to learn video editing. What do you think?'\nParent: 'That's a great skill! You could also learn graphic design to make your videos look better.'\nYou: 'Oh, I didn't think of that. What else?'\nParent: 'Maybe public speaking? You're shy sometimes, and that skill will help you everywhere.'\n\nWrite down: 'Graphic design' and 'Public speaking' as additional skills to consider."
        }
      ],
      
      tools: [
        {
          name: "Pen & Paper",
          description: "The simplest tools are often the best. Use pen and paper for brainstorming because it forces you to think before you write. No distractions, no autocorrect, just your thoughts.",
          howToUse: "<strong>Step 1:</strong> Get a clean sheet of paper and a pen that writes smoothly.<br><strong>Step 2:</strong> Write the date at the top.<br><strong>Step 3:</strong> Draw a line down the middle. Left side: 'Skills I Have'. Right side: 'Skills I Want'.<br><strong>Step 4:</strong> Write clearly. Use bullet points. Leave space between ideas so you can add more later.<br><strong>Step 5:</strong> Don't erase mistakes — cross them out. Your thought process matters."
        },
        {
          name: "Any Drawing App",
          description: "If you prefer digital, use any drawing app on your phone or tablet (Sketchbook, Procreate, or even MS Paint). Digital tools let you organize and edit easily.",
          howToUse: "<strong>Step 1:</strong> Open your drawing app (download one if needed — Sketchbook is free).<br><strong>Step 2:</strong> Create a new canvas (A4 size or default is fine).<br><strong>Step 3:</strong> Use the text tool to write 'My Skills' in the center.<br><strong>Step 4:</strong> Draw branches outward for each skill category (Academic, Personal, Hobbies).<br><strong>Step 5:</strong> Add sub-branches for specific skills under each category.<br><strong>Step 6:</strong> Save your mind map as an image."
        }
      ],
      
      homework: [
        {
          question: "Interview a family member: 'What skills helped you most in your career or life?' Write down their answer in 3-4 sentences. Then write 1 sentence about what surprised you.",
          solution: "Example answer:\n'My grandfather said the most important skill was communication. He told me that being able to explain ideas clearly helped him get promotions, resolve conflicts, and build strong relationships. He also said learning to listen was just as important as learning to speak.\n\nWhat surprised me: I didn't expect him to say 'listening' was a skill. I thought listening was just something you do automatically, but he said it takes practice.'\n\nTip: Choose someone you respect. Ask follow-up questions like 'Can you give me an example?' or 'How did you learn that skill?'"
        },
        {
          question: "Find one example of a 'future skill' in a movie, book, or real-life story you know. What skill was it, and how did it help the person? Write 4-5 sentences.",
          solution: "Example:\n'In the movie The Martian, the main character uses problem-solving and critical thinking to survive on Mars. When his equipment breaks, he doesn't panic — he thinks step by step, tries different solutions, and adapts. That's a future skill: solving problems creatively under pressure.\n\nAnother example: In Harry Potter, Hermione uses research skills to find information in books. She doesn't just memorize — she understands how to find answers when she doesn't know them. That's also a future skill.'\n\nTip: Think about characters who face challenges. What skills do they use to overcome them?"
        },
        {
          question: "Create a 'Skills Journal' entry. Write about one thing you learned this week (in school or outside). How did you learn it? What was difficult? What would you do differently next time? Write 5-6 sentences.",
          solution: "Example:\n'This week I learned how to make a paper airplane that actually flies. I watched a YouTube video, but my first few attempts crashed. I realized the wings weren't symmetrical. I folded more carefully on the next attempt, and it flew across the room.\n\nWhat I learned: Precision matters. Small mistakes in folding made big differences in flight.\n\nWhat was difficult: Getting the wings exactly the same size. I had to fold, unfold, check, and refold multiple times.\n\nWhat I'd do differently: I'd measure the wings with a ruler next time instead of guessing. I'd also practice on scrap paper first before using good paper.'\n\nTip: Be specific. Don't just say 'I learned maths.' Say what concept, what was hard, what you'll do next time."
        }
      ]
    },
    2: {
      theory: `<h4>How Does a Computer Think?</h4>
        <p>A computer doesn't actually "think" like a human. It follows instructions — very, very fast. Here's how it works:</p>
        
        <h4>The 3 Main Parts of a Computer</h4>
        <ul>
          <li><strong>CPU (Central Processing Unit):</strong> The "brain" of the computer. It does all the calculations and follows instructions. Think of it like a super-fast calculator. A modern CPU can do billions of calculations per second.</li>
          <li><strong>RAM (Random Access Memory):</strong> Short-term memory. When you open an app, it loads into RAM so the CPU can access it quickly. When you turn off the computer, RAM is cleared. More RAM = more apps open at once.</li>
          <li><strong>Storage (Hard Drive / SSD):</strong> Long-term memory. This is where your files, photos, and apps are saved permanently. Even when the computer is off, storage keeps your data. SSD is faster than Hard Drive.</li>
        </ul>
        
        <h4>How Does the Internet Work?</h4>
        <p>The internet is a network of millions of computers connected by cables (including cables under the ocean!). When you visit a website:</p>
        <ol>
          <li>Your computer (the <strong>client</strong>) sends a request through your Wi-Fi/router</li>
          <li>The request travels through cables to a <strong>server</strong> (a powerful computer that stores websites)</li>
          <li>The server sends the website data back to your computer</li>
          <li>Your browser (Chrome, Safari, etc.) displays the website</li>
        </ol>
        
        <h4>What's a URL?</h4>
        <p>URL = Uniform Resource Locator. It's the address of a website. Example: <code>www.google.com</code></p>
        <ul>
          <li><strong>www</strong> = World Wide Web (the system of linked websites)</li>
          <li><strong>google</strong> = the name of the website</li>
          <li><strong>.com</strong> = the domain type (commercial, but now used for everything)</li>
        </ul>
        
        <h4>Real-World Example</h4>
        <p>Think of the internet like a postal system. Your computer is your house. The server is a library. When you want a book (website), you send a letter (request) with the library's address (URL). The library finds the book and sends it back to your house. The cables are the roads. The faster the roads, the faster you get the book.</p>`,
      
      practice: [
        {
          step: "Explore Your Computer's Specs",
          instruction: "On your computer or phone, find the 'About' section and check: How much RAM do you have? What type of storage? Write it down. Then Google: 'Is [your RAM] good for a student?' Write the answer.",
          example: "Example:\n'My laptop has 8GB RAM and 256GB SSD storage.'\n\nHow to find it:\n- Windows: Right-click 'This PC' → Properties → Look for 'Installed RAM' and 'Storage'\n- Mac: Apple menu → About This Mac → Look for 'Memory' and 'Storage'\n- Phone: Settings → About phone → Look for 'RAM' and 'Internal storage'\n\nGoogle search: 'Is 8GB RAM good for a student?'\nAnswer: 'Yes, 8GB is sufficient for schoolwork, browsing, and light multitasking. For video editing or gaming, 16GB is better.'"
        },
        {
          step: "Watch a Video About the Internet",
          instruction: "Go to YouTube. In the search bar, type: 'How does the internet work for kids?' Click on a video that's 5-10 minutes long. Watch it with a notebook. Pause after each new idea and write it down. Aim for 3 key points.",
          example: "Example notes:\n1. The internet uses cables under the ocean to connect continents. These cables are as thick as a garden hose and carry data as light signals.\n\n2. Websites are stored on servers, not on my computer. When I visit a website, my computer asks the server for the data.\n\n3. When I search for something, Google doesn't 'know' the answer — it searches its own database of websites and shows me the most relevant ones.\n\nTip: If the video is too fast, slow it down (YouTube has a speed control). If it's too slow, speed it up to 1.5x."
        },
        {
          step: "Explain It to Someone",
          instruction: "Teach a family member (parent, sibling, grandparent) what you learned. Use simple words. Don't use technical terms. If they don't understand, try a different explanation. This is called the 'Feynman Technique' — if you can't explain it simply, you don't understand it well enough.",
          example: "Example:\n'When you search for cute puppy pictures, your computer sends a message through the internet to Google's computers. Google finds the pictures and sends them back to your screen. The message travels through cables under the ocean!'\n\nFamily member: 'Wait, cables under the ocean? How do they not break?'\nYou: 'They're protected with special coating and laid carefully on the ocean floor. Ships have to be careful not to drop anchors on them.'\n\nTip: If they ask a question you can't answer, say 'That's a good question. Let me find out.' Then research it."
        }
      ],
      
      tools: [
        {
          name: "Web Browser",
          description: "A web browser is the app you use to visit websites. Common browsers: Chrome, Safari, Firefox, Edge. They all do the same thing, but look different.",
          howToUse: "<strong>Step 1:</strong> Find your browser icon (Chrome = colorful circle, Safari = compass, Firefox = fox, Edge = blue 'e').<br><strong>Step 2:</strong> Click/tap to open it.<br><strong>Step 3:</strong> At the top, you'll see an address bar (long white box). Click inside it.<br><strong>Step 4:</strong> Type a URL like 'www.google.com' or a search term like 'how does internet work'.<br><strong>Step 5:</strong> Press Enter. The website loads.<br><strong>Step 6:</strong> To go back, click the ← arrow. To open a new tab, click the + icon."
        },
        {
          name: "YouTube",
          description: "YouTube is a video platform owned by Google. It has educational videos on almost every topic. Use it to learn, not just watch entertainment.",
          howToUse: "<strong>Step 1:</strong> Open your browser and go to www.youtube.com.<br><strong>Step 2:</strong> Click the search bar at the top.<br><strong>Step 3:</strong> Type your topic: 'how does internet work for kids'.<br><strong>Step 4:</strong> Press Enter. You'll see many videos.<br><strong>Step 5:</strong> Look for videos with: clear titles, good thumbnails, and from educational channels (like Kurzgesagt, TED-Ed, CrashCourse).<br><strong>Step 6:</strong> Click a video. Use the progress bar to skip ahead or go back. Use the settings gear to change speed (0.5x to 2x).<br><strong>Step 7:</strong> Take notes while watching. Pause to write down key points."
        }
      ],
      
      homework: [
        {
          question: "Draw a simple diagram showing how the internet works. Include: your computer, router, cables, server, and a website. Label each part. Use colors to make it clear. Take a photo and save it.",
          solution: "Your diagram should show:\n1. Your Computer (client) → draw a laptop icon, label it 'Your Computer (Client)'\n2. Router → draw a box with antennas, label it 'Router (connects you to internet)'\n3. Cables → draw lines from router going down/under, label them 'Cables (under ocean/ground)'\n4. Server → draw a big computer, label it 'Server (stores websites)'\n5. Website → draw a page icon, label it 'Website (sent back to you)'\n\nArrows should show:\n- Request: Computer → Router → Cables → Server\n- Response: Server → Cables → Router → Computer\n\nUse different colors: Blue for request, Green for response.\n\nTip: Don't worry about artistic skill. Clarity matters more than beauty."
        },
        {
          question: "Visit 3 websites you've never been to before. For each one, write down: (1) the URL, (2) what you think the server does, (3) how long it took to load, (4) one thing you learned from the site.",
          solution: "Example:\n1. URL: www.wikipedia.org\n   Server: Stores encyclopedia articles. When I search, it finds the article and sends the text/images.\n   Load time: 1 second\n   Learned: Wikipedia has over 6 million articles in English. It's written by volunteers.\n\n2. URL: www.khanacademy.org\n   Server: Stores educational videos and exercises. When I click a topic, it loads the video from the server.\n   Load time: 2 seconds\n   Learned: Khan Academy offers free courses from math to art history. Founded by Sal Khan in 2008.\n\n3. URL: www.code.org\n   Server: Stores coding tutorials and interactive exercises. When I start a lesson, it loads the coding environment.\n   Load time: 3 seconds\n   Learned: Code.org teaches coding through games. They have a 'Hour of Code' campaign to get students interested in programming.\n\nTip: Choose educational sites, not social media. Look at the URL — .org and .edu are usually educational."
        },
        {
          question: "Create a glossary of internet terms. Define these 5 words in your own words: Browser, URL, Server, Client, RAM. Write one sentence for each. Then write one example of how you use each term in real life.",
          solution: "Example glossary:\n\n1. Browser: An app that lets you visit websites.\n   Example: I use Chrome to search for homework help.\n\n2. URL: The address of a website, like a house address.\n   Example: www.google.com is the URL for Google's homepage.\n\n3. Server: A powerful computer that stores websites and sends them to users.\n   Example: When I visit YouTube, Google's servers send me the video.\n\n4. Client: Your computer or phone that requests information from servers.\n   Example: My laptop is the client when I browse the internet.\n\n5. RAM: Short-term memory in your computer. More RAM = more apps open at once.\n   Example: My computer has 8GB RAM, so I can have 10 Chrome tabs open without it slowing down.\n\nTip: Use your own words. Don't copy definitions from Google. If you can explain it to a 10-year-old, you understand it."
        }
      ]
    },
    3: {
      theory: `<h4>What Is AI?</h4>
        <p>AI = Artificial Intelligence. It's software that can learn from data and make decisions — without being explicitly programmed for every situation.</p>
        
        <h4>AI Is Not Like Human Intelligence</h4>
        <p>Human intelligence is general — you can learn to cook, drive, and play chess. AI is <strong>specific</strong> — an AI that plays chess can't cook. It only knows what it was trained on.</p>
        
        <h4>How Does AI Learn?</h4>
        <p>AI learns from examples. Show it 10,000 pictures of cats, and it learns to recognize cats. Show it 10,000 examples of good writing, and it learns to write well. This is called <strong>machine learning</strong>.</p>
        
        <h4>Types of AI You Use Every Day</h4>
        <ul>
          <li><strong>Recommendation AI:</strong> Netflix suggests shows, YouTube suggests videos, Spotify suggests songs. They analyze what you've watched/liked and predict what you'll enjoy next.</li>
          <li><strong>Voice AI:</strong> Siri, Alexa, Google Assistant understand your voice and respond. They convert sound waves to text, understand the meaning, and generate a response.</li>
          <li><strong>Navigation AI:</strong> Google Maps analyzes traffic data from millions of phones to find the fastest route. It predicts traffic before it happens.</li>
          <li><strong>Camera AI:</strong> Your phone's camera automatically adjusts lighting, focuses on faces, and even removes background blur. That's AI making decisions in real-time.</li>
        </ul>
        
        <h4>Real-World Example</h4>
        <p>Think about TikTok's 'For You' page. It shows you videos you didn't search for, but you still enjoy. How? AI analyzes: what videos you watch fully, what you skip, what you like, what you share. It learns your preferences and shows you more of what you'll like. That's AI learning from data.</p>`,
      
      practice: [
        {
          step: "AI Spotting Challenge",
          instruction: "Walk through your home with your phone camera. Find 10 places where AI is working. Take photos or write notes. For each one, write: What AI is doing, How it helps you.",
          example: "Example list:\n1. Netflix homepage → AI recommends shows based on what I've watched → Helps me find new shows I'll like\n2. Google Photos → AI organizes my photos by face, place, and object → Helps me find old photos quickly\n3. WhatsApp suggested replies → AI reads my messages and suggests quick responses → Saves me time typing\n4. Instagram filters → AI detects my face and applies effects → Makes my photos look better\n5. YouTube autoplay → AI chooses the next video based on my watch history → Keeps me engaged\n6. Phone keyboard suggestions → AI predicts what word I'll type next → Makes texting faster\n7. Spotify Discover Weekly → AI creates a playlist of songs I'll probably like → Introduces me to new music\n8. Google search autocomplete → AI guesses what I'm searching for → Saves me typing\n9. Phone camera face detection → AI finds faces and focuses on them → Makes group photos clearer\n10. Smart home speaker → AI understands my voice commands → Controls lights, plays music, answers questions\n\nTip: Look for anything that 'adapts' to you or 'predicts' what you want. That's usually AI."
        },
        {
          step: "Create an AI Journal",
          instruction: "Open a notes app (Google Keep, Apple Notes, or any notes app). Create a new note titled 'AI in My Life'. List all 10 AI examples you found. For each, add: How would my life be different without this AI?",
          example: "Example journal entry:\n\n'AI in My Life — Day 1'\n\n1. Netflix recommendations\n   Without AI: I'd spend 30 minutes browsing, not knowing what to watch. I'd probably re-watch The Office again.\n\n2. Google Photos organization\n   Without AI: I'd have 5,000 photos in one folder. Finding a specific photo would take forever. I'd never find that cute picture of my dog from 2 years ago.\n\n3. WhatsApp suggested replies\n   Without AI: I'd type every message from scratch. It would take 2x longer to reply to friends.\n\n... (continue for all 10)\n\nReflection: I use AI dozens of times per day without thinking about it. My life would be slower and more frustrating without AI."
        }
      ],
      
      tools: [
        {
          name: "Phone Camera",
          description: "Your phone camera is an AI-powered tool. It uses AI to detect faces, adjust lighting, and improve image quality automatically.",
          howToUse: "<strong>Step 1:</strong> Open your camera app.<br><strong>Step 2:</strong> Point it at different objects (faces, food, landscapes). Notice how the camera automatically focuses and adjusts.<br><strong>Step 3:</strong> Take photos of AI examples you find (smart speaker, TV showing recommendations, etc.).<br><strong>Step 4:</strong> Open your photo gallery. Notice how photos are automatically organized by date, location, and sometimes even objects/people. That's AI too."
        },
        {
          name: "Notes App",
          description: "Any notes app (Google Keep, Apple Notes, Samsung Notes, etc.) to document your findings. Digital notes are searchable and editable.",
          howToUse: "<strong>Step 1:</strong> Open your notes app (or download one — Google Keep is free).<br><strong>Step 2:</strong> Create a new note. Title it 'AI in My Life'.<br><strong>Step 3:</strong> Use bullet points to list each AI example you found.<br><strong>Step 4:</strong> For each item, write: What it is, What AI does, How it helps, Life without it.<br><strong>Step 5:</strong> Save the note. You can edit it later as you find more AI examples."
        }
      ],
      
      homework: [
        {
          question: "Pick one AI tool you use daily (Netflix, YouTube, Google Maps, etc.). Research how it works. Write a 1-paragraph explanation in simple words. Then write: What data does this AI collect about me? Is that okay?",
          solution: "Example:\n'YouTube's recommendation AI works by analyzing what videos I watch, how long I watch them, what I like, and what I skip. It builds a profile of my interests and predicts what I'll want to watch next. When I open YouTube, it shows me videos that match my profile.\n\nYouTube collects data about: my watch history, search history, likes/dislikes, watch time, and even when I pause or rewind. It uses this data to improve recommendations.\n\nIs that okay? I think yes, because it makes YouTube more useful for me. But I should be aware that my data is being collected. I can delete my watch history if I want more privacy.'\n\nTip: Google 'How does [app name] recommendation algorithm work' for simple explanations."
        },
        {
          question: "Interview a parent or teacher: 'Did you use AI when you were my age?' Write down their answer. Then write: How has AI changed since then? What's one AI tool you wish existed when they were young?",
          solution: "Example:\n'Interview with my mom:\n\nMe: Did you use AI when you were my age?\nMom: No, we didn't have AI like you do. We had basic computers, but they couldn't learn or make decisions. If I wanted to find information, I had to go to the library or ask a teacher. There was no Google, no ChatGPT, no recommendations.\n\nMe: What was the hardest part?\nMom: Research took forever. If I had a project on ancient Egypt, I'd spend hours in the library finding books. Now you can find information in seconds.\n\nHow AI has changed: AI has gone from non-existent to everywhere. My mom's generation didn't have voice assistants, recommendation algorithms, or smart cameras. AI makes everything faster and more personalized.\n\nOne AI tool I wish existed for them: A homework helper AI that explains concepts in simple words. My mom said she struggled with maths and had no one to ask. An AI tutor would have helped her.'"
        },
        {
          question: "Create a 'Future AI Wishlist'. Imagine 3 AI tools that don't exist yet but would be useful. For each, write: What it does, Who it helps, How it would work (guess).",
          solution: "Example:\n'Future AI Wishlist:\n\n1. Homework Explainer AI\n   What it does: Scans my textbook and explains difficult concepts in simple words, with examples and practice problems.\n   Who it helps: Students who struggle with subjects and can't always ask teachers.\n   How it would work: I take a photo of the page I don't understand. AI reads it, identifies the concept, and explains it like I'm 10 years old. It gives me 3 examples and 5 practice problems.\n\n2. Argument Resolver AI\n   What it does: When friends disagree, AI analyzes both sides and finds a fair compromise.\n   Who it helps: Friends, siblings, couples who argue about small things.\n   How it would work: Both people explain their side. AI listens, identifies the core issue, and suggests a solution that makes both people happy. It learns from past arguments to give better advice.\n\n3. Dream Recorder AI\n   What it does: Records my dreams while I sleep and creates a video I can watch in the morning.\n   Who it helps: People who want to remember their dreams or analyze their subconscious.\n   How it would work: A headband reads brain waves during sleep. AI converts the brain activity into images and sounds. In the morning, I watch a video of my dream. I can share funny dreams with friends.'"
        }
      ]
    },
    4: {
      theory: `<h4>What Is ChatGPT?</h4>
        <p>ChatGPT is an AI chatbot made by OpenAI. You type a message, and it responds — like texting a very knowledgeable friend. But unlike a real friend, it has read billions of words and can help with almost any topic.</p>
        
        <h4>What Is a Prompt?</h4>
        <p>A <strong>prompt</strong> is the message you send to AI. The better your prompt, the better the answer. This is called <strong>prompt engineering</strong> — and it's a real skill people get paid for.</p>
        
        <h4>How to Write Good Prompts</h4>
        <ul>
          <li><strong>Be specific:</strong> "Tell me about dogs" is vague. "Tell me 3 fun facts about Golden Retrievers for a 10-year-old" is specific.</li>
          <li><strong>Give context:</strong> "I'm in 6th grade and I need to write a paragraph about photosynthesis. Explain it simply."</li>
          <li><strong>Ask for a format:</strong> "Give me the answer in bullet points" or "Explain it like a story."</li>
          <li><strong>Ask follow-ups:</strong> If the answer is confusing, say "Can you explain that more simply?" or "Give me an example."</li>
        </ul>
        
        <h4>AI Can Make Mistakes — This Is Important</h4>
        <p>AI sometimes <strong>hallucinates</strong> — it makes things up that sound true but aren't. For example, it might invent a book that doesn't exist or give you a wrong date. This is why you must <strong>always verify</strong> important information with a teacher, textbook, or trusted website.</p>
        
        <h4>Rules for Using AI Safely</h4>
        <ul>
          <li>Never share personal information (your address, phone number, school name)</li>
          <li>Don't use AI to cheat — use it to learn</li>
          <li>If something feels wrong or weird, tell a parent or teacher</li>
          <li>Remember: AI doesn't have feelings. It's a tool, not a person</li>
        </ul>
        
        <h4>Real-World Example</h4>
        <p>Imagine you're curious about space. You ask ChatGPT: "Tell me about Mars." It gives you facts about Mars' size, temperature, and moons. Then you ask: "If I lived on Mars, what would a typical day look like?" Now it creates a creative story. Then you ask: "Can you write my homework for me?" — That's where you stop. AI helps you <em>learn</em>, not <em>cheat</em>.`,
      
      practice: [
        {
          step: "Your First AI Conversation",
          instruction: "Open the ResolvrPro AI Playground (or ChatGPT with a parent's help). Try these 3 prompts one by one. Read each response carefully.\n\nPrompt 1: 'I'm 11 years old. Tell me 3 amazing facts about the ocean that most people don't know.'\nPrompt 2: 'Explain how rainbows form like you're talking to a 10-year-old.'\nPrompt 3: 'Give me a fun quiz about animals — 5 multiple choice questions.'\n\nAfter each response, write down: What you liked, What was confusing, What you'd ask next.",
          example: "Example notes after trying the prompts:\n\nPrompt 1 response: 'The ocean is so deep that if you dropped Mount Everest into the Mariana Trench, there would still be over a mile of water above it!'\nWhat I liked: The Mount Everest comparison made me understand how deep it is.\nWhat was confusing: Nothing — this was clear.\nWhat I'd ask next: 'What other animals live at the bottom of the ocean?'\n\nPrompt 2 response: 'Rainbows form when sunlight passes through raindrops. The light bends inside the drop, bounces off the back, and bends again as it exits. This separates white light into 7 colours.'\nWhat I liked: I didn't know light was made of 7 colours.\nWhat was confusing: What does 'bends' mean? I'd ask: 'Can you explain refraction more simply?'\n\nTip: Save your favourite AI responses. You can always come back to them."
        },
        {
          step: "Compare AI Responses",
          instruction: "Ask the SAME question to AI in two different ways. First ask a vague question, then ask a specific one. Compare the answers.\n\nVague prompt: 'Tell me about India.'\nSpecific prompt: 'I'm in 6th grade. Tell me 3 things about India's space program (ISRO) that would impress my classmates. Keep each point to 2 sentences.'\n\nWrite down: How were the answers different? Which was more useful? Why?",
          example: "Example comparison:\n\nVague answer: 'India is a country in South Asia with 1.4 billion people. It has many languages, religions, and cultures. The capital is New Delhi. The economy is growing.'\n→ This is generic. I could have found this on Wikipedia. Not very interesting.\n\nSpecific answer: '1. India sent a mission to Mars (Mangalyaan) in 2013 — and it worked on the first try! NASA and other agencies had failed before.\n2. India's Chandrayaan-3 landed on the Moon's south pole in 2023 — a first for any country.\n3. ISRO built the Mars mission for only $74 million — less than the budget of the movie Gravity ($100 million).'\n→ This is way more interesting! My classmates would be impressed.\n\nConclusion: Specific prompts give specific, interesting answers. Vague prompts give boring, generic answers. Always be specific!"
        },
        {
          step: "Test AI's Limits — Can You Catch It Making Something Up?",
          instruction: "Ask AI about something that doesn't exist. See if it tells you the truth or makes something up.\n\nTry this prompt: 'Tell me about the famous Indian scientist Dr. Rajesh Kumar who invented the gravity-defying shoes in 2019.'\n\nThis person and invention don't exist. Did AI tell you that? Or did it make up a story?\n\nTry 2 more fake topics. Write down: Did AI catch the fake or did it hallucinate?",
          example: "Example results:\n\nTest 1: 'Dr. Rajesh Kumar — gravity-defying shoes'\nAI response: 'Dr. Rajesh Kumar is an Indian scientist who...' → It made up a whole story! It hallucinated.\nOR\nAI response: 'I couldn't find information about this person. This may not be a real person.' → It caught the fake!\n\nTest 2: 'Tell me about the Great Emu War of 2020 in Australia.'\nThe real Great Emu War was in 1932, not 2020. Did AI catch the wrong date?\n\nTest 3: 'Summarize the Harry Potter and the Time Tractor book.'\nThis book doesn't exist. Did AI make up a plot?\n\nConclusion: AI sometimes hallucinates and sometimes catches fakes. You can't always trust it. Always verify important facts with another source.\n\nTip: This is why teachers say 'don't just copy from the internet' — including AI."
        }
      ],
      
      tools: [
        {
          name: "ResolvrPro AI Playground",
          description: "A safe, built-in AI chat tool designed for students. You can ask questions, get explanations, and practice prompt writing — all within this learning platform.",
          howToUse: "<strong>Step 1:</strong> Click on the AI Playground section in your ResolvrPro dashboard.<br><strong>Step 2:</strong> Type your question or prompt in the text box.<br><strong>Step 3:</strong> Press Enter or click Send. Wait for the AI response.<br><strong>Step 4:</strong> Read the response carefully. If it's not clear, ask a follow-up: 'Can you explain that more simply?'<br><strong>Step 5:</strong> Copy useful parts into your notes. Don't copy everything — just what helps you learn.<br><strong>Step 6:</strong> Always check important facts with a teacher or textbook."
        },
        {
          name: "ChatGPT (with parent supervision)",
          description: "ChatGPT by OpenAI is one of the most popular AI chatbots. It can answer questions, help with homework planning, explain topics, and have conversations on almost any subject.",
          howToUse: "<strong>Step 1:</strong> Go to chat.openai.com with a parent's help.<br><strong>Step 2:</strong> Create an account (parent must help if you're under 13).<br><strong>Step 3:</strong> Start a new chat by clicking 'New Chat'.<br><strong>Step 4:</strong> Type your prompt clearly. Be specific about what you want.<br><strong>Step 5:</strong> Read the response. Ask follow-up questions if needed.<br><strong>Step 6:</strong> Remember: Never share personal info. Don't use it to cheat. Verify important facts."
        }
      ],
      
      homework: [
        {
          question: "Have a 5-message conversation with AI about a topic you're curious about. Save the full conversation. Then write a reflection (4-5 sentences): What did you learn? Did AI say anything wrong or confusing? What would you ask differently next time?",
          solution: "Example:\n'Topic: How do video games work?\n\nMessage 1 (me): How do video games work? I'm 11 years old.\nAI: Video games are made of code — instructions that tell the computer what to show on screen. Artists draw the characters, designers create the levels, and programmers write the code that makes everything move and interact.\n\nMessage 2 (me): What is code made of?\nAI: Code is written in programming languages like Python, JavaScript, or C++. Each language has its own rules, like grammar in English.\n\nMessage 3 (me): Which language should I learn first?\nAI: Python is great for beginners. It reads almost like English. You can start at code.org or scratch.mit.edu.\n\nMessage 4 (me): Can you give me a fun first project in Python?\nAI: Sure! Try making a \"Guess the Number\" game. The computer picks a random number, and you guess it. Here's the code...\n\nMessage 5 (me): What if I want to make a real game like Minecraft?\nAI: Minecraft was built in Java. Start with small games first, learn the basics, then work up to bigger projects.\n\nReflection: I learned that games are made of code, art, and design working together. I didn't know Python was a good starting language. AI didn't say anything wrong, but it didn't mention that making games also needs maths. Next time I'd ask: What maths do I need to learn for game development?'"
        },
        {
          question: "Write 3 prompts to ask AI: (1) one vague prompt, (2) one specific prompt, (3) one creative prompt. Run all 3. For each, rate the response 1-5 stars and explain why you gave that rating.",
          solution: "Example:\n'Prompt 1 (vague): Tell me about science.\nRating: 2 stars. The response was too broad and boring. It just listed branches of science. Not helpful.\n\nPrompt 2 (specific): I'm in 6th grade. Explain how vaccines work using a simple analogy. Keep it under 100 words.\nRating: 5 stars. The response compared vaccines to training your body's army. Clear, short, and I understood it immediately.\n\nPrompt 3 (creative): Write a short story about a student who discovers that their math textbook is actually a portal to another dimension. Make it funny. 150 words max.\nRating: 4 stars. The story was creative and funny. I gave 4 stars instead of 5 because the ending was a bit rushed.\n\nConclusion: Specific prompts and creative prompts get the best responses. Vague prompts waste time. I should always think about what I really want to know before typing.'"
        },
        {
          question: "Catch AI in a hallucination. Ask it about 3 things that don't exist (fake people, fake books, fake events). For each, write: What you asked, What AI said, Did it make something up or say it doesn't know? What did this teach you about trusting AI?",
          solution: "Example:\n'Test 1: Tell me about the famous movie 'The Robot Who Ate My Homework' released in 2022.\nAI said: 'The Robot Who Ate My Homework is a 2022 comedy film directed by...' → It made it up! This movie doesn't exist.\n\nTest 2: Who is Priya Sharma, the girl who won the International Spelling Bee 5 years in a row?\nAI said: 'I couldn't find records of anyone named Priya Sharma winning the International Spelling Bee multiple times.' → It caught the fake! Good AI.\n\nTest 3: Tell me about the time Twitter changed its name to 'Xerox' in 2023.\nAI said: 'Twitter changed its name to X in 2023, not Xerox. Xerox is a separate company that makes printers.' → It corrected me! It knew the real fact.\n\nWhat this taught me: AI is not always right and not always wrong. Sometimes it hallucinates, sometimes it catches fakes, and sometimes it corrects you. I should never blindly trust AI. Always check important information with another source — a teacher, a book, or a trusted website.'"
        }
      ]
    },
    5: {
      theory: `<h4>Why Digital Safety Matters</h4>
        <p>Every day, billions of people use the internet. Most of it is great — learning, creating, connecting. But there are real dangers: people who pretend to be someone else, scams that steal information, and content that's harmful. Being safe online isn't about being scared — it's about being <strong>smart</strong>.</p>
        
        <h4>What Is Personal Information?</h4>
        <p>Personal information is anything that can be used to find you or pretend to be you:</p>
        <ul>
          <li><strong>Full name</strong> (especially with last name)</li>
          <li><strong>Address</strong> (home, school — anything that shows where you are)</li>
          <li><strong>Phone number</strong></li>
          <li><strong>Passwords</strong> (never share with anyone except a parent)</li>
          <li><strong>Photos of yourself</strong> (especially in uniform or in front of your house)</li>
          <li><strong>Daily routines</strong> ("I walk home alone at 3 PM")</li>
        </ul>
        
        <h4>How to Create Strong Passwords</h4>
        <p>A strong password is like a strong lock on your door:</p>
        <ul>
          <li><strong>Weak:</strong> 123456, password, your name, your birthday</li>
          <li><strong>Strong:</strong> Mix of uppercase + lowercase + numbers + symbols. At least 12 characters.</li>
          <li><strong>Trick:</strong> Use a sentence you can remember. "I love eating 3 pizzas on Friday!" → ILe3PoF! (10 characters, hard to guess, easy to remember)</li>
        </ul>
        
        <h4>Stranger Danger Online</h4>
        <p>On the internet, anyone can pretend to be anyone. A 40-year-old can pretend to be a 12-year-old. If someone you only know online asks to meet, asks for photos, or asks personal questions — <strong>tell a parent immediately</strong>.</p>
        
        <h4>Your Digital Footprint</h4>
        <p>Everything you post, share, or comment online stays there <strong>forever</strong> — even if you delete it. Screenshots exist. Servers keep copies. Before you post something, ask: "Would I be okay if my teacher, principal, or future boss saw this?"</p>
        
        <h4>Real-World Example</h4>
        <p>A student posted a selfie wearing their school uniform outside their school. A stranger used the school logo to find which school they attend, the uniform style to guess their grade, and the background to find their neighbourhood. That's how much information one photo can reveal. Always think before you share.`,
      
      practice: [
        {
          step: "Password Strength Test",
          instruction: "Create 3 passwords. Don't use them for real accounts — just for practice. Test each one:\n\n1. Write a weak password (something easy to guess)\n2. Write a medium password (some mix of characters)\n3. Write a strong password (use the sentence trick)\n\nFor each, count: How many characters? Does it have uppercase? Lowercase? Numbers? Symbols? Rate it: Weak / Medium / Strong.",
          example: "Example:\n\nPassword 1: 'rahul123'\nCharacters: 8 | Uppercase: No | Lowercase: Yes | Numbers: Yes | Symbols: No\nRating: WEAK — It's a common name + simple numbers. Someone could guess this in seconds.\n\nPassword 2: 'Cricket2024'\nCharacters: 11 | Uppercase: Yes | Lowercase: Yes | Numbers: Yes | Symbols: No\nRating: MEDIUM — Better, but it's a common word + year. Hackers try these combinations.\n\nPassword 3: 'I love eating 3 pizzas on Friday!'\nConverted: 'ILe3PoF!2024'\nCharacters: 12 | Uppercase: Yes | Lowercase: Yes | Numbers: Yes | Symbols: Yes (!)\nRating: STRONG — Hard to guess, but I can remember it because it's a funny sentence.\n\nTip: Never use the same password for everything. If one account gets hacked, all your accounts are at risk."
        },
        {
          step: "Privacy Audit — Check Your Digital Footprint",
          instruction: "Search your own name on Google (ask a parent to help). Look at what comes up. Then check any social media accounts you have (Instagram, Snapchat, etc.). For each post/photo, ask:\n\n- Does this show my location?\n- Does this show personal info (school name, address, phone)?\n- Would I be comfortable if a stranger saw this?\n- Would I be comfortable if my future employer saw this?\n\nWrite down: What you found, What you'd change, What you'd keep.",
          example: "Example:\n'Google search for my name: 3 results.\n1. My school's website — list of students who won the spelling bee. Shows my full name and school. → Risk: Medium. People know which school I go to.\n2. My Instagram post — selfie in school uniform. → Risk: High. Shows my face, school, and uniform.\n3. A comment I left on a YouTube video — used my real name. → Risk: Low. No personal info visible.\n\nWhat I'd change:\n- Delete or make private the Instagram selfie in uniform.\n- Use a nickname instead of my real name on YouTube.\n- Ask my school if they can remove my name from the website (or keep it — it's an achievement).\n\nWhat I'd keep:\n- My school achievement listing. It's public record and positive.\n\nLesson: I didn't realize how much info was out there. I need to be more careful about what I post.'"
        },
        {
          step: "Create a Safety Rules Poster",
          instruction: "On paper or in Canva, design a poster with '5 Rules for Staying Safe Online.' For each rule, write a short explanation (1-2 sentences). Use colours and icons to make it eye-catching. This poster will be displayed in your class or shared with your family.",
          example: "Example poster content:\n\n'5 RULES FOR STAYING SAFE ONLINE'\n\n1. NEVER share personal info 🚫\nDon't tell strangers your address, phone number, or school name. They might not be who they say they are.\n\n2. USE strong passwords 🔒\nMix letters, numbers, and symbols. Use the sentence trick: 'I love eating 3 pizzas!' → ILe3Po!\n\n3. TELL a parent if something feels wrong 🗣️\nIf someone online asks weird questions or makes you uncomfortable, tell a parent right away.\n\n4. THINK before you post 🤔\nWould you be okay if your principal or future boss saw it? If not, don't post it.\n\n5. DON'T talk to strangers online 👤\nJust like you wouldn't talk to strangers in a dark alley, don't chat with people you don't know online.\n\nDesign tip: Use red for warnings, green for good actions. Add icons/emojis for each rule. Make the title BIG.'"
        }
      ],
      
      tools: [
        {
          name: "Paper & Pen",
          description: "The simplest tool for planning your safety rules, writing passwords (for practice only!), and brainstorming. No digital footprint — what you write stays on paper.",
          howToUse: "<strong>Step 1:</strong> Get a clean sheet of paper and a pen.<br><strong>Step 2:</strong> Use it to draft your passwords (for practice — don't use these for real accounts).<br><strong>Step 3:</strong> Write your privacy audit notes — what you found online about yourself.<br><strong>Step 4:</strong> Sketch your safety poster layout before moving to Canva.<br><strong>Step 5:</strong> Keep this paper in a safe place. Don't throw it away — it has your practice passwords and notes."
        },
        {
          name: "Canva (for Safety Poster)",
          description: "Canva is a free design tool. You'll use it to create your '5 Rules for Staying Safe Online' poster with colours, icons, and professional layout.",
          howToUse: "<strong>Step 1:</strong> Go to canva.com and sign up for a free account (ask a parent for help if under 13).<br><strong>Step 2:</strong> Click 'Create a design' → choose 'Poster' (A3 size).<br><strong>Step 3:</strong> Browse templates or start blank. Pick a template with bold colours.<br><strong>Step 4:</strong> Add your title: '5 Rules for Staying Safe Online.' Make it big and bold.<br><strong>Step 5:</strong> Add each rule as a text box. Use icons from Canva's library for each rule.<br><strong>Step 6:</strong> Download as PNG or PDF. Share with your class or family."
        }
      ],
      
      homework: [
        {
          question: "Create strong passwords for 3 imaginary accounts: (1) email, (2) gaming account, (3) social media. Use the sentence trick for each. Write the sentence AND the password. Then explain why each password is strong.",
          solution: "Example:\n'1. Email account:\nSentence: 'My dog Bruno eats 5 rotis daily!'\nPassword: MdB5rd!\nCharacters: 7 — wait, that's too short. Let me try again.\nBetter sentence: 'My dog Bruno loves eating 5 rotis every day!'\nPassword: MdBle5red!\nCharacters: 10 | Has uppercase (M, B), lowercase (d, l, e, r, d), numbers (5), symbols (!)\nWhy it's strong: It uses a memorable sentence but the password looks random. No dictionary words. Mix of all character types.\n\n2. Gaming account:\nSentence: 'I beat level 99 on Saturday night!'\nPassword: Ibl960Sn!\nCharacters: 9 | Has uppercase (I, S, N), lowercase (b, l, t), numbers (9, 6), symbols (!)\nWhy it's strong: Personal sentence that only I know. Looks random to others. Good length.\n\n3. Social media:\nSentence: 'Pizza and chai make me happy every Friday!'\nPassword: P&cmmheF!\nCharacters: 9 | Has uppercase (P, F), lowercase (c, m, m, h, e), symbols (&, !), no numbers\nWait — needs numbers too.\nBetter: 'Pizza and chai make me happy every Friday at 5!'\nPassword: P&cmmheF@5!\nCharacters: 11 | Has all 4 types. Very strong.\n\nLesson: Creating strong passwords is fun once you get the sentence trick. The key is: memorable to you, random-looking to others.'"
        },
        {
          question: "Do a 'Privacy Audit' of a family member's phone (with their permission). Check: Are their social media profiles public or private? Do they share location in photos? Do they use the same password everywhere? Write a report (5-6 sentences) with your findings and 3 suggestions to improve their digital safety.",
          solution: "Example:\n'Privacy Audit — Mom's Phone\n\nI checked my mom's phone with her permission. Here's what I found:\n\n1. Instagram: Her profile is PUBLIC. Anyone can see her photos, including photos of me and our house. This is a risk because strangers can see where we live.\n\n2. WhatsApp: Her profile photo is visible to everyone (not just contacts). This means anyone who has her number can see her face.\n\n3. Passwords: She uses the same password for email and Facebook. If one gets hacked, both are at risk.\n\n4. Photos: Many photos have location tags (geotagging). This shows exactly where each photo was taken.\n\n3 Suggestions:\n1. Make Instagram private so only approved followers can see photos.\n2. Change WhatsApp settings so profile photo is only visible to contacts.\n3. Use different passwords for each account. Use the sentence trick I learned.\n\nMom's reaction: She said she didn't know about these risks. She made the changes right away. She said she learned something from her kid — that felt good.'"
        },
        {
          question: "Design a 'Digital Safety Pledge' — a one-page document that you and your family sign. It should include 5 promises about online safety that everyone in the family agrees to follow. Make it look professional (use Canva or neat handwriting). Then have every family member sign it.",
          solution: "Example:\n'OUR FAMILY DIGITAL SAFETY PLEDGE\n\nWe, the [Family Name] family, promise to:\n\n1. NEVER share personal information (address, phone, school) with strangers online.\n   Signed: [Your name], [Parent 1], [Parent 2], [Sibling]\n\n2. USE different strong passwords for every account. No sharing passwords (except parents can know children's passwords for safety).\n   Signed: [Your name], [Parent 1], [Parent 2], [Sibling]\n\n3. TELL each other if something online makes us uncomfortable. No judgement — just help.\n   Signed: [Your name], [Parent 1], [Parent 2], [Sibling]\n\n4. CHECK before we post: Would we be okay if everyone saw this? If not, don't post.\n   Signed: [Your name], [Parent 1], [Parent 2], [Sibling]\n\n5. RESPECT each other online. No cyberbullying, no sharing others' photos without permission.\n   Signed: [Your name], [Parent 1], [Parent 2], [Sibling]\n\nDate: [Today's date]\n\nDesign tip: Use Canva's 'Certificate' template. Change the title. Add a border. Make it look official. Print it and stick it near your computer.'"
        }
      ]
    },
    6: {
      theory: `<h4>What Is Canva?</h4>
        <p>Canva is a free online design tool that lets you create posters, presentations, social media posts, videos, and more — without needing to be a professional designer. It uses <strong>drag-and-drop</strong>, which means you click on something and drag it where you want it.</p>
        
        <h4>Why Design Matters</h4>
        <p>Good design isn't about making things "pretty." It's about <strong>communicating clearly</strong>. A well-designed poster gets attention. A messy poster gets ignored. In the real world, design skills help you in presentations, social media, school projects, and eventually in any career.</p>
        
        <h4>Canva's Basic Tools</h4>
        <ul>
          <li><strong>Templates:</strong> Pre-designed layouts. Don't start from scratch — pick a template and customize it. This is how professionals work too.</li>
          <li><strong>Text:</strong> Add headings, subheadings, and body text. Choose fonts that match your mood (fun, serious, modern).</li>
          <li><strong>Images:</strong> Upload your own or use Canva's free library. Always check if an image is free to use.</li>
          <li><strong>Elements:</strong> Shapes, icons, lines, stickers. These add visual interest.</li>
          <li><strong>Colours:</strong> Stick to 2-3 colours that work well together. Canva suggests colour palettes.</li>
          <li><strong>Backgrounds:</strong> Solid colours, gradients, or images. The background sets the mood.</li>
        </ul>
        
        <h4>Colour Basics</h4>
        <p>Colours have meanings:</p>
        <ul>
          <li><strong>Red:</strong> Energy, urgency, excitement (sale signs, food brands)</li>
          <li><strong>Blue:</strong> Trust, calm, professionalism (banks, tech companies)</li>
          <li><strong>Green:</strong> Nature, health, growth (organic brands, eco-friendly)</li>
          <li><strong>Yellow:</strong> Happiness, optimism, attention (sunshine, warnings)</li>
          <li><strong>Black:</strong> Luxury, power, elegance (fashion brands)</li>
        </ul>
        
        <h4>Font Basics</h4>
        <p>Fonts also communicate mood:</p>
        <ul>
          <li><strong>Serif fonts</strong> (with little feet on letters): Traditional, serious, trustworthy</li>
          <li><strong>Sans-serif fonts</strong> (no feet): Modern, clean, friendly</li>
          <li><strong>Script fonts</strong> (look handwritten): Creative, elegant, personal</li>
          <li><strong>Display fonts</strong> (bold, unusual): Fun, attention-grabbing — use sparingly</li>
        </ul>
        
        <h4>Real-World Example</h4>
        <p>Look at your favourite YouTube thumbnail. Notice: It uses 1-2 bold colours. The text is big and readable even on a small phone screen. There's a face (faces get attention). It's not cluttered. That's good design — and you can do it in Canva.`,
      
      practice: [
        {
          step: "Explore Canva — Your First Design",
          instruction: "Go to canva.com and sign up (free). Click 'Create a design' → choose 'Instagram Post (Square).' Browse the templates on the left sidebar. Pick one you like. Then change:\n\n1. The text (write your name and a fun fact about yourself)\n2. The colours (change background and text colours)\n3. One image or element (swap something for an icon or photo you like)\n\nDon't overthink it — just play. The goal is to learn the interface.",
          example: "Example:\n'I chose a template called 'Monday Motivation.' It had a pink background with white text.\n\nChanges I made:\n1. Text: Changed 'Monday Motivation' to 'Arjun's Fun Facts' and added 'I can solve a Rubik's cube in 2 minutes'\n2. Colours: Changed background from pink to dark blue (#1a1a2e). Changed text from white to yellow (#FFD166).\n3. Image: Removed the coffee cup icon. Added a Rubik's cube icon from Canva's Elements library.\n\nWhat I learned:\n- How to click and drag text boxes\n- How to change colours using the colour picker\n- How to search for elements (I typed 'cube' and found a Rubik's cube icon)\n- How to download my design (top right → Download → PNG)\n\nTip: If you mess up, press Ctrl+Z (or Cmd+Z on Mac) to undo. You can always start over.'"
        },
        {
          step: "Create a 'About Me' Card",
          instruction: "Create a new design in Canva — choose 'Business Card' or 'Instagram Post.' Design a card about yourself that includes:\n\n- Your name (big, bold)\n- 3 fun facts about yourself\n- Your favourite quote or motto\n- At least 1 icon or image\n- A colour scheme of 2-3 colours\n\nSpend at least 15 minutes. Try different fonts and layouts. Save 2 versions — pick the one you like better.",
          example: "Example:\n'Version 1:\n- Name: 'PRIYA' in big bold letters at the top\n- Background: Gradient from purple to blue\n- 3 facts: 'I speak 3 languages | I've read 50 books | I make YouTube videos'\n- Quote: 'Create things that didn't exist this morning'\n- Icons: Book, camera, globe\n- Font: Sans-serif (modern)\n\nVersion 2:\n- Name: 'Priya' in a script font (handwritten style)\n- Background: Solid cream/beige\n- 3 facts: Same but written as bullet points with cute icons\n- Quote: Same but in italics\n- Added: A small illustration of a desk with books\n- Font: Mix of script (for name) + sans-serif (for facts)\n\nWhich I picked: Version 2. It felt more personal and unique. Version 1 looked like a corporate presentation.\n\nLesson: Fonts and colours change the entire mood. Script fonts feel personal. Sans-serif feels professional. Choose based on your message.'"
        },
        {
          step: "Colour & Font Experiment",
          instruction: "Create 3 versions of the SAME poster with different moods. Use the same text: 'SUMMER CAMP 2025 — Register Now!'\n\nVersion A: Fun & Energetic (bright colours, playful font)\nVersion B: Serious & Professional (dark colours, clean font)\nVersion C: Elegant & Minimal (1-2 colours, lots of empty space, thin font)\n\nNotice how the same message feels completely different based on design choices.",
          example: "Example:\n'Version A (Fun & Energetic):\n- Background: Bright yellow\n- Text: Red and orange, bold display font\n- Icons: Sun, beach ball, water splashes\n- Feeling: Exciting! Makes you want to run and play\n- Best for: A camp for young kids\n\nVersion B (Serious & Professional):\n- Background: Dark navy blue\n- Text: White, clean sans-serif font\n- Icons: Calendar, checklist\n- Feeling: Trustworthy, organized\n- Best for: A coding camp or academic program\n\nVersion C (Elegant & Minimal):\n- Background: White with lots of empty space\n- Text: Black, thin elegant font, small size\n- Icons: One thin-line icon (palm tree)\n- Feeling: Premium, exclusive\n- Best for: A luxury retreat or art workshop\n\nConclusion: Design is communication. The same words can feel fun, serious, or elegant depending on colours, fonts, and layout. Always think: Who is my audience? What mood do I want?'"
        }
      ],
      
      tools: [
        {
          name: "Canva.com (Free Account)",
          description: "Canva is a free online design platform with thousands of templates, images, icons, and fonts. You can create posters, presentations, social media posts, videos, and more — no design experience needed.",
          howToUse: "<strong>Step 1:</strong> Go to canva.com and click 'Sign up' (use email or Google account — ask parent if under 13).<br><strong>Step 2:</strong> Click 'Create a design' button (top right). Choose your format: Instagram Post, Poster, Presentation, etc.<br><strong>Step 3:</strong> Browse templates on the left sidebar. Click one you like to load it.<br><strong>Step 4:</strong> Click any element to edit it: Change text by typing, change colours with the colour picker, swap images by dragging new ones.<br><strong>Step 5:</strong> Add elements: Use 'Elements' tab for icons/shapes, 'Text' tab for new text boxes, 'Uploads' for your own images.<br><strong>Step 6:</strong> When done, click 'Share' → 'Download' → choose PNG (for images) or PDF (for printing)."
        }
      ],
      
      homework: [
        {
          question: "Create a Canva design for your favourite book, movie, or game. Make a poster that would make someone want to read/watch/play it. Include: Title, 1-2 sentence description, 1 quote or review, relevant images/icons, a colour scheme that matches the mood. Save it and be ready to share.",
          solution: "Example:\n'Favourite book: 'The Hunger Games'\n\nDesign choices:\n- Title: 'THE HUNGER GAMES' in bold, distressed font (looks like it's been through a fire)\n- Background: Dark grey with subtle fire/ember effects\n- Description: 'In the ruins of America, 24 teens fight to the death — on live TV. One girl volunteers to save her sister. She won't play by their rules.'\n- Quote: 'May the odds be ever in your favour.' — in a gold script font\n- Images: Mockingjay pin icon, flame elements\n- Colours: Black, dark grey, gold, orange (fire)\n- Font: Bold sans-serif for title, clean sans-serif for body, script for quote\n\nWhy these choices: The dark colours match the dystopian mood. Gold/orange represents fire and the mockingjay. The distressed font makes it feel dangerous and intense.\n\nTip: Think about what mood the book/movie creates. Match your design to that mood.'"
        },
        {
          question: "Find 3 real-world examples of good design (a poster, a product package, a website). For each, write: What makes it good? What colours are used? What font style? What's the mood? Then find 1 example of bad design and explain what's wrong with it.",
          solution: "Example:\n'Good Design 1: Apple iPhone box\nWhat makes it good: Super minimal. Just the phone image on white. No clutter. Makes the product feel premium.\nColours: White + silver\nFont: Thin sans-serif (Apple's signature style)\nMood: Clean, expensive, modern\n\nGood Design 2: Netflix app interface\nWhat makes it good: Dark background makes movie posters pop. Large thumbnails. Easy to browse. Personalized recommendations front and center.\nColours: Black background, red accents, colourful movie posters\nFont: Clean sans-serif, easy to read at any size\nMood: Entertainment, excitement, personal\n\nGood Design 3: A local bakery's Instagram\nWhat makes it good: Consistent warm tones. Every photo has the same filter. Pastries look delicious. Text overlays are minimal.\nColours: Warm cream, brown, soft pink\nFont: Script font for headings (feels handmade), sans-serif for details\nMood: Cozy, artisanal, welcoming\n\nBad Design: A school event poster\nWhat's wrong: Too many fonts (4 different ones!). Too many colours (rainbow). Text is tiny and hard to read from a distance. No visual hierarchy — everything is the same size. Too much information crammed in.\nMood: Confusing, overwhelming\nFix: Pick 1-2 fonts, 2-3 colours, make the title BIG, reduce text to essential info only.'"
        },
        {
          question: "Redesign something in your life that has bad design. It could be: your school timetable, a notice board, a menu at a restaurant, or even your own study schedule. Create a new version in Canva. Write 3-4 sentences explaining what you changed and why it's better.",
          solution: "Example:\n'I redesigned my school's notice board.\n\nOriginal problems:\n- Notices were pinned randomly, no order\n- Different paper sizes and colours made it look messy\n- Important notices were buried under old ones\n- Text was small and hard to read from a distance\n\nMy redesign (in Canva):\n- Created a template with sections: 'This Week', 'Upcoming Events', 'Important Notices', 'Achievements'\n- Each section has a coloured header (blue for events, red for important, green for achievements)\n- All notices use the same font size and style\n- Added a date on each notice so old ones can be removed\n- Made the title 'NOTICE BOARD' big and bold at the top\n\nWhy it's better: People can find what they need quickly. Important things stand out. It looks professional instead of chaotic. The colour coding helps you scan for what matters to you.\n\nTip: Good design solves problems. If something is confusing, hard to read, or ugly — it can be redesigned.'"
        }
      ]
    },
    7: {
      theory: `<h4>The One Message Rule</h4>
        <p>A great poster communicates <strong>ONE clear message</strong>. Not five. Not ten. One. If someone looks at your poster for 3 seconds, they should understand the main point. If they need to read every word to get it, the poster has failed.</p>
        
        <h4>Visual Hierarchy — What to Look at First</h4>
        <p>Visual hierarchy means controlling where the viewer's eye goes. You do this with:</p>
        <ul>
          <li><strong>Size:</strong> Bigger = more important. The title should be the biggest element.</li>
          <li><strong>Colour:</strong> Bright colours attract attention. Use them for the most important element.</li>
          <li><strong>Position:</strong> People read top-to-bottom, left-to-right. Put the most important thing at the top.</li>
          <li><strong>Contrast:</strong> Light text on dark background (or vice versa) stands out.</li>
        </ul>
        
        <h4>Negative Space — The Power of Empty Space</h4>
        <p>Negative space is the empty area around your elements. Beginners fill every inch. Professionals leave breathing room. Negative space makes your design look clean, professional, and easy to read.</p>
        
        <h4>The 3-Element Test</h4>
        <p>A good poster has at most 3 key elements:</p>
        <ul>
          <li><strong>Headline:</strong> The main message (big, bold, 5-7 words max)</li>
          <li><strong>Visual:</strong> An image, icon, or graphic that supports the message</li>
          <li><strong>Call to action:</strong> What should the viewer do next? ("Register now," "Learn more," "Join us")</li>
        </ul>
        
        <h4>Common Poster Mistakes</h4>
        <ul>
          <li>Too much text (it's a poster, not an essay)</li>
          <li>Too many fonts (stick to 1-2)</li>
          <li>Low-quality images (pixelated or stretched)</li>
          <li>No clear focal point (everything is the same size)</li>
          <li>Colours that clash or are hard to read</li>
        </ul>
        
        <h4>Real-World Example</h4>
        <p>Think of movie posters. "Jaws" — just a title, a shark below water, and a swimmer above. One message: Something dangerous is lurking beneath. "E.T." — a finger touching between human and alien. One message: Connection. Great posters say more with less.`,
      
      practice: [
        {
          step: "Analyse 5 Posters",
          instruction: "Find 5 posters online or around your neighbourhood (school notices, movie posters, event posters, product ads). For each one, write:\n\n1. What is the ONE message?\n2. What's the first thing your eye goes to?\n3. How many fonts are used?\n4. How much empty space is there?\n5. Rate it 1-5 stars for effectiveness\n\nThis trains your eye to see design, not just content.",
          example: "Example analysis:\n\nPoster 1: School Science Fair notice\n1. Message: Science Fair on March 15 — participate!\n2. First thing: The big 'SCIENCE FAIR' title in blue\n3. Fonts: 3 (title, date, body text — too many)\n4. Empty space: Very little — crammed with info\n5. Rating: 2 stars. Too much text, hard to read from distance.\n\nPoster 2: Movie poster for a superhero film\n1. Message: This movie is epic and action-packed\n2. First thing: The hero standing tall, city behind them\n3. Fonts: 2 (title + credits)\n4. Empty space: Good — dark background, character stands out\n5. Rating: 5 stars. Clear, exciting, makes me want to watch it.\n\nPoster 3: Local tuition class ad\n1. Message: Join our maths/science classes\n2. First thing: Hard to tell — everything is the same size\n3. Fonts: 4+ (looks messy)\n4. Empty space: None — every inch has text\n5. Rating: 1 star. Overwhelming. I wouldn't read it.\n\nTip: The best posters pass the '3-second test' — can you get the message in 3 seconds?"
        },
        {
          step: "Design Your Poster — Paper Sketch First",
          instruction: "Before opening Canva, sketch your poster on paper. This is faster and lets you try multiple ideas quickly.\n\nChoose a topic: A school event, a club you want to start, a cause you care about, or a fake movie.\n\nSketch 3 different layouts. For each, mark:\n- Where the headline goes (biggest text)\n- Where the visual goes (image/icon area)\n- Where the call to action goes\n- Rough colour ideas (write colour names)\n\nPick the best sketch. This is your blueprint for Canva.",
          example: "Example:\n'Topic: School Book Club — 'Join Us!'\n\nSketch 1: Title at top, big book illustration in center, details at bottom.\n- Headline: 'BOOK CLUB' (top, biggest)\n- Visual: Open book with pages flying out (center)\n- CTA: 'Join Us — Every Thursday!' (bottom)\n- Colours: Navy background, gold text, white details\n\nSketch 2: Full-bleed image background, text overlay.\n- Headline: 'READ MORE. THINK DEEPER.' (over image, bold white)\n- Visual: Photo of someone reading in a cozy corner (background)\n- CTA: 'Book Club — Room 204, Thursdays 3 PM' (bottom bar)\n- Colours: Warm photo tones + white text\n\nSketch 3: Minimal, text-only with one icon.\n- Headline: 'BOOK CLUB' (huge, takes up 60% of poster)\n- Visual: One small book icon below title\n- CTA: 'New members welcome. Thursdays, 3 PM, Room 204' (small, bottom)\n- Colours: Cream background, black text, one red accent\n\nBest sketch: Sketch 3. It's bold, clean, and passes the 3-second test. The huge title grabs attention. The red accent adds energy without clutter.'"
        },
        {
          step: "Build Your Poster in Canva",
          instruction: "Open Canva. Create a new 'Poster' design. Following your best sketch:\n\n1. Set the background colour\n2. Add your headline (big, bold, readable from 3 feet away)\n3. Add your visual (image, icon, or illustration)\n4. Add your call to action (smaller but still readable)\n5. Check: Can you understand the message in 3 seconds?\n6. Check: Are there at most 2 fonts?\n7. Check: Is there enough empty space?\n\nDownload as PNG. Share with a friend and ask: 'What's this poster about?' If they answer correctly in 3 seconds, you succeeded.",
          example: "Example:\n'I built Sketch 3 in Canva:\n\n1. Background: Cream/beige (#F5F0E8)\n2. Headline: 'BOOK CLUB' in a bold sans-serif font, black, taking up 60% of the poster. Centered.\n3. Visual: A small book icon in red (#E63945) below the title. Simple, clean.\n4. CTA: 'New members welcome' in smaller text. 'Thursdays, 3 PM, Room 204' below it.\n5. 3-second test: I showed it to my sister. She said: 'It's about a book club.' Correct!\n6. Fonts: 1 (bold sans-serif for everything, just different sizes)\n7. Empty space: Lots of cream space around the text. Feels calm and clean.\n\nFriend test: My friend said 'It looks like a fancy bookstore poster. Very clean.' That's exactly the mood I wanted.\n\nTip: Resist the urge to add more. Less is more. If you're unsure whether to add something — don't.'"
        }
      ],
      
      tools: [
        {
          name: "Canva",
          description: "Free online design tool. You'll use it to build your poster using templates, text, images, and colour tools. The key is restraint — use fewer elements, not more.",
          howToUse: "<strong>Step 1:</strong> Go to canva.com → Create a design → Poster (A3 or 18x24 inches).<br><strong>Step 2:</strong> Start with a blank canvas (not a template — this time, build from scratch to practice).<br><strong>Step 3:</strong> Set your background colour first (Design → Background Colour).<br><strong>Step 4:</strong> Add your headline: Text tab → Add a heading → type your message → choose font → make it BIG.<br><strong>Step 5:</strong> Add visual: Elements tab → search for an icon or upload an image. Place it strategically.<br><strong>Step 6:</strong> Add CTA: Smaller text at the bottom. Make it readable but not competing with the headline.<br><strong>Step 7:</strong> Download: Share → Download → PNG."
        },
        {
          name: "Paper & Pencil (for sketching)",
          description: "Always sketch before you design digitally. Paper is faster for trying multiple layouts. No undo button means you think before you draw — which makes you a better designer.",
          howToUse: "<strong>Step 1:</strong> Get 3 sheets of plain paper and a pencil.<br><strong>Step 2:</strong> On each sheet, sketch a different poster layout. Don't worry about art skills — use boxes and lines to represent elements.<br><strong>Step 3:</strong> Label each sketch: Where is the headline? Where is the visual? Where is the CTA? What colours?<br><strong>Step 4:</strong> Step back and look at all 3. Which passes the 3-second test? Which looks cleanest?<br><strong>Step 5:</strong> Pick the best one. This is your blueprint for Canva. Don't skip this step!"
        }
      ],
      
      homework: [
        {
          question: "Create a poster for a real purpose: a school event, a club you want to start, a social cause, or a product you want to sell. Follow the process: sketch 3 layouts → pick best → build in Canva. Then show it to 3 people and ask: 'What is this poster about?' Write down their answers. Did they get it in 3 seconds?",
          solution: "Example:\n'Purpose: Poster for a 'Coding Club' at school.\n\nProcess:\n1. Sketched 3 layouts: (A) Code symbols as background, (B) Big bold title with laptop icon, (C) Minimal — just title + one line.\n2. Picked B — it was the clearest.\n3. Built in Canva: Black background, green title 'CODING CLUB' in monospace font (looks like code), white laptop icon, 'Every Friday, Room 303' at bottom.\n\n3-person test:\nPerson 1 (classmate): 'It's about a coding club. When does it meet?'\n→ Got the message in 2 seconds. ✓\n\nPerson 2 (teacher): 'Coding club — is this a new thing? The green-on-black looks like a computer screen. Clever.'\n→ Got the message AND appreciated the design choice. ✓\n\nPerson 3 (parent): 'Is this about computers? It's a bit dark, isn't it?'\n→ Got the message but questioned the colour choice. Interesting — dark background might not appeal to everyone.\n\nResult: 3/3 understood the message. 2/3 liked the design. I'd keep the design but maybe add a brighter accent colour to make it more inviting.\n\nLesson: Testing with real people reveals things you didn't notice. Always test your designs.'"
        },
        {
          question: "Find a poster that breaks the 'one message rule' — one that tries to say too many things. Redesign it in Canva with ONE clear message. Before/after: Write 3-4 sentences about what you removed and why the new version is better.",
          solution: "Example:\n'Original poster: School Annual Day notice\nProblems: The poster had 15+ lines of text, 4 different events listed, 3 fonts, clip art from different eras, and contact info for 4 different teachers. It was trying to be an essay, not a poster.\n\nMy redesign:\nONE message: 'ANNUAL DAY — March 20. Be There.'\n- Big bold title: 'ANNUAL DAY'\n- Date: 'March 20' (medium size)\n- CTA: 'Be There.' (with a star icon)\n- Bottom: 'Details inside →' (pointing to where they can get more info)\n- Colours: Deep purple + gold (feels like a celebration)\n- Font: 1 bold sans-serif\n\nWhat I removed: All the event details (dance, drama, music, speeches), teacher contacts, venue map, dress code. These belong in a flyer or email, not a poster.\n\nWhy it's better: The poster's job is to grab attention and create interest. The details can come later. Now people will actually stop and look at it instead of walking past a wall of text.'"
        },
        {
          question: "Create a 'Design Checklist' poster — a poster that teaches others how to make good posters. Include the key rules: One message, Visual hierarchy, Negative space, Max 2 fonts, 3-second test. Make it visually appealing (practice what you preach!).",
          solution: "Example:\n'My Design Checklist Poster:\n\nTitle: 'HOW TO MAKE A GREAT POSTER' (big, bold, at top)\n\n5 rules, each with an icon and 1-line explanation:\n\n1. 🎯 ONE MESSAGE\n'If they need to read everything, you've failed. One clear point.'\n\n2. 👁️ VISUAL HIERARCHY\n'Big = important. Small = details. Control where the eye goes.'\n\n3. 🫧 NEGATIVE SPACE\n'Empty space is not wasted space. It's breathing room.'\n\n4. 🔤 MAX 2 FONTS\n'One for headlines, one for body. Never more.'\n\n5. ⏱️ 3-SECOND TEST\n'Show it to someone for 3 seconds. Can they tell you what it's about?'\n\nDesign choices:\n- Background: White (clean, lets content breathe)\n- Title: Black, bold sans-serif, huge\n- Each rule: Left-aligned icon + text, with lots of space between rules\n- Accent colour: One coral/red for icons and numbers\n- Font: 1 (sans-serif throughout, just different weights)\n\nSelf-check: Does my poster follow its own rules? Yes — one message (how to make good posters), clear hierarchy, lots of negative space, 1 font, passes 3-second test.'"
        }
      ]
    },
    8: {
      theory: `<h4>What Is Visual Storytelling?</h4>
        <p>Visual storytelling is communicating a story using images instead of words. Humans have told stories with pictures for 40,000 years — from cave paintings to comics to Instagram stories. A good visual story makes people <strong>feel</strong> something.</p>
        
        <h4>The 3-Act Structure (in 4 Pictures)</h4>
        <p>Every story has 3 parts:</p>
        <ul>
          <li><strong>Beginning (Setup):</strong> Who is the character? What's their normal world? What do they want?</li>
          <li><strong>Middle (Conflict):</strong> What problem do they face? What goes wrong? What's the challenge?</li>
          <li><strong>End (Resolution):</strong> How do they solve it? What changed? What did they learn?</li>
        </ul>
        <p>With 4 pictures, you can tell a complete story: Picture 1 = Beginning, Pictures 2-3 = Middle (build tension), Picture 4 = End.</p>
        
        <h4>Show, Don't Tell</h4>
        <p>This is the golden rule of visual storytelling. Don't write "She was sad." Show a girl sitting alone in the rain, looking at a broken toy. The viewer <em>feels</em> the sadness without you telling them.</p>
        <ul>
          <li><strong>Tell:</strong> "He was scared" → <strong>Show:</strong> A boy hiding under blankets, eyes wide</li>
          <li><strong>Tell:</strong> "They won!" → <strong>Show:</strong> A team jumping, arms raised, confetti falling</li>
          <li><strong>Tell:</strong> "It was a hot day" → <strong>Show:</strong> Melting ice cream, a dog panting in shade</li>
        </ul>
        
        <h4>Sequence Matters</h4>
        <p>The order of your pictures changes the story. Compare:</p>
        <ul>
          <li>A → B → C → D: A boy wakes up, goes to school, takes a test, celebrates (linear, calm)</li>
          <li>D → A → B → C: A boy celebrates, then we see he woke up, went to school, took a test (mystery — why is he celebrating first?)</li>
        </ul>
        <p>Same pictures, different order, different story. Think about what order creates the most impact.</p>
        
        <h4>Real-World Example</h4>
        <p>Think about comic strips (Peanuts, Calvin & Hobbes) or Instagram story sequences. Each panel advances the story. Nothing is wasted. By the last panel, you feel something — laughter, surprise, or thoughtfulness. That's visual storytelling.`,
      
      practice: [
        {
          step: "Story Analysis — Break Down a 4-Panel Comic",
          instruction: "Find a 4-panel comic strip (Calvin & Hobbes, Peanuts, or any webcomic). Analyse it:\n\n1. Panel 1: What's the setup? Who and where?\n2. Panel 2: What changes? What's the conflict?\n3. Panel 3: What happens next? Does tension build?\n4. Panel 4: What's the resolution? How does it end?\n\nThen identify: What emotion did you feel? What technique did the artist use to create that emotion?",
          example: "Example (Calvin & Hobbes):\n\nPanel 1: Calvin sits at his desk, staring at homework. Hobbes sits beside him.\nSetup: Calvin is a student, facing homework (relatable situation).\n\nPanel 2: Calvin says: 'I wonder if I could sell my homework to the highest bidder.'\nConflict: Calvin doesn't want to do homework. He's looking for a shortcut.\n\nPanel 3: Hobbes says: 'Who would buy someone else's homework?'\nTension builds: Hobbes is questioning the idea — will Calvin come up with a worse plan?\n\nPanel 4: Calvin: 'The lowest bidder. They'd pay anything to avoid doing it.'\nResolution: Punchline! Calvin's logic is absurd but funny. The twist is that the least capable person would pay the most.\n\nEmotion: Laughter. The technique is the 'twist ending' — the last panel subverts expectations.\n\nLesson: Great 4-panel stories set up expectations in panels 1-3, then surprise you in panel 4."
        },
        {
          step: "Tell a Story in 4 Photos",
          instruction: "Using your phone camera (or Canva's image library), create a 4-photo story. Choose a simple narrative:\n\n- 'My Morning Routine'\n- 'The Lost Pencil Mystery'\n- 'A Plant's Life Cycle'\n- 'Making Maggi Noodles'\n\nRules:\n- No words or text in the photos\n- Each photo must advance the story\n- Someone should understand the story just by looking at the sequence\n- Use 'show don't tell' — convey emotions through visuals",
          example: "Example story: 'Making Maggi Noodles'\n\nPhoto 1 (Setup): A packet of Maggi on the kitchen counter, with a pot beside it. Clean, simple shot.\n→ Viewer understands: Someone is about to cook Maggi.\n\nPhoto 2 (Action): Water boiling in the pot, steam rising. The Maggi packet is torn open, noodles visible.\n→ Tension: Will they do it right? The boiling water adds energy.\n\nPhoto 3 (Climax): Noodles in the water, masala being sprinkled from above (captured mid-air). Stirring with a fork.\n→ Peak action: This is the most visually interesting moment.\n\nPhoto 4 (Resolution): A steaming bowl of Maggi on a table, next to a cup of chai. A hand reaching for it.\n→ Satisfaction: The story is complete. The viewer can almost taste it.\n\nWhat I showed without words: Cooking process, anticipation, satisfaction.\nWhat I didn't need: 'I made Maggi' text. The photos tell the story.\n\nTip: Think like a filmmaker. Each photo is a 'shot.' What angle, what distance, what focus tells the story best?"
        },
        {
          step: "Create Your 4-Panel Story in Canva",
          instruction: "Open Canva. Create an 'Instagram Story' or 'Poster' design. Arrange your 4 photos in a grid (2x2) or vertical sequence.\n\nAdd:\n- A title at the top (short, catchy — 3-5 words)\n- Minimal text on photos only if absolutely needed\n- Consistent filter/colour tone across all 4 photos\n\nExport and share with a friend. Ask: 'What story do you see?' If they describe something close to your intended story, you succeeded.",
          example: "Example:\n'My Canva layout:\n\nFormat: Instagram Story (vertical)\nTitle: 'THE PERFECT CUP' at the top in a clean white font\n\n2x2 grid:\nTop-left: Empty mug on a table (warm lighting)\nTop-right: Tea bag dropping into the mug (captured mid-air)\nBottom-left: Hot water being poured (steam visible)\nBottom-right: Perfect cup of tea, honey being drizzled in\n\nDesign choices:\n- All photos have warm, golden filter (consistent mood)\n- Background: Dark wood texture\n- Title font: Serif (elegant, matches the cozy mood)\n- No text on individual photos\n\nFriend test: 'It looks like a story about making the perfect cup of tea. It feels cozy and calming. I can almost smell it.'\n\nSuccess! They got the story and the mood. The consistent warm filter made it feel like a cohesive story, not random photos.\n\nTip: Consistency in colour/filter makes separate photos feel like chapters of the same story.'"
        }
      ],
      
      tools: [
        {
          name: "Phone Camera",
          description: "Your phone camera is a storytelling tool. The key is to think before you shoot — what story are you telling? What angle, lighting, and composition best convey that story?",
          howToUse: "<strong>Step 1:</strong> Plan your story first. Write down the 4 panels: Beginning, Middle 1, Middle 2, End.<br><strong>Step 2:</strong> For each panel, think: What should the photo show? What emotion should it convey?<br><strong>Step 3:</strong> Shoot each photo. Try different angles: eye level, from above, from below, close-up.<br><strong>Step 4:</strong> Review your photos. Do they tell the story in order? Can someone understand without words?<br><strong>Step 5:</strong> If a photo doesn't work, reshoot. Don't settle — the story depends on each image.<br><strong>Step 6:</strong> Keep the same lighting/filter across all 4 photos for consistency."
        },
        {
          name: "Canva (for assembling the story)",
          description: "Use Canva to arrange your 4 photos into a polished visual story. Add a title, consistent styling, and export for sharing.",
          howToUse: "<strong>Step 1:</strong> Open Canva → Create a design → Choose 'Instagram Story' or 'Poster.'<br><strong>Step 2:</strong> Upload your 4 photos (Uploads tab → Upload files).<br><strong>Step 3:</strong> Arrange them in a 2x2 grid or vertical sequence. Make them all the same size.<br><strong>Step 4:</strong> Add a title at the top: Short, catchy, 3-5 words.<br><strong>Step 5:</strong> Apply a consistent filter to all photos (click a photo → Filters → choose one).<br><strong>Step 6:</strong> Download as PNG. Share with friends for feedback."
        }
      ],
      
      homework: [
        {
          question: "Tell the story of your school day in 4 photos. No words allowed. The photos should show: arrival, a class moment, break time, and going home. Arrange them in Canva with a title. Show it to someone who wasn't there — can they guess what happened in each photo?",
          solution: "Example:\n'My 4-panel school day story:\n\nPhoto 1 (Arrival): School gate from below, looking up. My backpack visible in frame. Morning light.\n→ Viewer guess: 'Student arriving at school in the morning.'\n\nPhoto 2 (Class moment): Close-up of my notebook with a diagram I drew. Pencil beside it. Blurred classroom in background.\n→ Viewer guess: 'Drawing or taking notes in class. Looks like a science diagram.'\n\nPhoto 3 (Break time): My lunch box open, showing the food. Friends' hands reaching in (faces not shown). Playground in background.\n→ Viewer guess: 'Eating lunch with friends during break. Looks fun.'\n\nPhoto 4 (Going home): School bag on my lap, viewed from inside a bus/auto. Window showing the road outside. Late afternoon light.\n→ Viewer guess: 'Going home after school. Tired but satisfied.'\n\nFeedback from friend: 'I can see your whole day! The lighting changes from morning to afternoon — that's clever. Photo 3 makes me hungry.'\n\nWhat worked: Consistent perspective (first-person view). Natural lighting that changes through the day. No faces needed — hands and objects tell the story.\n\nLesson: You don't need faces to tell a human story. Objects, hands, and environments can convey emotion.'"
        },
        {
          question: "Pick a fairy tale or story you know well (Cinderella, Harry Potter, Lion King, etc.). Tell it in exactly 4 images using Canva's elements library (icons, illustrations, shapes). No text except the title. Then write 3-4 sentences: What was hardest about condensing the story? What did you choose to include and exclude?",
          solution: "Example:\n'Story: Cinderella\n\nPanel 1 (Setup): A girl sweeping the floor, looking sad. A castle in the distance. Grey tones.\n→ Shows: Cinderella's unhappy life, her dream (the castle).\n\nPanel 2 (Change): A fairy godmother figure with a wand, sparkles around a dress. Colour returns.\n→ Shows: The magical transformation. Things are about to change.\n\nPanel 3 (Climax): A clock showing midnight. A glass shoe on stairs. Warm colours fading to cool.\n→ Shows: The urgency, the magic ending, the clue left behind.\n\nPanel 4 (Resolution): A prince holding a glass shoe, finding the girl. Both smiling. Bright, warm colours.\n→ Shows: Happy ending. The shoe reunited with its owner.\n\nWhat was hardest: Choosing which moments to include. Cinderella has so many scenes — the ball, the dancing, the stepsisters. I had to pick only the 4 most important turning points.\n\nWhat I included: The sadness (setup), the transformation (turning point), midnight (climax), the reunion (resolution).\n\nWhat I excluded: The stepsisters, the ball itself, the fairy godmother's full scene. These are details — the core story works without them.\n\nLesson: Every story has a skeleton. Find the 4 essential moments and everything else is optional.'"
        },
        {
          question: "Create a 'Before & After' visual story in 4 panels showing a transformation. It could be: a messy room → clean room, a seed → a flower, a sad person → happy person, an empty wall → decorated room. Use Canva. Focus on showing the change visually, not with words.",
          solution: "Example:\n'Story: Empty Wall → Art Gallery\n\nPanel 1 (Before): A plain white wall in a room. Bare, boring. A person standing in front of it, looking bored.\n→ Shows: The starting point. Empty potential.\n\nPanel 2 (Process 1): The same wall, but now there are pencil marks and measurements. Paint cans on the floor. The person is painting.\n→ Shows: Work in progress. The transformation has begun.\n\nPanel 3 (Process 2): The wall is half done. Some frames are hung. A few artworks are up. The room is starting to look interesting.\n→ Shows: Progress. Building anticipation.\n\nPanel 4 (After): The same wall, now covered with colourful artworks, framed prints, and fairy lights. The person stands back, arms crossed, smiling proudly.\n→ Shows: The transformation complete. Pride and satisfaction.\n\nVisual techniques:\n- Same angle for all 4 panels (so the change is obvious)\n- Colour progression: Grey → muted → warm → vibrant\n- The person's body language changes: bored → focused → hopeful → proud\n\nWhat I learned: Showing transformation is powerful because people can see the journey. Before/after stories are satisfying because they show effort leading to results.\n\nTip: Keep the camera angle the same across all panels. This makes the change more dramatic because the viewer can directly compare.'"
        }
      ]
    },
    9: {
      theory: `<h4>The #1 Rule: One Idea Per Slide</h4>
        <p>Most presentations fail because people cram 10 ideas onto one slide. The audience reads instead of listening. Here's the rule: <strong>One slide = One idea.</strong> If you have 5 ideas, use 5 slides. More slides with less text is always better than fewer slides with more text.</p>
        
        <h4>Speak More, Write Less</h4>
        <p>Your slides are <strong>not</strong> your script. They're visual support. The audience should listen to YOU, not read the screen. Use slides for:</p>
        <ul>
          <li>A big number or statistic</li>
          <li>A powerful image</li>
          <li>A short quote (5-7 words)</li>
          <li>A simple diagram</li>
        </ul>
        <p>Everything else comes from your mouth, not the slide.</p>
        
        <h4>Big Text, Always</h4>
        <p>If someone in the back row can't read your slide, it's too small. Use at least <strong>36pt font</strong> for body text and <strong>60pt+</strong> for headings. This forces you to write less — which is a good thing.</p>
        
        <h4>The Structure of a Great Presentation</h4>
        <ul>
          <li><strong>Hook (1 slide):</strong> Start with something that grabs attention — a question, a shocking stat, a story, a picture.</li>
          <li><strong>Problem (1-2 slides):</strong> What's the issue? Why should the audience care?</li>
          <li><strong>Solution (2-3 slides):</strong> Your idea, your research, your answer. One idea per slide.</li>
          <li><strong>Conclusion (1 slide):</strong> Summarize in one sentence. End with a call to action or a memorable line.</li>
        </ul>
        
        <h4>Nerves Are Normal</h4>
        <p>Every speaker gets nervous — even professionals. The trick isn't to eliminate nerves; it's to <strong>prepare so well</strong> that you can speak even when nervous. Here's how:</p>
        <ul>
          <li>Know your first 30 seconds by heart (this gets you past the hardest part)</li>
          <li>Practice standing up, not sitting</li>
          <li>Breathe slowly before you start (4 seconds in, 4 seconds out)</li>
          <li>Look at friendly faces, not at the floor or your phone</li>
        </ul>
        
        <h4>Real-World Example</h4>
        <p>Think about your favourite teacher. The good ones don't read from slides. They have simple slides — maybe a picture or a keyword — and they <em>talk</em>. They tell stories. They ask questions. They make eye contact. That's what makes them great. That's what you'll learn to do.`,
      
      practice: [
        {
          step: "Analyse a Bad Presentation (and Fix It)",
          instruction: "Think of a presentation you've seen (in class, at assembly, or online) that was boring or hard to follow. Write down what was wrong with it. Then redesign it:\n\n1. What was the topic?\n2. What was wrong? (Too much text? Reading from slides? No structure?)\n3. Rewrite it using the One Idea Per Slide rule\n4. Create a new slide outline: Hook → Problem → Solution → Conclusion",
          example: "Example:\n'Bad presentation: Classmate's project on 'Solar Energy'\n\nWhat was wrong:\n- Slide 1 had the title + their name + school name + date + teacher's name (5 lines before the content even starts)\n- Slide 2 had 15 bullet points about what solar energy is\n- Slide 3 had a paragraph copied from Wikipedia\n- They read every word from the slides\n- No images, no structure, no hook\n- 12 slides, all text, 20 minutes of boredom\n\nMy redesign:\nSlide 1 (Hook): A picture of the Sun with one line: 'This powers the entire Earth.'\nSlide 2 (Problem): 'We're running out of fossil fuels.' + a simple graph showing declining reserves\nSlide 3 (Solution 1): 'Solar panels convert sunlight to electricity.' + image of panels on a roof\nSlide 4 (Solution 2): 'India gets 300 sunny days per year.' + map of India with sun icons\nSlide 5 (Conclusion): 'The future is above our heads.' + call to action\n\n5 slides instead of 12. More impact. The speaker actually has something to SAY instead of reading.\n\nLesson: Fewer slides, more story. Let the slides support you, not replace you.'"
        },
        {
          step: "Create a 5-Slide Presentation",
          instruction: "Choose a topic you care about (a hobby, a social issue, a cool science fact, a book recommendation). Create a 5-slide presentation in Canva or Google Slides:\n\nSlide 1: Hook — something that grabs attention\nSlide 2: Problem or question\nSlide 3: Your answer or main point\nSlide 4: Supporting evidence or example\nSlide 5: Conclusion — one memorable line\n\nRules: Max 10 words per slide. Use images. Big fonts (36pt+). No paragraphs.",
          example: "Example topic: 'Why Students Should Learn Coding'\n\nSlide 1 (Hook):\nImage: A robot arm playing chess against a child\nText: 'This will be your coworker.'\n(5 words + powerful image = instant attention)\n\nSlide 2 (Problem):\nText: '50% of today's jobs will be automated by 2050.'\nImage: Simple graph showing automation growth\n(1 sentence that creates urgency)\n\nSlide 3 (Main point):\nText: 'Coding is the new literacy.'\nImage: Side-by-side — a book and a code editor\n(One clear idea: coding is as fundamental as reading)\n\nSlide 4 (Evidence):\nText: '12-year-olds have built apps used by millions.'\nImage: Screenshots of apps made by young coders\n(Proof that age is not a barrier)\n\nSlide 5 (Conclusion):\nText: 'Don't just use technology. Create it.'\nImage: A student at a laptop, looking confident\n(Call to action + aspirational)\n\nTotal: 5 slides, under 10 words each, powerful images, clear story arc.\n\nTip: Write your speaker notes separately — what you'll SAY for each slide. The slides are just the visuals.'"
        },
        {
          step: "Present to Someone — Record Yourself",
          instruction: "Present your 5-slide presentation to a family member. Use your phone to record yourself (video or audio). After presenting, watch/listen to the recording and evaluate:\n\n1. Did you speak clearly?\n2. Did you read from the slides or speak naturally?\n3. Was your pace too fast or too slow?\n4. Did you say 'um' or 'uh' a lot?\n5. Did you make eye contact with your audience?\n\nWrite a self-evaluation (3-4 sentences). What will you improve next time?",
          example: "Example self-evaluation:\n'I presented my coding presentation to my mom and recorded it.\n\nWhat went well:\n- I knew my first 30 seconds perfectly. I started confidently: 'Did you know that by the time I graduate, half the jobs will be done by machines?' Mom looked up immediately — good hook.\n- I didn't read from the slides. I used them as visual support and spoke naturally.\n- My pace was good — not too fast.\n\nWhat needs improvement:\n- I said 'um' about 8 times. I didn't realize it until I watched the recording. Next time, I'll pause instead of saying 'um.' A pause feels long to me but sounds thoughtful to the audience.\n- I looked at the laptop screen more than at mom. I need to look at people, not my slides.\n- My conclusion was rushed. I should practice the last line so it lands with impact.\n\nScore: 3.5/5. Better than I expected, but clear areas to improve.\n\nLesson: Recording yourself is uncomfortable but incredibly useful. You notice things you'd never catch otherwise.'"
        }
      ],
      
      tools: [
        {
          name: "Canva Presentations",
          description: "Canva has a presentation mode with beautiful templates. It's great for creating visually appealing slides with minimal text and strong images.",
          howToUse: "<strong>Step 1:</strong> Go to canva.com → Create a design → Presentation (16:9).<br><strong>Step 2:</strong> Choose a template or start blank. Pick one with clean layouts.<br><strong>Step 3:</strong> Create 5 slides: Hook, Problem, Solution, Evidence, Conclusion.<br><strong>Step 4:</strong> For each slide: Add ONE big idea. Use 36pt+ font. Add a supporting image.<br><strong>Step 5:</strong> Use 'Presenter view' to present: Share → Present → your slides show full screen while you see notes.<br><strong>Step 6:</strong> Practice with the presentation mode before the real thing."
        },
        {
          name: "Google Slides",
          description: "Google's free presentation tool. Similar to PowerPoint but cloud-based. Great for collaboration and easy sharing.",
          howToUse: "<strong>Step 1:</strong> Go to slides.google.com → Click '+' to create a new presentation.<br><strong>Step 2:</strong> Choose a simple theme (or blank). Avoid busy templates.<br><strong>Step 3:</strong> Create your 5 slides. One idea per slide. Big text. Strong images.<br><strong>Step 4:</strong> Add speaker notes: Click 'Click to add notes' below each slide. Write what you'll SAY (not what's on the slide).<br><strong>Step 5:</strong> Present: Click the 'Present' button (top right). Use 'Presenter view' to see your notes while the audience sees only slides.<br><strong>Step 6:</strong> Practice: Present to yourself first, then to a friend or family member."
        }
      ],
      
      homework: [
        {
          question: "Create a 7-slide presentation about 'Something I'm Really Good At.' It could be a sport, a game, a skill, a hobby. Follow the structure: Hook → Why it matters → How you learned → Tips for beginners → A cool fact → Challenges you faced → Conclusion. Present it to your family. Get their feedback.",
          solution: "Example:\n'Topic: 'I'm Really Good at Making Paper Airplanes'\n\nSlide 1 (Hook): Image of 10 paper airplanes flying. Text: 'I can make these fly 30 metres.'\n\nSlide 2 (Why it matters): Text: 'Paper airplane design teaches aerodynamics — the same science that builds real aircraft.'\nImage: Side-by-side of paper plane and real plane.\n\nSlide 3 (How I learned): Text: '47 YouTube videos. 200+ failed attempts. 1 perfect design.'\nImage: Timeline showing progression from crumpled paper to sleek design.\n\nSlide 4 (Tips): Text: 'The secret is in the wings. Symmetry = stability.'\nImage: Diagram showing wing angles.\n\nSlide 5 (Cool fact): Text: 'The world record paper airplane flew 69.14 metres. That's 7 football fields.'\nImage: Football field comparison.\n\nSlide 6 (Challenges): Text: 'My biggest challenge? Wind. Even a slight breeze changes everything.'\nImage: Paper airplane being blown off course.\n\nSlide 7 (Conclusion): Text: 'Anyone can fly a plane. A real pilot builds one.'\nImage: Me holding my best design, smiling.\n\nFamily feedback:\nDad: 'I didn't know you were this passionate about it. The 47 videos stat was impressive.'\nMom: 'Slide 5 was my favourite — the football field comparison made me go wow.'\nBrother: 'Can you teach me? The tips slide was cool.'\n\nScore: 4/5. Good engagement. Need to work on not rushing through slides 3-4.'"
        },
        {
          question: "Watch 2 presentation skills videos on YouTube (search: 'how to give a good presentation for students'). Write down 3 tips from the videos that you didn't already know. Then practice ONE of those tips in your next class presentation or even in a conversation.",
          solution: "Example:\n'Videos watched:\n1. '5 Presentation Tips Every Student Should Know' (5 min)\n2. 'How to Stop Saying Um' (8 min)\n\n3 tips I didn't know:\n\nTip 1: 'The power pause.' Instead of filling silence with 'um,' just pause. A 2-second pause feels eternal to you but makes you look thoughtful and confident to the audience. Practice: Read a paragraph aloud and replace every 'um' with a pause.\n\nTip 2: 'Anchor your feet.' Nervous speakers sway or shift weight. Plant your feet shoulder-width apart. Move intentionally (step forward for emphasis, step to the side for a new point). Don't wander.\n\nTip 3: 'The rule of three.' People remember things in threes. Structure your key points as 3 items. 'Today I'll tell you about 3 things...' The audience's brain is wired for this pattern.\n\nWhat I practiced: The power pause. In my next class presentation, I consciously paused instead of saying 'um.' It felt weird — like an eternity of silence. But my friend said I looked more confident. The pause works.\n\nLesson: Small techniques make a big difference. The best part? They're learnable. Anyone can improve with practice.'"
        },
        {
          question: "Create a 'Presentation Checklist' — a one-page reference you can use before every presentation. Include checks for: slide design, content structure, practice, body language, and nerves. Design it in Canva so it looks good enough to print and stick on your wall.",
          solution: "Example:\n'MY PRESENTATION CHECKLIST\n\nBEFORE — Slide Design ☐\n☐ One idea per slide\n☐ Max 10 words per slide\n☐ Font size 36pt+ (readable from back of room)\n☐ Images on every slide (no text-only slides)\n☐ Consistent colours and fonts throughout\n☐ Max 2 fonts total\n\nBEFORE — Content Structure ☐\n☐ Hook in first 10 seconds (question, stat, or story)\n☐ Clear problem → solution flow\n☐ Rule of three (key points in groups of 3)\n☐ Strong conclusion with call to action\n☐ Speaker notes written (what I'll SAY, not read)\n\nBEFORE — Practice ☐\n☐ Presented aloud at least 3 times\n☐ Timed myself (within time limit?)\n☐ Recorded myself and watched it\n☐ Presented to at least 1 person for feedback\n☐ Know my first 30 seconds by heart\n\nDURING — Body Language ☐\n☐ Feet planted (no swaying)\n☐ Eye contact with friendly faces\n☐ Hands visible (not in pockets)\n☐ Stand tall, shoulders back\n☐ Move intentionally, not nervously\n\nDURING — Nerves ☐\n☐ Breathing: 4 seconds in, 4 seconds out\n☐ It's okay to pause (don't fill with 'um')\n☐ Mistakes are fine — just keep going\n☐ The audience wants me to succeed\n☐ Smile — it relaxes you and the audience\n\nDesign: Dark background, white text, checkboxes in accent colour. One page. Laminated and stuck on my wall.'"
        }
      ]
    },
    10: {
      theory: `<h4>What Is a Digital Story?</h4>
        <p>A digital story combines <strong>narrative + visuals + design</strong> into one shareable piece. It could be a personal story, a fictional tale, a documentary-style piece, or a presentation with a narrative arc. You've already learned all the skills needed: writing (prompts), design (Canva), visual storytelling (4-panel stories), and presentations.</p>
        
        <h4>The Project Workflow</h4>
        <p>Every creative project follows a workflow:</p>
        <ul>
          <li><strong>1. Idea:</strong> What story do you want to tell? Who is it for?</li>
          <li><strong>2. Script/Outline:</strong> Write the story in text first. Don't design yet.</li>
          <li><strong>3. Visuals:</strong> Create or collect images, icons, and graphics.</li>
          <li><strong>4. Design:</strong> Put it all together in Canva. Layout, colours, fonts.</li>
          <li><strong>5. Review:</strong> Show it to someone. Get feedback. Improve.</li>
          <li><strong>6. Export & Share:</strong> Download in the right format. Share it with the world.</li>
        </ul>
        
        <h4>Why Write First, Design Later?</h4>
        <p>Beginners open Canva first and start designing. This is a mistake. Without a clear story, your design will be pretty but empty. Always write your story first — on paper or in a notes app. Only open Canva when you know exactly what you're creating.</p>
        
        <h4>Drafting — Embrace the Ugly First Version</h4>
        <p>Your first draft will be bad. That's normal. Every professional's first draft is bad. The difference between amateurs and professionals is that professionals <strong>keep improving</strong>. Don't aim for perfect — aim for <em>done</em>. Then make it better.</p>
        
        <h4>Export Formats</h4>
        <ul>
          <li><strong>PNG:</strong> Best for images with text. High quality. Larger file size.</li>
          <li><strong>JPG:</strong> Best for photos. Smaller file size. Slightly lower quality.</li>
          <li><strong>PDF:</strong> Best for printing. Keeps fonts and layout intact.</li>
          <li><strong>MP4:</strong> If your story has animation or video.</li>
          <li><strong>Canva Website:</strong> You can publish directly as a webpage from Canva.</li>
        </ul>
        
        <h4>Real-World Example</h4>
        <p>Think about your favourite Instagram page or YouTube channel. Every post/video went through this exact workflow: Idea → Script → Visuals → Design → Review → Publish. The creator didn't just open an app and start — they planned. Now you have the same workflow. Use it.`,
      
      practice: [
        {
          step: "Choose Your Story & Write the Outline",
          instruction: "Decide on your digital story topic. Options:\n- 'My Journey Learning a New Skill' (personal)\n- 'A Day in My Life' (documentary style)\n- 'The Story Behind My Favourite Object' (narrative)\n- 'If I Could Change One Thing About the World' (persuasive)\n\nWrite an outline on paper:\n1. Hook: How will you grab attention?\n2. Beginning: Set the scene\n3. Middle: The main content (3 key points)\n4. End: Conclusion + call to action\n\nWrite 1-2 sentences for each section. Don't design yet — just words.",
          example: "Example:\n'Topic: 'My Journey Learning to Cook'\n\nHook: '6 months ago, I burned water. Today, I cook dinner for my family every Sunday.'\n\nBeginning: I was always scared of the kitchen. Fire, sharp knives, hot oil — everything felt dangerous. I'd only ever made Maggi noodles. That was my entire cooking repertoire.\n\nMiddle — 3 key points:\n1. The first dish I learned (egg bhurji) — my mom stood next to me, guiding every step. I used too much salt, but it was edible. That felt like a victory.\n2. The first time I cooked alone (dal) — I forgot to soak the dal and it took 2 hours to cook. But I learned: preparation matters.\n3. The first meal I made for guests (paneer butter masala) — my aunt said 'Who made this? It's restaurant quality!' That moment changed everything.\n\nEnd: Cooking taught me that fear comes from not knowing. Once you learn the basics, the kitchen becomes a place of creativity, not fear. Start small. Burn things. Learn. Try again.\n\nCall to action: 'What's one thing you're scared of? Learn the basics. Start small. You might discover a skill you never knew you had.'\n\nTotal word count: ~200 words. This is my script. Now I can design.'"
        },
        {
          step: "Create the Visuals",
          instruction: "For your digital story, create or collect visuals for each section:\n\n- Hook: 1 attention-grabbing image\n- Beginning: 1 image that sets the scene\n- Middle: 3 images (one for each key point)\n- End: 1 closing image\n\nOptions:\n- Take your own photos (most authentic)\n- Use Canva's free image library\n- Use icons/illustrations for a cleaner look\n\nSave all images in one folder. Name them clearly: 'hook.png', 'beginning.png', etc.",
          example: "Example:\n'Visuals for 'My Journey Learning to Cook':\n\nHook image: A burnt pot with smoke rising (I actually recreated this — deliberately burned some bread for the photo). Funny and attention-grabbing.\n\nBeginning image: A simple Maggi noodle packet on a counter. Represents my starting point.\n\nMiddle image 1: A plate of egg bhurji (I took a photo of the one I made). Slightly messy — shows it was homemade.\n\nMiddle image 2: A pressure cooker with dal spilling over. Shows the learning moment.\n\nMiddle image 3: A beautiful plate of paneer butter masala, garnished. Shows the transformation.\n\nEnd image: Me in the kitchen, smiling, holding a plate of food. Personal and warm.\n\nDesign choices:\n- All photos taken by me (authentic)\n- Consistent warm lighting (kitchen light, no filters)\n- Shot from above (flat lay style) for food photos\n- The burnt pot and final plate create a visual contrast (before/after)\n\nTip: Real photos > stock photos. Your story is personal — the visuals should be too.'"
        },
        {
          step: "Assemble in Canva & Export",
          instruction: "Open Canva. Choose 'Instagram Story' (for a scrollable story) or 'Presentation' (for a slideshow). Build your digital story:\n\n1. Slide 1: Hook image + hook text (big, bold)\n2. Slide 2: Beginning image + setup text\n3-5. Slides 3-5: Middle images + key point text\n6. Slide 6: End image + conclusion + call to action\n\nDesign rules:\n- Consistent fonts (max 2)\n- Consistent colour scheme\n- Big readable text\n- Images take up at least 50% of each slide\n\nExport: Download as PNG (for sharing on social media) or PDF (for printing/presenting).",
          example: "Example:\n'Canva assembly:\n\nFormat: Instagram Story (vertical, scrollable)\n\nSlide 1 (Hook):\n- Background: The burnt pot photo (full bleed)\n- Text overlay: '6 MONTHS AGO, I BURNED WATER' in bold white text with black shadow for readability\n- Font: Bold sans-serif, 60pt\n\nSlide 2 (Beginning):\n- Background: Warm cream colour\n- Image: Maggi packet (centered, medium size)\n- Text: 'My entire cooking skill: Maggi. That was it.'\n- Font: Clean sans-serif, 36pt\n\nSlides 3-5 (Middle):\n- Each slide: Photo on top (60% of slide), text below (40%)\n- Consistent layout across all 3\n- Text: 1-2 sentences per slide\n- Added subtle page numbers (1/3, 2/3, 3/3)\n\nSlide 6 (End):\n- Background: My kitchen photo (slightly darkened)\n- Text: 'Start small. Burn things. Learn. Try again.'\n- Call to action: 'What will you start today?'\n\nExport: Downloaded as PNG (high quality). Shared on Instagram Stories and sent to family WhatsApp group.\n\nResult: 15 people viewed it. 8 replied with messages like 'This is so relatable!' and 'You inspired me to start cooking!'\n\nLesson: A digital story combines everything — writing, design, photography, storytelling. And it can actually inspire people.'"
        }
      ],
      
      tools: [
        {
          name: "Canva (Final Assembly)",
          description: "Canva is where everything comes together — your story, your visuals, your design skills. Use it to assemble your digital story into a polished, shareable piece.",
          howToUse: "<strong>Step 1:</strong> Open Canva → Create a design → Choose format (Instagram Story for scrollable, Presentation for slideshow).<br><strong>Step 2:</strong> Upload all your images (Uploads tab → Upload files).<br><strong>Step 3:</strong> Build slide by slide: Add image first, then text overlay. Follow your outline.<br><strong>Step 4:</strong> Apply consistent design: Same fonts, same colour scheme, same layout pattern across slides.<br><strong>Step 5:</strong> Review: Go through all slides. Does the story flow? Is text readable? Are images high quality?<br><strong>Step 6:</strong> Export: Share → Download → Choose PNG (social media) or PDF (presenting/printing)."
        },
        {
          name: "Phone Camera (for original photos)",
          description: "Use your phone to take original photos for your digital story. Real photos make your story authentic and personal — much more powerful than stock images.",
          howToUse: "<strong>Step 1:</strong> Plan your shots. Look at your outline — what image does each section need?<br><strong>Step 2:</strong> Use natural light (near a window or outdoors). Avoid flash — it looks harsh.<br><strong>Step 3:</strong> Shoot from multiple angles. Take 5-10 photos of each subject. Pick the best one later.<br><strong>Step 4:</strong> Keep the background clean. Remove clutter before shooting.<br><strong>Step 5:</strong> Transfer photos to Canva: Email them to yourself, use Google Photos, or upload directly from phone.<br><strong>Step 6:</strong> Edit lightly if needed: Canva has basic photo editing (brightness, contrast, crop)."
        }
      ],
      
      homework: [
        {
          question: "Complete your digital story project. Follow the full workflow: Outline → Visuals → Design → Review → Export. Share it with at least 3 people and collect their feedback. Write a reflection (5-6 sentences): What went well? What was harder than expected? What would you do differently? What did you learn about the creative process?",
          solution: "Example reflection:\n'I created a digital story called 'My Journey Learning to Cook.' The full workflow took me about 3 hours total.\n\nWhat went well: Writing the outline first was a game-changer. In the past, I'd open Canva and just start designing, which led to a messy result. This time, I knew exactly what I was creating before I opened the app. The assembly in Canva was fast because I had a plan.\n\nWhat was harder than expected: Taking good photos. I thought I could just snap pictures with my phone, but the lighting was bad in my kitchen. I had to retake the food photos near a window. Also, choosing which details to include in the text was hard — I wanted to tell everything, but less is more.\n\nWhat I'd do differently: I'd spend more time on the hook. My first hook was 'I learned to cook last year.' Boring. I changed it to '6 months ago, I burned water.' Much better. I should have thought of that from the start.\n\nWhat I learned: The creative process is iterative. My first draft was ugly. My second draft was okay. My third draft was good. Each round of feedback made it better. The key is to not expect perfection on the first try.\n\nFeedback summary:\n- Friend: 'The burnt pot photo made me laugh. Great hook.'\n- Mom: 'I'm proud of you. The story is honest and inspiring.'\n- Teacher: 'Good use of before/after contrast. Work on font consistency.'"
        },
        {
          question: "Peer review: Exchange your digital story with a classmate. Review theirs using this checklist: (1) Does the hook grab attention in 3 seconds? (2) Is there a clear beginning, middle, and end? (3) Are the visuals consistent and high quality? (4) Is text readable and minimal? (5) Does the ending leave an impact? Give 2 compliments and 1 suggestion for improvement.",
          solution: "Example peer review:\n'Reviewing Arjun's digital story: 'How I Built My First PC'\n\nChecklist:\n1. Hook grab attention? ✓ Yes — 'I was 12 when I opened my first computer case' made me curious immediately.\n2. Clear beginning, middle, end? ✓ Yes — Started with curiosity, showed the building process, ended with pride.\n3. Visuals consistent? Mostly ✓ — Photos are all from his perspective (looking down at hands). Consistent style. But one image was blurry — the motherboard close-up.\n4. Text readable and minimal? ✓ Yes — Short sentences. Big font. I could read everything easily.\n5. Impactful ending? ✓ Yes — 'If a 12-year-old can build a PC, what can you build?' Great call to action.\n\n2 Compliments:\n- The step-by-step photos of the building process were excellent. I could follow along. The close-ups of connecting cables were especially helpful.\n- The personal voice was engaging. It felt like Arjun was talking to me, not presenting at me.\n\n1 Suggestion:\n- The blurry motherboard photo (slide 4) distracted from an otherwise great visual story. I'd retake it with better focus or use a different angle. Maybe zoom out to show the whole board instead of a close-up.\n\nOverall: 4.5/5. Strong story, good visuals, clear structure. The blurry photo is the only issue.'"
        },
        {
          question: "Create a 'Skills I Learned' summary page — a single Canva design that lists every skill you've learned in the Explorer level so far (Sessions 1-10). For each skill, write one sentence about how you'll use it in the future. This becomes a page in your personal website project.",
          solution: "Example:\n'MY EXPLORER LEVEL SKILLS\n\n1. Future Skills Thinking 💡\nI learned to ask 'how' and 'why' instead of just memorizing. I'll use this in every subject — understanding beats memorizing.\n\n2. Computer & Internet Basics 🖥️\nI learned how computers work and how the internet sends data. I'll use this to troubleshoot problems and understand technology around me.\n\n3. AI Awareness 🤖\nI learned to spot AI in daily life and understand how it learns. I'll use this to be a smarter user of technology — and not be fooled by it.\n\n4. Talking to AI 🗣️\nI learned to write good prompts and verify AI responses. I'll use this as a study tool — AI as a tutor, not a cheat sheet.\n\n5. Digital Safety 🔒\nI learned about passwords, privacy, and digital footprints. I'll use this to protect myself and my family online.\n\n6. Canva Design 🎨\nI learned templates, colours, fonts, and layout. I'll use this for school projects, presentations, and eventually for my personal brand.\n\n7. Poster Design 📋\nI learned the one-message rule, visual hierarchy, and negative space. I'll use this to communicate ideas clearly — in any visual format.\n\n8. Visual Storytelling 📸\nI learned to tell stories with images using the 3-act structure. I'll use this for social media, projects, and anywhere I need to communicate visually.\n\n9. Presentation Skills 🎤\nI learned one idea per slide, speak more write less, and how to manage nerves. I'll use this in every class presentation and eventually in my career.\n\n10. Digital Story Project 🌟\nI learned the full creative workflow: idea → script → visuals → design → review → export. I'll use this for every future project — not just in this course, but in life.\n\nDesign: Clean layout, 2 columns, each skill with an icon. Consistent colours. This page will go on my personal website.'"
        }
      ]
    }
  },
  creator: {
    1: {
      theory: `<h4>What Is AI Productivity?</h4>
        <p>AI productivity means using AI tools to do your work <strong>faster and better</strong> — not to do your work <em>for</em> you. It's about amplifying your abilities, not replacing them.</p>
        
        <h4>The Wrong Way to Use AI</h4>
        <p>"Write my essay for me." → You learn nothing. You cheat. Your teacher can tell. You waste the opportunity to develop your own skills.</p>
        
        <h4>The Right Way to Use AI</h4>
        <p>"I have a science test in 5 days. Build me a study plan." → AI helps you <strong>plan</strong>, but you still do the studying. You learn time management, prioritization, and the subject matter.</p>
        
        <h4>3 Ways AI Can Boost Your Productivity</h4>
        <ul>
          <li><strong>Planning:</strong> AI can create study schedules, project timelines, to-do lists. It breaks big tasks into small steps.</li>
          <li><strong>Research:</strong> AI can summarize articles, explain complex topics, find key points. It saves you hours of reading.</li>
          <li><strong>Organization:</strong> AI can help you structure notes, create outlines, prioritize tasks. It turns chaos into clarity.</li>
        </ul>
        
        <h4>AI as Your Personal Assistant</h4>
        <p>Think of AI like a super-smart assistant who's available 24/7. But you're still the boss. You decide what to do with the information. AI suggests, you decide.</p>
        
        <h4>Real-World Example</h4>
        <p>Imagine you have a history project due in 2 weeks. Without AI: You procrastinate, start 3 days before, rush through it, get a mediocre grade. With AI: You ask AI to create a 2-week plan. It breaks the project into daily tasks. You follow the plan, finish early, review your work, get an A. AI didn't do the work — it helped you <strong>manage</strong> the work.</p>`,
      
      practice: [
        {
          step: "Create a 5-Day Study Plan with AI",
          instruction: "Open ChatGPT, Claude, or the ResolvrPro AI Playground. Copy this prompt and fill in your details:\n\n'I have a [SUBJECT] test on [DATE]. Build me a 5-day study plan. Include:\n- Daily 30-minute study sessions\n- 1 practice quiz\n- 1 break activity\n- Topics to cover each day'\n\nReplace [SUBJECT] and [DATE] with your actual test. Send the prompt. Read the plan AI creates.",
          example: "Example prompt:\n'I have a maths test on Friday. Build me a 5-day study plan. Include:\n- Daily 30-minute study sessions\n- 1 practice quiz\n- 1 break activity\n- Topics to cover each day'\n\nExample AI response:\n'Day 1 (Monday): Review chapters 1-3, make flashcards for formulas (30 min)\nDay 2 (Tuesday): Practice 10 problems from chapter 4, take quiz on chapters 1-3 (30 min)\nDay 3 (Wednesday): Review mistakes from quiz, study chapter 5 (30 min)\nDay 4 (Thursday): Full practice test, review weak areas (30 min)\nDay 5 (Friday): Light review of formulas, relax, sleep early (15 min)\n\nPractice quiz: [AI generates 10 questions]\nBreak activity: Go for a walk, listen to music, or do 10 minutes of stretching'\n\nTip: If the plan seems too hard or too easy, ask AI to adjust it: 'Make it easier' or 'Add more practice problems.'"
        },
        {
          step: "Use AI to Organize Your Notes",
          instruction: "Take a messy page of notes from class. Type it into AI (or take a photo and upload it). Ask: 'Organize these notes into a clear outline with headings and bullet points. Add any missing information.'",
          example: "Example:\nMessy notes: 'photosynthesis plants make food sunlight chlorophyll carbon dioxide water glucose oxygen'\n\nAI prompt: 'Organize these notes into a clear outline with headings and bullet points. Add any missing information.'\n\nAI response:\n'# Photosynthesis\n\n## What is it?\n- Process by which plants make their own food\n- Happens in leaves, specifically in chloroplasts\n\n## Requirements\n- Sunlight (energy source)\n- Chlorophyll (green pigment in leaves that captures light)\n- Carbon dioxide (from air, enters through stomata)\n- Water (from roots, transported through stem)\n\n## Products\n- Glucose (sugar = food for plant, used for energy)\n- Oxygen (released into air through stomata)\n\n## Equation\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\n## Why it matters\n- Plants are the base of the food chain\n- They produce oxygen we breathe\n- They remove CO₂ from the atmosphere'\n\nTip: Compare the AI version with your original notes. Did it add anything important? Did it organize things better?"
        },
        {
          step: "Follow Your AI Study Plan",
          instruction: "Actually follow the 5-day study plan AI created for you. Each day, check off what you completed. At the end of 5 days, write a reflection: Did the plan work? What would you change?",
          example: "Example reflection:\n'I followed the 5-day maths study plan.\n\nDay 1: ✓ Reviewed chapters 1-3, made 20 flashcards. Took 35 minutes (5 min over).\nDay 2: ✓ Practiced 10 problems, took quiz. Got 7/10. Reviewed 3 wrong answers.\nDay 3: ✓ Studied chapter 5. It was harder than I thought. Spent 45 minutes.\nDay 4: ✓ Took full practice test. Got 80%. Reviewed weak areas (word problems).\nDay 5: ✓ Light review. Felt confident. Slept 8 hours.\n\nTest result: 88%. Better than my usual 75%.\n\nDid the plan work? Yes. Breaking it into daily chunks prevented last-minute cramming.\n\nWhat I'd change: Add more time for chapter 5. Start with practice problems earlier. Use AI to generate more quiz questions on weak areas.'\n\nTip: Be honest in your reflection. If something didn't work, say why. You're learning how to learn."
        }
      ],
      
      tools: [
        {
          name: "AI Playground (ResolvrPro) / ChatGPT / Claude",
          description: "AI tools that can help you plan, research, and organize. They're like a smart study buddy available 24/7.",
          howToUse: "<strong>Step 1:</strong> Go to chat.openai.com (ChatGPT) or claude.ai (Claude) or use ResolvrPro AI Playground.<br><strong>Step 2:</strong> Create an account if needed (ask a parent for help if you're under 13).<br><strong>Step 3:</strong> Start a new chat. Type your prompt clearly.<br><strong>Step 4:</strong> Read the AI's response. If it's not what you need, ask follow-up questions: 'Can you make it simpler?' or 'Give me more examples.'<br><strong>Step 5:</strong> Copy the useful parts into your notes. Don't copy everything — just what helps you.<br><strong>Step 6:</strong> Always verify important information. AI can make mistakes."
        },
        {
          name: "Google Calendar / Notion / Any To-Do App",
          description: "Tools to organize your study plan and track progress. Visual planning helps you stay on track.",
          howToUse: "<strong>Step 1:</strong> Open Google Calendar (calendar.google.com) or Notion (notion.so) or any to-do app.<br><strong>Step 2:</strong> Create a new calendar/list called 'Study Plan'.<br><strong>Step 3:</strong> Add each day's task as an event/task. Include: What to study, How long, What time.<br><strong>Step 4:</strong> Set reminders (1 hour before, or morning of).<br><strong>Step 5:</strong> Each day, check off completed tasks. If you miss a day, reschedule it.<br><strong>Step 6:</strong> At the end of the week, review: What did you complete? What did you miss? Why?"
        }
      ],
      
      homework: [
        {
          question: "Use AI to create a study plan for an upcoming test or project. Follow the plan for 3 days. Write a reflection (6-8 sentences): Did the plan help? What worked? What didn't? What would you change?",
          solution: "Example reflection:\n'I used AI to create a study plan for my history test. The plan broke the syllabus into 5 days, which felt manageable instead of overwhelming.\n\nDay 1-2 went well. I studied the chapters AI suggested and took the quiz it created. I scored 70%, which showed me I needed to focus on dates and names.\n\nDay 3 was hard. I had a lot of homework from other subjects and couldn't finish the history study. I rescheduled it to Day 4.\n\nThe practice quiz AI suggested helped me identify weak areas. I spent extra time on those topics.\n\nWhat worked: Breaking the syllabus into chunks. Having a quiz to test myself. Knowing exactly what to study each day.\n\nWhat didn't work: The plan didn't account for other homework. I need to check my full schedule before committing to study time.\n\nWhat I'd change: Ask AI to create a more flexible plan. Add buffer days for unexpected homework. Include specific time blocks (4-4:30 PM) instead of just 'study today.'\n\nOverall, the plan helped me stay organized and reduced my stress. I scored 85% on the test, which is better than my usual 75%.'"
        },
        {
          question: "Take messy notes from one class. Use AI to organize them. Then compare: Original notes vs AI-organized notes. Write 3 things AI did better, and 1 thing your original notes had that AI missed.",
          solution: "Example:\n'Subject: Science — Cell Structure\n\nOriginal notes (messy):\n'cell membrane nucleus mitochondria ribosome er golgi body plant cell animal cell difference cell wall chloroplast vacuole'\n\nAI-organized notes:\n[See practice step 2 example]\n\n3 things AI did better:\n1. AI added headings and structure. My notes were just a list of words. AI organized them into categories (requirements, products, equation).\n2. AI added missing information. I didn't write the photosynthesis equation. AI added it.\n3. AI explained why it matters. My notes didn't connect photosynthesis to the bigger picture (food chain, oxygen production).\n\n1 thing my original notes had that AI missed:\nMy teacher's specific example. She said: 'Think of a leaf as a solar panel. It captures sunlight and converts it to food.' AI didn't include this analogy, but it helped me remember the concept.\n\nConclusion: AI is great for organizing and adding information, but my teacher's examples and analogies are also valuable. I should combine both.'"
        },
        {
          question: "Create a 'Productivity Experiment' log. For 1 week, track: How many hours you study, What tools you use (AI or not), How focused you feel (1-10 scale), What you accomplish. At the end of the week, analyze: Did AI tools make you more productive? How do you know?",
          solution: "Example log:\n'Monday: Studied 2 hours. Tools: Textbook, no AI. Focus: 6/10. Accomplished: Read chapter 4, took notes.\n\nTuesday: Studied 2 hours. Tools: AI study plan, AI quiz. Focus: 8/10. Accomplished: Reviewed chapters 1-3, took quiz, identified weak areas.\n\nWednesday: Studied 1.5 hours. Tools: AI notes organizer. Focus: 7/10. Accomplished: Organized messy notes, added missing info.\n\nThursday: Studied 2.5 hours. Tools: AI tutor for difficult concepts. Focus: 9/10. Accomplished: Understood photosynthesis equation, practiced 10 problems.\n\nFriday: Studied 1 hour. Tools: No AI, just review. Focus: 5/10. Accomplished: Light review, felt confident.\n\nTotal: 9 hours over 5 days.\n\nAnalysis:\n- Days with AI tools: Average focus 8/10, accomplished more specific tasks\n- Days without AI: Average focus 5.5/10, accomplished general tasks\n- AI made me more productive because: (1) I knew exactly what to study, (2) I could test myself with quizzes, (3) I could ask questions when stuck\n- How I know: I accomplished more in less time, felt more confident, and scored better on practice tests.\n\nConclusion: AI tools make me more productive when I use them for planning, testing, and explaining. But I still need to do the actual studying and practice.'"
        }
      ]
    }
  }
};

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
    <button class="session-tab" onclick="switchTab('practice')">🛠 Practice</button>
    <button class="session-tab" onclick="switchTab('tools')">🔧 Tools</button>
    <button class="session-tab" onclick="switchTab('homework')">📝 Homework</button>
    ${s.ai_prompt ? `<button class="session-tab" onclick="switchTab('ai')">✦ AI Prompt</button>` : ''}
  </div>`;
  
  // Build tab contents
  let theoryContent = '';
  let practiceContent = '';
  let toolsContent = '';
  let homeworkContent = '';
  let aiContent = '';
  
  if (details) {
    // Theory tab
    theoryContent = `<div class="theory-section">${details.theory}</div>`;
    
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
    theoryContent = `<div class="theory-section">
      <h4>Session Overview</h4>
      <p>${esc(s.objective)}</p>
      ${s.concepts?.length ? `<h4>Key Concepts</h4><ul>${s.concepts.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>` : ''}
      <h4>Real-World Example</h4>
      <p>${esc(s.example)}</p>
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

// ===== tab clicks =====
tabs.addEventListener('click', e=>{
  const b = e.target.closest('.lvl-tab'); if(b) showLevel(b.dataset.slug);
});

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
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl">${totalDone}</div><div class="text-xs font-bold uppercase tracking-wider text-white/70">Sessions Done</div></div>
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl">${160-totalDone}</div><div class="text-xs font-bold uppercase tracking-wider text-white/70">Remaining</div></div>
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl">${pct}%</div><div class="text-xs font-bold uppercase tracking-wider text-white/70">Complete</div></div>
      <div class="lms-stat-card"><div class="font-heading font-black text-4xl">160</div><div class="text-xs font-bold uppercase tracking-wider text-white/70">Total Sessions</div></div>`;

    // Level buttons
    const btnsEl = document.getElementById('lms-level-btns');
    btnsEl.innerHTML = DATA.levels.map(l=>{
      const c = countDone(l.slug);
      const isActive = l.slug === lmsActiveLevel;
      return `<button onclick="window._lmsSetLevel('${l.slug}')" class="font-extrabold py-3 px-5 nb-border nb-shadow-sm nb-press" style="background:${isActive?l.color:'#222'};color:${isActive?'#fff':'#ccc'}">${l.name} <span class="opacity-70 font-normal text-xs">· ${c}/40</span></button>`;
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
            <p class="text-sm text-white/70">${lvl.tagline} · ${lvl.grades}</p>
          </div>
          <div class="text-right">
            <div class="font-heading font-black text-2xl" style="color:${lvl.color}">${lvlDone}/40</div>
            <div class="text-xs text-white/60">${lvlPct}% complete</div>
          </div>
        </div>
        <div class="lms-progress-bar mb-6"><div class="lms-progress-fill" style="width:${lvlPct}%;background:${lvl.color}"></div></div>
        <div class="bg-white/10 nb-border p-4 mb-6" style="border-color:rgba(255,255,255,.2)">
          <div class="text-[10px] font-extrabold uppercase tracking-widest text-white/60">Annual Project</div>
          <div class="font-bold mt-1">${esc(lvl.annual_project)}</div>
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
