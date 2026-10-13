/* VERITY // THE ARCHIVE — lightweight vanilla JavaScript; no analytics or tracking. */
(() => {
  "use strict";
  const data = window.VERITY_DATA;
  if (!data) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeLink = (value) => /^https:\/\//.test(value) ? value : "#sources";
  const a = (url, label) => '<a href="' + esc(safeLink(url)) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + ' ↗</a>';
  const classNames = {canon:"ON-SCREEN / PUBLISHED",claim:"VERITY'S ACCOUNT",theory:"INTERPRETIVE THEORY"};
  let selectedEpisode = 0, selectedEvidence = 0, currentTimelineFilter = "all", currentTheoryFilter = "all", currentSearch = "";
  const enter = $("enterArchive");
  const shield = $("spoilerShield");
  const unlock = () => {
    shield.classList.add("dismissed");
    document.body.classList.remove("locked");
    try { sessionStorage.setItem("verityArchiveEntered", "1"); } catch (_) {}
    $("menuButton").focus({preventScroll:true});
  };
  if (shield && enter) {
    let seen = false;
    try { seen = sessionStorage.getItem("verityArchiveEntered") === "1"; } catch (_) {}
    if (seen) shield.classList.add("dismissed");
    else document.body.classList.add("locked");
    enter.addEventListener("click", unlock);
  }

  function renderEpisode() {
    $("episodeTabs").innerHTML = data.episodes.map((ep,i)=>'<button role="tab" id="episodeTab'+i+'" aria-controls="episodeDisplay" aria-selected="'+(i===selectedEpisode)+'" class="'+(i===selectedEpisode?"active":"")+'" data-episode="'+i+'">'+ep.number+'</button>').join("");
    const ep=data.episodes[selectedEpisode];
    $("episodeDisplay").innerHTML='<div class="episode-image" role="img" aria-label="Stylised glowing yellow smiley orb on a dark background"><div class="poster-shape"><i></i></div><span class="episode-stamp">CHAPTER '+esc(ep.number)+' / ARCHIVE RECORD</span></div><div class="episode-content"><span class="date">'+esc(ep.date)+'</span><h4>'+esc(ep.title)+'</h4><p>'+esc(ep.description)+'</p><div class="metadata">'+esc(ep.takeaway)+'</div>'+a(ep.source,"VERIFY EPISODE RECORD")+'</div>';
    $("episodeTabs").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
      selectedEpisode=Number(b.dataset.episode);renderEpisode();$("episodeTab"+selectedEpisode).focus();
    }));
    $("episodeTabs").addEventListener("keydown",(event)=>{
      if (!["ArrowLeft","ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      selectedEpisode=(selectedEpisode+(event.key==="ArrowRight"?1:-1)+data.episodes.length)%data.episodes.length;
      renderEpisode();
      $("episodeTab"+selectedEpisode).focus();
    },{once:true});
  }
  renderEpisode();

  function renderTimeline(){
    const selected=data.timeline.filter(x=>currentTimelineFilter==="all"||x.type===currentTimelineFilter);
    $("timelineEntries").innerHTML=selected.map(x=>'<article class="timeline-item"><div class="timeline-year">'+esc(x.year)+'</div><div class="timeline-body"><span class="type-label '+esc(x.type)+'">'+esc(classNames[x.type]||"ARCHIVE")+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.body)+'</p><span class="note">'+esc(x.note)+'</span></div></article>').join("");
  }
  $("timelineFilters").addEventListener("click",e=>{
    const b=e.target.closest("button[data-filter]");if(!b)return;
    currentTimelineFilter=b.dataset.filter;
    $("timelineFilters").querySelectorAll("button").forEach(t=>{t.classList.toggle("active",t===b);t.setAttribute("aria-pressed",String(t===b))});
    renderTimeline();
  });
  $("timelineFilters").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",String(i===0)));
  renderTimeline();

  $("characterCards").innerHTML=data.characters.map(c=>'<article class="character-card"><div class="character-visual" aria-hidden="true">'+(c.visual==="face"?'<div class="tiny-face"><span></span></div>':'<span class="emoji">'+esc(c.visual)+'</span>')+'</div><span class="character-number">'+esc(c.num)+'</span><h3>'+esc(c.name)+'</h3><div class="character-role">'+esc(c.role)+'</div><p>'+esc(c.description)+'</p><div class="character-footer">'+esc(c.footer)+'</div></article>').join("");

  function renderEvidence(){
    $("evidenceList").innerHTML=data.evidence.map((x,i)=>'<button id="evidenceTab'+i+'" role="tab" aria-controls="evidenceDetail" aria-selected="'+(selectedEvidence===i)+'" class="'+(selectedEvidence===i?"active":"")+'" data-evidence="'+i+'"><span class="item-num">'+esc(x.id)+'</span><span class="item-name">'+esc(x.name)+'</span><span class="item-arrow">↗</span></button>').join("");
    $("evidenceList").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
      selectedEvidence=Number(b.dataset.evidence);renderEvidence();$("evidenceTab"+selectedEvidence).focus();
    }));
    const ev=data.evidence[selectedEvidence];
    $("evidenceDetail").innerHTML='<div class="detail-index">FILE / '+esc(ev.id)+' — '+esc(ev.source.toUpperCase())+'</div><h3>'+esc(ev.title)+'</h3><span class="detail-status">'+esc(ev.class)+'</span><p style="margin-top:25px">'+esc(ev.facts)+'</p><div class="detail-interpretation"><strong>WHY IT MATTERS</strong><p>'+esc(ev.meaning)+'</p></div>'+a(ev.url,"EXAMINE SOURCE");
  }
  renderEvidence();

  function renderTheories(){
    const q=currentSearch.trim().toLowerCase();
    const filtered=data.theories.filter(t=>(currentTheoryFilter==="all"||t.level===currentTheoryFilter)&&(!q||(t.title+" "+t.summary+" "+t.support+" "+t.against).toLowerCase().includes(q)));
    $("theoryEmpty").hidden=filtered.length>0;
    $("theoryGrid").innerHTML=filtered.map(t=>'<article class="theory-card"><div class="theory-top"><span class="theory-id">FILE '+esc(t.id)+'</span><span class="confidence '+esc(t.level)+'">'+esc(t.level==="strong"?"WELL SUPPORTED":t.level==="plausible"?"PLAUSIBLE":"SPECULATIVE")+'</span></div><h3>'+esc(t.title)+'</h3><p>'+esc(t.summary)+'</p><button aria-expanded="false" aria-controls="expanded-'+esc(t.id)+'" data-open="'+esc(t.id)+'">EXAMINE EVIDENCE +</button><div class="theory-expanded" id="expanded-'+esc(t.id)+'" hidden><strong>WHAT SUPPORTS IT</strong><p>'+esc(t.support)+'</p><strong>WHAT CHALLENGES IT</strong><p>'+esc(t.against)+'</p>'+a(t.source,"SOURCE / CONTEXT")+'</div></article>').join("");
    $("theoryGrid").querySelectorAll("button[data-open]").forEach(b=>b.addEventListener("click",()=>{
      const panel=$(b.getAttribute("aria-controls"));
      const open=panel.hidden;panel.hidden=!open;b.setAttribute("aria-expanded",String(open));
      b.textContent=open?"CLOSE CASE FILE −":"EXAMINE EVIDENCE +";
    }));
  }
  $("theoryFilters").addEventListener("click",e=>{
    const b=e.target.closest("button[data-theory-filter]");if(!b)return;
    currentTheoryFilter=b.dataset.theoryFilter;
    $("theoryFilters").querySelectorAll("button").forEach(t=>{t.classList.toggle("active",t===b);t.setAttribute("aria-pressed",String(t===b))});
    renderTheories();
  });
  $("theoryFilters").querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",String(i===0)));
  $("theorySearch").addEventListener("input",e=>{currentSearch=e.target.value;renderTheories()});
  renderTheories();

  $("mysteryList").innerHTML=data.mysteries.map((m,i)=>'<details><summary><span class="n">'+String(i+1).padStart(2,"0")+'</span><span class="q">'+esc(m.question)+'</span><span class="plus" aria-hidden="true">+</span></summary><p>'+esc(m.answer)+'</p></details>').join("");
  $("sourceGrid").innerHTML=data.sources.map(s=>'<a class="source-card" href="'+esc(safeLink(s.url))+'" target="_blank" rel="noopener noreferrer"><span class="kind">'+esc(s.kind)+'</span><strong>'+esc(s.name)+'</strong><p>'+esc(s.desc)+'</p><span class="external" aria-hidden="true">↗</span></a>').join("");

  const menu=$("menuButton"),nav=$("mobileNav");
  function closeMenu(){nav.hidden=true;menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation")}
  menu.addEventListener("click",()=>{const open=nav.hidden;nav.hidden=!open;menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close navigation":"Open navigation")});
  nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!nav.hidden){closeMenu();menu.focus()}});
  document.addEventListener("click",event=>{if(!nav.hidden&&!nav.contains(event.target)&&!menu.contains(event.target))closeMenu()});
  window.addEventListener("resize",()=>{if(innerWidth>800)closeMenu()},{passive:true});

  const back=$("backToTop"),progress=$("readingProgress");
  let scheduled=false;
  function updateScroll(){
    scheduled=false;
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    progress.style.width=Math.max(0,Math.min(100,window.scrollY/max*100))+"%";
    back.classList.toggle("visible",window.scrollY>750);
  }
  window.addEventListener("scroll",()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});
  updateScroll();
  back.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}));
  if("IntersectionObserver" in window){
    const links=document.querySelectorAll("a[data-nav]");
    const observer=new IntersectionObserver((entries)=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      links.forEach(l=>l.classList.toggle("active",l.hash==="#"+visible.target.id));
    },{rootMargin:"-25% 0px -55% 0px",threshold:[0,.1,.5]});
    document.querySelectorAll("main section[id]").forEach(s=>observer.observe(s));
  }
})();