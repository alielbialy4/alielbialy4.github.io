'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cases = {
    commerce: {
      title: 'Commerce & ERP // Operational complexity, made manageable',
      description: 'Designing backend workflows for the real-world operations of businesses with branches, inventory, orders, payments and financial reporting. The interesting parts are consistency, access rules and the dozens of edge cases hidden behind a simple checkout screen.',
      points: ['Branch-specific access and data boundaries', 'Stock movements, purchasing, sales and returns', 'Transaction consistency and money-sensitive business rules']
    },
    saas: {
      title: 'Multi-Tenant SaaS // Separation by design',
      description: 'Building APIs where different organizations can operate confidently inside one product. My focus is on clear tenancy boundaries, permissions and predictable behavior as the domain evolves.',
      points: ['Tenant-aware data access and role-based permissions', 'Extensible, maintainable service boundaries', 'Safe API contracts for dashboards, clients and partners']
    },
    integrations: {
      title: 'Connected Systems // Reliable under imperfect conditions',
      description: 'External services fail, time out, retry and change. Reliable integrations account for those conditions, with explicit state, asynchronous processing and clear error handling.',
      points: ['OAuth flows and third-party REST APIs', 'Webhooks, background jobs and idempotent operations', 'Payments, messaging and notification integrations']
    }
  };
  const stacks = {
    backend: {
      kicker: '01 / CORE', title: 'Backend & data',
      description: 'Business logic, API design, relational data and the services that keep product behavior consistent.',
      skills: ['PHP', 'Laravel', 'REST APIs', 'MySQL', 'PostgreSQL', 'Redis', 'Eloquent', 'Authentication & RBAC', 'Queues']
    },
    infrastructure: {
      kicker: '02 / DELIVERY', title: 'Infrastructure & operations',
      description: 'An application is more than its code: deployment, visibility and reliable communication matter too.',
      skills: ['Docker', 'Linux', 'Git / GitHub', 'VPS Hosting', 'Cloudflare', 'S3 / R2', 'Scheduled Jobs', 'Web Servers']
    },
    interface: {
      kicker: '03 / PRODUCT', title: 'Web & interfaces',
      description: 'Backend-first, with enough frontend perspective to build coherent end-to-end product experiences.',
      skills: ['JavaScript', 'TypeScript', 'React', 'Blade', 'Bootstrap', 'HTML / CSS', 'Chart.js', 'REST Clients']
    },
    integrations: {
      kicker: '04 / CONNECT', title: 'Integrations & connectivity',
      description: 'Making platforms exchange useful information while respecting security, failure and data consistency.',
      skills: ['OAuth 2.0', 'Webhooks', 'Payment APIs', 'FCM', 'Cloud Storage', 'Social APIs', 'Mail Services', 'Realtime Events']
    }
  };

  // Interactive case study drawer, with true toggle behavior and keyboard-friendly buttons.
  const caseDetail = $('#case-detail');
  $$('.work-card').forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.getAttribute('aria-expanded') === 'true';
      $$('.work-card').forEach(card => card.setAttribute('aria-expanded', 'false'));
      if (selected) {
        caseDetail.hidden = true;
        caseDetail.replaceChildren();
        return;
      }
      const info = cases[button.dataset.case];
      if (!info) return;
      const header = document.createElement('div');
      header.className = 'case-head';
      const title = document.createElement('h3');
      title.textContent = info.title;
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'CLOSE ×';
      close.addEventListener('click', () => { button.setAttribute('aria-expanded','false'); caseDetail.hidden = true; button.focus(); });
      header.append(title,close);
      const description = document.createElement('p');
      description.textContent = info.description;
      const list = document.createElement('ul');
      info.points.forEach(point => { const item = document.createElement('li'); item.textContent = point; list.append(item); });
      caseDetail.replaceChildren(header, description, list);
      caseDetail.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      if (!motionReduced) caseDetail.scrollIntoView({ behavior:'smooth', block:'nearest' });
    });
  });

  // Clickable technology tabs.
  const stackPanel = $('#stack-panel');
  function renderStack(key) {
    const data = stacks[key] || stacks.backend;
    $$('.stack-tab').forEach(tab => { const current = tab.dataset.stack === key; tab.classList.toggle('active',current); tab.setAttribute('aria-selected',String(current)); tab.tabIndex = current ? 0 : -1; });
    const kicker = document.createElement('div'); kicker.className = 'panel-kicker'; kicker.textContent = data.kicker;
    const h3 = document.createElement('h3'); h3.textContent = data.title;
    const description = document.createElement('p'); description.textContent = data.description;
    const skills = document.createElement('div'); skills.className = 'skill-items';
    data.skills.forEach(skill => { const tag = document.createElement('span'); tag.className='skill-item'; tag.textContent = skill; skills.append(tag); });
    stackPanel.replaceChildren(kicker,h3,description,skills);
  }
  $$('.stack-tab').forEach((tab, index, tabs) => {
    tab.addEventListener('click', () => renderStack(tab.dataset.stack));
    tab.addEventListener('keydown', event => {
      let next = null;
      if (event.key==='ArrowRight'||event.key==='ArrowDown') next=(index+1)%tabs.length;
      if (event.key==='ArrowLeft'||event.key==='ArrowUp') next=(index+tabs.length-1)%tabs.length;
      if (next!==null) { event.preventDefault(); renderStack(tabs[next].dataset.stack); tabs[next].focus(); }
    });
  });
  renderStack('backend');

  // Accent-color switching, shared by button and terminal command.
  const themes = ['green','blue','pink'];
  let themeIndex = 0;
  function cycleTheme() {
    themeIndex = (themeIndex + 1) % themes.length;
    root.dataset.theme = themes[themeIndex] === 'green' ? '' : themes[themeIndex];
    return themes[themeIndex];
  }
  $('#theme-toggle').addEventListener('click', cycleTheme);

  // Useful, deliberately sandboxed terminal: no arbitrary JS or shell execution.
  const terminalOutput = $('#terminal-output');
  const terminalInput = $('#terminal-input');
  const terminalForm = $('#terminal-form');
  $('#login-time').textContent = new Intl.DateTimeFormat('en-US',{dateStyle:'medium', timeStyle:'short',timeZone:'Africa/Cairo'}).format(new Date()) + ' EET';
  function log(line, type='') {
    const element=document.createElement('div'); element.className='terminal-line '+type; element.textContent=line; terminalOutput.append(element); terminalOutput.scrollTop=terminalOutput.scrollHeight;
    return element;
  }
  function executeCommand(text) {
    const command = text.trim().toLowerCase().replace(/\s+/g,' ');
    if (!command) return;
    log('guest@ali:~$ '+text.trim(),'terminal-green');
    const word=command.split(' ')[0];
    switch(word) {
      case 'help':
        log('COMMANDS\n  about      who I am\n  stack      tools I work with\n  projects   areas I build in\n  github     open my GitHub\n  contact    reach out by email\n  theme      change the accent color\n  time       current time in Cairo\n  clear      clear this console\n  surprise   an easter egg\n  help       display these commands');
        break;
      case 'about': log('Ali Elbialy // Backend Engineer\nBuilding secure APIs, reliable commerce platforms, multi-tenant SaaS and integrations. Based in Egypt.'); break;
      case 'stack': log('CORE  : PHP, Laravel, MySQL, PostgreSQL, Redis\nTOOLS : Docker, Linux, Git, Cloudflare\nWEB   : JavaScript, TypeScript, React\nMORE  : OAuth, Webhooks, Payments, Realtime'); break;
      case 'projects': log('001  COMMERCE & ERP — orders / branches / stock / finance\n002  MULTI-TENANT SAAS — isolation / permissions / scale\n003  INTEGRATIONS — APIs / OAuth / events\n\nSelect a project card above to explore its engineering focus.'); break;
      case 'github': log('Opening https://github.com/alielbialy4 ...'); window.open('https://github.com/alielbialy4','_blank','noopener,noreferrer'); break;
      case 'contact': log('Opening your email client ...'); window.location.href='mailto:ali.elmetwaly.dev@gmail.com?subject=Hello%20Ali'; break;
      case 'theme': log('Accent switched to '+cycleTheme().toUpperCase()+'.'); break;
      case 'time': log(new Intl.DateTimeFormat('en-GB',{dateStyle:'full', timeStyle:'long',timeZone:'Africa/Cairo'}).format(new Date())+' (Cairo)'); break;
      case 'clear': terminalOutput.replaceChildren(); break;
      case 'surprise':
      case 'sudo':
        log('   ╔══════════════════════════════╗\n   ║   ACCESS GRANTED: CURIOUS     ║\n   ║   KEEP BUILDING. KEEP LEARNING ║\n   ╚══════════════════════════════╝','terminal-green');
        cycleTheme(); break;
      case 'whoami':log('guest // exploring Ali Elbialy’s portfolio');break;
      case 'ls':log('about/    work/    stack/    contact/    curiosity.exe');break;
      case 'pwd':log('/home/guest/behind-the-systems');break;
      default:log('Command not found: '+word+'\nType "help" to see the supported commands.','terminal-error');
    }
  }
  terminalForm.addEventListener('submit', e => { e.preventDefault(); executeCommand(terminalInput.value); terminalInput.value=''; terminalInput.focus(); });
  $('#terminal-clear').addEventListener('click', () => { terminalOutput.replaceChildren(); terminalInput.focus(); });
  $$('[data-cmd]').forEach(btn => btn.addEventListener('click',()=>{executeCommand(btn.dataset.cmd);terminalInput.focus();}));
  $('.terminal-window').addEventListener('click', e => { if (e.target===terminalOutput) terminalInput.focus(); });

  // Command palette with keyboard navigation + focus restoration.
  const palette=$('#palette'), paletteInput=$('#palette-input'), paletteItems=$('#palette-items');
  const paletteActions=[
    {name:'Explore work',hint:'01',target:'#work'},
    {name:'Technology stack',hint:'02',target:'#stack'},
    {name:'Interactive terminal',hint:'03',target:'#console'},
    {name:'Get in touch',hint:'04',target:'#contact'},
    {name:'Back to top',hint:'↟',target:'#top'},
    {name:'Switch accent color',hint:'◐',action:cycleTheme},
    {name:'Open GitHub',hint:'↗',url:'https://github.com/alielbialy4'}
  ];
  let selectedIndex=0, filteredActions=[...paletteActions], lastFocus=null;
  function renderPalette() {
    const query=paletteInput.value.trim().toLowerCase();
    filteredActions=paletteActions.filter(item=>item.name.toLowerCase().includes(query));
    selectedIndex=Math.min(selectedIndex,Math.max(filteredActions.length-1,0));
    paletteItems.replaceChildren();
    if(!filteredActions.length){ const empty=document.createElement('div'); empty.className='palette-item'; empty.textContent='No actions found';paletteItems.append(empty);return; }
    filteredActions.forEach((action,index)=>{
      const btn=document.createElement('button');btn.type='button';btn.className='palette-item';btn.setAttribute('aria-selected',String(index===selectedIndex));
      const name=document.createElement('span');name.textContent=action.name;name.style.cssText='font:inherit;color:inherit';
      const hint=document.createElement('span');hint.textContent=action.hint;btn.append(name,hint);
      btn.addEventListener('mouseenter',()=>{selectedIndex=index;refreshSelection();});
      btn.addEventListener('click',()=>activate(action));
      paletteItems.append(btn);
    });
  }
  function refreshSelection(){ $$('.palette-item',paletteItems).forEach((item,i)=>item.setAttribute('aria-selected',String(i===selectedIndex))); }
  function openPalette(){lastFocus=document.activeElement;palette.hidden=false;paletteInput.value='';selectedIndex=0;renderPalette();document.body.style.overflow='hidden';paletteInput.focus();}
  function closePalette(){palette.hidden=true;document.body.style.overflow=''; if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  function activate(action){closePalette();if(action.target){const dest=$(action.target);if(dest)dest.scrollIntoView({behavior:motionReduced?'auto':'smooth'});}if(action.url)window.open(action.url,'_blank','noopener,noreferrer');if(action.action)action.action();}
  $('#command-trigger').addEventListener('click',openPalette);
  $('#palette-close').addEventListener('click',closePalette);
  palette.addEventListener('click',e=>{if(e.target===palette)closePalette();});
  paletteInput.addEventListener('input',()=>{selectedIndex=0;renderPalette();});
  paletteInput.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){e.preventDefault();selectedIndex=(selectedIndex+1)%Math.max(filteredActions.length,1);refreshSelection();}
    if(e.key==='ArrowUp'){e.preventDefault();selectedIndex=(selectedIndex-1+Math.max(filteredActions.length,1))%Math.max(filteredActions.length,1);refreshSelection();}
    if(e.key==='Enter'&&filteredActions[selectedIndex]){e.preventDefault();activate(filteredActions[selectedIndex]);}
  });
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette.hidden?openPalette():closePalette();}
    if(e.key==='Escape'&&!palette.hidden){e.preventDefault();closePalette();}
    if(e.key==='Tab'&&!palette.hidden){ const focusables=[paletteInput,...$$('button',paletteItems),$('#palette-close')].filter(x=>!x.disabled);const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();} }
  });

  // Pointer-responsive architecture core and ambient spotlight.
  if(!motionReduced){
    let lastX=0,lastY=0;
    document.addEventListener('pointermove', e=>{
      if(e.pointerType==='touch')return;
      lastX=e.clientX;lastY=e.clientY;
      root.style.setProperty('--mouse-x',lastX+'px');root.style.setProperty('--mouse-y',lastY+'px');
    },{passive:true});
    const scene=$('#orbit-scene');
    scene.addEventListener('pointermove',e=>{
      const rect=scene.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-.5;
      const y=(e.clientY-rect.top)/rect.height-.5;
      scene.style.setProperty('--orbit-x',(x*14).toFixed(1)+'px');
      scene.style.setProperty('--orbit-y',(y*14).toFixed(1)+'px');
    },{passive:true});
    scene.addEventListener('pointerleave',()=>{scene.style.setProperty('--orbit-x','0px');scene.style.setProperty('--orbit-y','0px');});
  }

  // Small deterministic particle constellation, capped on mobile and high-DPI displays.
  if(!motionReduced){
    const canvas=$('#stars'),ctx=canvas.getContext('2d');
    if(ctx){
      let width=0,height=0,points=[],active=true;
      const resize=()=>{
        const dpr=Math.min(window.devicePixelRatio||1,2);
        width=window.innerWidth;height=window.innerHeight;
        canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
        ctx.setTransform(dpr,0,0,dpr,0,0);
        const n=Math.min(width<700?38:74,Math.round(width*height/13500));
        points=Array.from({length:n},(_,i)=>({x:(i*97.3+37)%width,y:(i*179.7+13)%height,vx:(i%3-1)*.1,vy:((i%5)-2)*.07,r:i%7===0?1.6:.9}));
      };
      resize();
      window.addEventListener('resize',resize,{passive:true});
      document.addEventListener('visibilitychange',()=>{active=!document.hidden;if(active)requestAnimationFrame(draw);});
      function draw(){
        if(!active)return;
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle='rgba(159,192,226,.55)';
        points.forEach(p=>{
          p.x+=p.vx;p.y+=p.vy;
          if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
        });
        for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
          const a=points[i],b=points[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;
          if(d<12500){ctx.strokeStyle='rgba(130,168,215,'+((1-d/12500)*.15)+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
        }
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
    }
  }
  $('#year').textContent=String(new Date().getFullYear());
})();