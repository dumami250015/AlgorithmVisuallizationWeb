import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// --- THEME & STYLES ---
const colors = {
  primary: '#6366f1',   // Indigo 500
  secondary: '#10b981', // Emerald 500
  accent: '#f59e0b',    // Amber 500
  danger: '#ef4444',    // Red 500
  bg: '#f8fafc',        // Slate 50
  sidebar: '#0f172a',   // Slate 900
  textLight: '#f1f5f9', // Slate 100
  textDark: '#1e293b',
  border: '#cbd5e1',    // Slate 300
  card: '#ffffff'
};

const BASE_URL = 'http://localhost:8080/api/algo';

const App = () => {
  const [tab, setTab] = useState('sorting');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // --- DYNAMIC STYLES ---
  const styles = {
    app: { 
      fontFamily: "'Inter', sans-serif", 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      overflow: 'hidden',
      backgroundColor: colors.bg
    },
    sidebar: {
      width: '240px',
      backgroundColor: colors.sidebar,
      color: colors.textLight,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
      zIndex: 20,
      position: isMobile ? 'absolute' : 'relative',
      height: '100%',
      transform: isMobile && !isMobileMenuOpen ? 'translateX(-100%)' : 'translateX(0)',
      transition: 'transform 0.3s ease-in-out'
    },
    menuOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 15,
      display: isMobile && isMobileMenuOpen ? 'block' : 'none'
    },
    logo: {
      fontSize: '1.75rem',
      fontWeight: '800',
      marginBottom: '40px',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.025em',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '1.5rem',
      cursor: 'pointer',
      display: isMobile ? 'block' : 'none'
    },
    navItem: (active) => ({
      padding: '12px 16px',
      marginBottom: '8px',
      borderRadius: '12px',
      cursor: 'pointer',
      backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
      color: active ? '#818cf8' : '#94a3b8', 
      fontWeight: active ? '600' : '500',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      border: active ? `1px solid rgba(99, 102, 241, 0.2)` : '1px solid transparent'
    }),
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
      width: '100%', 
      overflow: 'hidden' 
    },
    topbar: {
      height: '70px',
      minHeight: '70px',
      backgroundColor: 'white',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px', 
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      zIndex: 5,
      gap: '15px'
    },
    menuBtn: {
      display: isMobile ? 'block' : 'none',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: colors.textDark
    },
    contentArea: {
      flex: 1,
      padding: isMobile ? '15px' : '30px', 
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', 
      position: 'relative'
    },
    visualizerCard: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '20px',
      border: `1px solid #e2e8f0`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    },
    canvasWrapper: {
      flex: 1,
      position: 'relative',
      backgroundColor: '#ffffff',
      width: '100%',
      height: '100%',
      minHeight: '300px', 
      backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      overflow: 'hidden'
    },
    controls: {
      padding: '15px 20px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: 'white',
      zIndex: 5,
      flexWrap: 'wrap', 
      justifyContent: isMobile ? 'center' : 'flex-start'
    },
    btn: (primary = false) => ({
      padding: '10px 16px', 
      borderRadius: '8px',
      border: primary ? 'none' : `1px solid ${colors.border}`,
      backgroundColor: primary ? colors.primary : 'white',
      color: primary ? 'white' : colors.textDark,
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      boxShadow: primary ? '0 4px 6px -1px rgba(99, 102, 241, 0.4)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      whiteSpace: 'nowrap'
    }),
    select: {
      padding: '10px 35px 10px 12px',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      backgroundColor: '#ffffff',
      color: '#1e293b', 
      fontSize: '0.9rem',
      fontWeight: '500',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1' stroke-width='2'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7' /%3e%3c/svg%3e")`,
      backgroundPosition: 'right 10px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      minWidth: isMobile ? '100%' : '180px',
      maxWidth: '100%',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    },
    statusFooter: {
      backgroundColor: '#f8fafc',
      borderTop: `1px solid ${colors.border}`,
      color: colors.textDark,
      padding: '12px 20px',
      fontSize: '0.9rem',
      fontWeight: '500',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      flexShrink: 0
    }
  };

  const handleNavClick = (t) => {
    setTab(t);
    setIsMobileMenuOpen(false);
  };

  return (
    <div style={styles.app}>
      <div style={styles.menuOverlay} onClick={() => setIsMobileMenuOpen(false)} />
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span>DSA.Viz</span>
          <button style={styles.closeBtn} onClick={() => setIsMobileMenuOpen(false)}>×</button>
        </div>
        <nav>
          {['sorting', 'search', 'graph', 'tree', 'dp'].map(t => (
            <div key={t} style={styles.navItem(tab === t)} onClick={() => handleNavClick(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </nav>
      </aside>
      <main style={styles.main}>
        <header style={styles.topbar}>
          <button style={styles.menuBtn} onClick={() => setIsMobileMenuOpen(true)}>☰</button>
          <h2 style={{margin: 0, fontSize: '1.25rem', fontWeight: '700', color: colors.textDark}}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Algorithms
          </h2>
        </header>
        <div style={styles.contentArea}>
          <div style={styles.visualizerCard}>
            {tab === 'sorting' && <SortingVisualizer styles={styles} />}
            {tab === 'search' && <SearchVisualizer styles={styles} />}
            {tab === 'graph' && <GraphVisualizer styles={styles} />}
            {tab === 'tree' && <TreeVisualizer styles={styles} />}
            {tab === 'dp' && <DPVisualizer styles={styles} />}
          </div>
        </div>
      </main>
    </div>
  );
};

// ... (SortingVisualizer kept as is)
const SortingVisualizer = ({ styles }) => {
  const [arr, setArr] = useState([]);
  const [algo, setAlgo] = useState('bubble');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [msg, setMsg] = useState('Generate an array to start');
  const [playing, setPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [customInput, setCustomInput] = useState('');
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => { generate(); }, []);

  useEffect(() => {
    const handleResize = () => generate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generate = () => {
    let width = 800;
    if(containerRef.current && containerRef.current.offsetWidth > 0) {
      width = containerRef.current.offsetWidth;
    }
    
    let newArr;
    if (customInput.trim()) {
      newArr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    } else {
      const count = Math.floor(width / 20);
      newArr = Array.from({ length: Math.min(Math.max(count, 5), 40) }, () => Math.floor(Math.random() * 90) + 5);
    }
    setArr(newArr);
    setSteps([]); 
    setCurrentStep(0); 
    setMsg('Ready to sort');
  };

  useEffect(() => {
    if (playing && !isPaused && currentStep < steps.length) {
      timerRef.current = setTimeout(() => {
        const s = steps[currentStep];
        setArr(s.arrayState);
        setHighlights(s.highlights);
        setMsg(s.description);
        setCurrentStep(c => c + 1);
      }, speed); 
      return () => clearTimeout(timerRef.current);
    } else if (currentStep >= steps.length && playing) {
      setPlaying(false);
      setMsg(`Sorted using ${algo} sort!`);
    }
  }, [playing, isPaused, currentStep, steps, speed]);

  const run = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/sort/${algo}`, arr);
      setSteps(res.data);
      setPlaying(true);
      setCurrentStep(0);
    } catch (err) {
      setMsg("Error connecting to backend");
    }
  };

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const stepForward = () => {
    if (currentStep < steps.length) {
      const s = steps[currentStep];
      setArr(s.arrayState);
      setHighlights(s.highlights);
      setMsg(s.description);
      setCurrentStep(c => c + 1);
    }
  };
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
      const s = steps[currentStep - 1];
      setArr(s.arrayState);
      setHighlights(s.highlights);
      setMsg(s.description);
    }
  };
  const restart = () => {
    setCurrentStep(0);
    setPlaying(false);
    setIsPaused(false);
    if (steps.length > 0) {
      const s = steps[0];
      setArr(s.arrayState);
      setHighlights(s.highlights);
      setMsg(s.description);
    }
  };

  const handlePlay = () => run();
  const handlePause = () => pause();
  const handleResume = () => resume();
  const handleStepBackward = () => stepBackward();
  const handleStepForward = () => stepForward();
  const handleRestart = () => restart();

  return (
    <>
      <div style={styles.controls}>
        <input type="text" placeholder="Custom (e.g. 1,2,3)" value={customInput} onChange={e => setCustomInput(e.target.value)} style={{...styles.select, width: '150px'}} disabled={playing} />
        <button style={styles.btn()} onClick={() => generate()} disabled={playing}>Gen</button>
        <select value={algo} onChange={e => setAlgo(e.target.value)} style={styles.select} disabled={playing}>
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
        </select>
        <button style={styles.btn()} onClick={handleStepBackward} disabled={!steps.length || currentStep === 0}>◀</button>
        {playing ? (isPaused ? <button style={styles.btn(true)} onClick={handleResume}>Resume</button> : <button style={styles.btn()} onClick={handlePause}>Pause</button>) : <button style={styles.btn(true)} onClick={handlePlay}>Play</button>}
        <button style={styles.btn()} onClick={handleStepForward} disabled={!steps.length || currentStep >= steps.length}>▶</button>
        <button style={styles.btn()} onClick={handleRestart} disabled={!steps.length}>Restart</button>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <label>Speed:</label>
          <input type="range" min="10" max="500" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{width: '80px'}} />
          <span>{speed}ms</span>
        </div>
      </div>
      <div style={{padding: '10px', textAlign: 'center'}}>
        <div style={{width: '100%', height: '10px', background: '#e5e7eb', borderRadius: '5px'}}>
          <div style={{width: `${steps.length ? (currentStep / steps.length) * 100 : 0}%`, height: '100%', background: colors.primary, borderRadius: '5px'}}></div>
        </div>
        Step {currentStep} / {steps.length}
      </div>

      <div ref={containerRef} style={{...styles.canvasWrapper, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '0', gap: '2px'}}>
        {arr.map((val, idx) => (
          <div key={idx} style={{
            flex: 1,
            height: `${val}%`,
            maxHeight: '100%',
            maxWidth: '40px',
            backgroundColor: highlights.includes(idx) ? colors.accent : colors.primary,
            borderRadius: '4px 4px 0 0',
            transition: 'height 0.1s ease, background-color 0.1s',
            opacity: 0.9
          }}></div>
        ))}
      </div>
      <div style={styles.statusFooter}>{msg}</div>
    </>
  );
};

// --- GRAPH COMPONENT ---
const GraphVisualizer = ({ styles }) => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [steps, setSteps] = useState([]);
  const [algo, setAlgo] = useState('bfs');
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [msg, setMsg] = useState('Select algorithm & run');
  const [activeNodes, setActiveNodes] = useState([]);
  const [activeEdges, setActiveEdges] = useState([]);
  const [labels, setLabels] = useState({});
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [edgeListInput, setEdgeListInput] = useState(''); // Replaced Matrix with Edge List
  const [customMode, setCustomMode] = useState(false);
  
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const transformRef = useRef({ scale: 1, offsetX: 0, offsetY: 0 });

  const runForceLayout = (nodes, edges, width, height) => {
    const simNodes = JSON.parse(JSON.stringify(nodes));
    // Reduced spacing factor from 1.5 to 0.8 to make edges shorter
    const k = Math.sqrt((width * height) / (simNodes.length + 1)) * 0.8; 
    const iterations = 300; 
    const temp = width / 8;
    
    for (let i = 0; i < iterations; i++) {
      for (let v = 0; v < simNodes.length; v++) {
        simNodes[v].dispX = 0;
        simNodes[v].dispY = 0;
        for (let u = 0; u < simNodes.length; u++) {
          if (v !== u) {
            const dx = simNodes[v].x - simNodes[u].x;
            const dy = simNodes[v].y - simNodes[u].y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.1) dist = 0.1;
            const force = (k * k) / dist;
            simNodes[v].dispX += (dx / dist) * force;
            simNodes[v].dispY += (dy / dist) * force;
          }
        }
      }
      edges.forEach(e => {
        const uNode = simNodes.find(n => n.id === e.source);
        const vNode = simNodes.find(n => n.id === e.target);
        if (uNode && vNode) {
          const dx = uNode.x - vNode.x;
          const dy = uNode.y - vNode.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.1) dist = 0.1;
          const force = (dist * dist) / k;
          const dispX = (dx / dist) * force;
          const dispY = (dy / dist) * force;
          uNode.dispX -= dispX; uNode.dispY -= dispY;
          vNode.dispX += dispX; vNode.dispY += dispY;
        }
      });
      const t = temp * (1 - i / iterations); 
      simNodes.forEach(n => {
        const dist = Math.sqrt(n.dispX * n.dispX + n.dispY * n.dispY);
        if (dist > 0) {
          const limitedDist = Math.min(dist, t);
          n.x += (n.dispX / dist) * limitedDist;
          n.y += (n.dispY / dist) * limitedDist;
        }
      });
    }
    return simNodes;
  };

  const run = async () => {
    try {
      let payload = null;
      if (graphData.nodes.length > 0) {
        payload = {
          nodes: graphData.nodes.map(n => ({ id: n.id, x: Math.round(n.x), y: Math.round(n.y) })),
          edges: graphData.edges.map(e => ({ source: e.source, target: e.target, weight: e.weight }))
        };
      }
      if (!payload) {
        setMsg('No graph data to run.');
        return;
      }
      const res = await axios.post(`${BASE_URL}/graph/${algo}`, payload);
      if (!res.data || !Array.isArray(res.data.steps) || res.data.steps.length === 0) {
        setMsg('No steps returned.');
        setSteps([]);
        setPlaying(false);
        return;
      }
      setSteps(res.data.steps);
      setCurrentStep(0);
      setPlaying(true);
    } catch (err) {
      setMsg('Connection Error');
    }
  };

  const generateFromEdgeList = () => {
    const lines = edgeListInput.trim().split('\n');
    if (lines.length === 0 || lines[0].trim() === '') {
        alert('Please enter edges.');
        return;
    }

    const edges = [];
    const uniqueNodes = new Set();

    for(let line of lines) {
        const parts = line.trim().split(/\s+/).map(Number);
        if (parts.length < 2 || parts.some(isNaN)) {
            continue;
        }
        const u = parts[0];
        const v = parts[1];
        const w = parts.length > 2 ? parts[2] : 1; 

        edges.push({ source: u, target: v, weight: w });
        uniqueNodes.add(u);
        uniqueNodes.add(v);
    }

    if (edges.length === 0 && uniqueNodes.size === 0) {
        alert('No valid edges found.');
        return;
    }

    const nodes = Array.from(uniqueNodes).map(id => ({
        id,
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50
    }));

    const isDirected = true;

    let width = 500, height = 400;
    if (wrapperRef.current && wrapperRef.current.clientWidth > 0) {
        width = wrapperRef.current.clientWidth;
        height = wrapperRef.current.clientHeight;
    }
    
    const layoutNodes = runForceLayout(nodes, edges, width, height);
    setGraphData({ nodes: layoutNodes, edges, isDirected });
    setCustomMode(false);
  };

  useEffect(() => {
    if (playing && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const s = steps[currentStep];
        setActiveNodes(s.visitedNodes || []);
        setActiveEdges(s.highlightedEdges || []);
        setLabels(s.nodeLabels || {});
        setMsg(s.description);
        setCurrentStep(c => c + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length && playing) {
      setPlaying(false);
      setMsg("Done");
    }
  }, [playing, currentStep, steps]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    const { scale, offsetX, offsetY } = transformRef.current;
    const mouseX = (rawX - offsetX) / scale;
    const mouseY = (rawY - offsetY) / scale;
    const clickedNode = graphData.nodes.find(n => {
      const dist = Math.sqrt((n.x - mouseX) ** 2 + (n.y - mouseY) ** 2);
      return dist < 30;
    });
    if (clickedNode) setDraggingNodeId(clickedNode.id);
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const { scale, offsetX, offsetY } = transformRef.current;
      const mouseX = (rawX - offsetX) / scale;
      const mouseY = (rawY - offsetY) / scale;
      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === draggingNodeId ? { ...n, x: mouseX, y: mouseY } : n)
      }));
    }
  };

  const handleMouseUp = () => setDraggingNodeId(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    const wrapper = wrapperRef.current;
    if(!cvs || !wrapper) return;

    const resizeCanvas = () => {
      cvs.width = wrapper.clientWidth;
      cvs.height = wrapper.clientHeight;
      draw();
    };

    const drawArrow = (ctx, fromX, fromY, toX, toY, color) => {
      const headlen = 15; 
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.lineTo(toX, toY);
      ctx.fill();
    };

    const draw = () => {
      const ctx = cvs.getContext('2d');
      const w = cvs.width;
      const h = cvs.height;
      ctx.clearRect(0,0, w, h);

      if (customMode) return;

      // Auto Scaling Logic
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      if (graphData.nodes.length > 0) {
        graphData.nodes.forEach(n => {
          if(n.x < minX) minX = n.x;
          if(n.x > maxX) maxX = n.x;
          if(n.y < minY) minY = n.y;
          if(n.y > maxY) maxY = n.y;
        });
      } else {
        minX = 0; maxX = 500; minY = 0; maxY = 400;
      }

      const padding = 60;
      const contentW = (maxX - minX) + padding * 2;
      const contentH = (maxY - minY) + padding * 2;
      const scale = Math.min(w / contentW, h / contentH);
      
      const centerContentX = (minX + maxX) / 2;
      const centerContentY = (minY + maxY) / 2;
      
      const offsetX = (w / 2) - (centerContentX * scale);
      const offsetY = (h / 2) - (centerContentY * scale);

      transformRef.current = { scale, offsetX, offsetY };

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Edges
      graphData.edges.forEach(e => {
        const u = graphData.nodes.find(n => n.id === e.source);
        const v = graphData.nodes.find(n => n.id === e.target);
        if(!u || !v) return;

        const isHigh = activeEdges.some(ae => 
          (ae[0]===e.source && ae[1]===e.target) || (ae[0]===e.target && ae[1]===e.source)
        );
        const color = isHigh ? colors.danger : '#cbd5e1';
        const lineWidth = isHigh ? 4 : 2;
        const isBidirectional = graphData.isDirected && graphData.edges.some(other => other.source === e.target && other.target === e.source);
        
        ctx.beginPath();
        let midX, midY;

        if (isBidirectional) {
          const dx = v.x - u.x;
          const dy = v.y - u.y;
          const factor = 0.3; 
          const offX = -dy * factor; 
          const offY = dx * factor;
          const cpX = (u.x + v.x) / 2 + offX;
          const cpY = (u.y + v.y) / 2 + offY;
          ctx.moveTo(u.x, u.y);
          ctx.quadraticCurveTo(cpX, cpY, v.x, v.y);
          midX = 0.25 * u.x + 0.5 * cpX + 0.25 * v.x;
          midY = 0.25 * u.y + 0.5 * cpY + 0.25 * v.y;
        } else {
          ctx.moveTo(u.x, u.y);
          ctx.lineTo(v.x, v.y);
          midX = (u.x + v.x)/2;
          midY = (u.y + v.y)/2;
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        if (graphData.isDirected) {
           const arrowDist = 33; 
           if(isBidirectional) {
             const factor = 0.3;
             const dx = v.x - u.x; const dy = v.y - u.y;
             const offX = -dy * factor; const offY = dx * factor;
             const cpX = (u.x + v.x) / 2 + offX;
             const cpY = (u.y + v.y) / 2 + offY;
             const angle = Math.atan2(v.y - cpY, v.x - cpX);
             drawArrow(ctx, 0, 0, v.x - Math.cos(angle)*arrowDist, v.y - Math.sin(angle)*arrowDist, color);
           } else {
             const angle = Math.atan2(v.y - u.y, v.x - u.x);
             drawArrow(ctx, u.x, u.y, v.x - Math.cos(angle)*arrowDist, v.y - Math.sin(angle)*arrowDist, color);
           }
        }

        // Draw Weight (Larger)
        ctx.fillStyle = 'white';
        ctx.beginPath(); 
        ctx.arc(midX, midY, 14, 0, 2*Math.PI); 
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#64748b'; 
        ctx.font = 'bold 14px Arial'; 
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(e.weight, midX, midY);
      });

      // Draw Nodes (Larger)
      graphData.nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 30, 0, 2*Math.PI); 
        const isActive = activeNodes.includes(n.id);
        ctx.fillStyle = isActive ? colors.secondary : 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
        ctx.fill();
        ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        ctx.strokeStyle = isActive ? colors.secondary : '#94a3b8';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = isActive ? 'white' : '#1e293b';
        ctx.font = 'bold 16px Arial'; 
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.id, n.x, n.y);

        if(labels[n.id]) {
          ctx.fillStyle = colors.primary;
          ctx.font = 'bold 14px Arial';
          const textWidth = ctx.measureText("D: " + labels[n.id]).width;
          ctx.save();
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.fillRect(n.x - textWidth/2 - 4, n.y - 50, textWidth + 8, 20); 
          ctx.restore();
          ctx.fillText(`D: ${labels[n.id]}`, n.x, n.y - 40);
        }
      });
      ctx.restore();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [graphData, activeNodes, activeEdges, labels, customMode, draggingNodeId]);

  return (
    <>
      <div style={styles.controls}>
        <select value={algo} onChange={e => setAlgo(e.target.value)} style={styles.select}>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
          <option value="dijkstra">Dijkstra</option>
          <option value="kruskal">Kruskal</option>
          <option value="bellmanford">Bellman-Ford</option>
          <option value="floydwarshall">Floyd-Warshall</option>
          <option value="prim">Prim</option>
          <option value="topological">Topological Sort</option>
        </select>
        <button style={styles.btn()} onClick={() => setCustomMode(!customMode)}>
          {customMode ? 'View Graph' : 'Custom Graph'}
        </button>
        {customMode && (
          <>
            <textarea 
              placeholder="Edge List (Source Target Weight)&#10;e.g.&#10;0 1 5&#10;1 2 3&#10;2 0 1" 
              value={edgeListInput} 
              onChange={e => setEdgeListInput(e.target.value)} 
              style={{...styles.select, width: '200px', height: '60px', resize: 'none', fontFamily: 'monospace'}}
            />
            <button style={styles.btn()} onClick={generateFromEdgeList}>Generate</button>
            <button style={styles.btn()} onClick={() => setGraphData({ nodes: [], edges: [] })}>Clear</button>
          </>
        )}
        <button style={styles.btn(true)} onClick={() => run()}>Run</button>
        <span style={{fontSize:'0.8rem', color:'#64748b', marginLeft:'10px'}}> (Drag nodes to fix layout)</span>
      </div>
      <div ref={wrapperRef} style={styles.canvasWrapper}>
        {customMode ? (
          <div style={{padding: '30px', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <h3>Edge List Input Mode</h3>
            <p style={{marginBottom: '10px'}}>Enter edges as "Source Target Weight" (one per line).</p>
            <code style={{background: '#f1f5f9', padding: '15px', borderRadius: '8px', display: 'block', marginBottom: '15px', textAlign: 'left'}}>
              0 1 5<br/>
              1 2 3<br/>
              2 0 10
            </code>
            <p>Nodes will be created automatically based on IDs found.</p>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            style={{display: 'block', width: '100%', height: '100%', cursor: draggingNodeId !== null ? 'grabbing' : 'grab'}} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        )}
      </div>
      <div style={styles.statusFooter}>{msg}</div>
    </>
  );
};

// ... (SearchVisualizer kept as is)
const SearchVisualizer = ({ styles }) => {
  const [arr, setArr] = useState([10, 20, 30, 40, 50]);
  const [target, setTarget] = useState(30);
  const [algo, setAlgo] = useState('linear');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [msg, setMsg] = useState('Ready to search');

  const run = async () => {
    try {
      let searchArr = arr;
      if (algo === 'binary') {
        searchArr = [...arr].sort((a, b) => a - b);
        setArr(searchArr); 
      }
      const res = await axios.post(`${BASE_URL}/search/${algo}`, { array: searchArr, target });
      setSteps(res.data);
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep(c => {
          if (c < res.data.length - 1) return c + 1;
          clearInterval(interval);
          return c;
        });
      }, 500);
    } catch (err) {
      console.error('Error:', err);
      setMsg("Error");
    }
  };

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const s = steps[currentStep];
      setHighlights(s.highlights);
      setMsg(s.description + " | Comparisons: " + s.comparisons);
    }
  }, [currentStep, steps]);

  return (
    <>
      <div style={styles.controls}>
        <input type="text" placeholder="Array (e.g. 1,2,3)" value={arr.join(',')} onChange={e => setArr(e.target.value.split(',').map(Number))} style={{...styles.select, width: '200px'}} />
        <input type="number" placeholder="Target" value={target} onChange={e => setTarget(Number(e.target.value))} style={{...styles.select, width: '100px'}} />
        <select value={algo} onChange={e => setAlgo(e.target.value)} style={styles.select}>
          <option value="linear">Linear Search</option>
          <option value="binary">Binary Search</option>
        </select>
        <button style={styles.btn(true)} onClick={() => run()}>Search</button>
      </div>
      <div style={{...styles.canvasWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
        {arr.map((val, idx) => (
          <div key={idx} style={{
            width: '50px', height: '50px',
            backgroundColor: highlights.includes(idx) ? colors.accent : colors.primary,
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold',
            borderRadius: '8px'
          }}>{val}</div>
        ))}
      </div>
      <div style={styles.statusFooter}>{msg}</div>
    </>
  );
};

// --- UPDATED TREE COMPONENT (Zoom, Pan, Drag - Fixed Selection) ---
const TreeVisualizer = ({ styles }) => {
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [customArr, setCustomArr] = useState('1,2,3,4,5,6,7,8');
  const [edgeList, setEdgeList] = useState('1 2\n1 3\n2 4\n2 5'); 
  const [treeArr, setTreeArr] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [treeType, setTreeType] = useState('sum');
  const [lcaNodes, setLcaNodes] = useState({ n1: 4, n2: 5 });
  const [msg, setMsg] = useState('Click Build');
  
  // View Control States
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [autoZoom, setAutoZoom] = useState(false);

  const NODE_RADIUS = 25;
  const svgRef = useRef(null);
  
  const run = async () => {
    try {
      let res;
      if (treeType === 'lca') {
        const edges = edgeList.trim().split('\n').map(line => {
            const parts = line.trim().split(/\s+/).map(Number);
            if (parts.length < 2 || parts.some(isNaN)) return null;
            return [parts[0], parts[1]];
        }).filter(x => x);
        
        if (edges.length === 0) {
            setMsg("Please enter valid edges");
            return;
        }

        res = await axios.post(`${BASE_URL}/tree/lca`, { 
            edges: edges, 
            n1: Number(lcaNodes.n1), 
            n2: Number(lcaNodes.n2) 
        });
      } else {
        const parsedArr = customArr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        setArr(parsedArr);
        res = await axios.post(`${BASE_URL}/tree/build/${treeType}`, parsedArr);
      }
      setSteps(res.data);
      setPlaying(true);
      setCurrentStep(0);
      // Reset view on new run
      setZoom(1); 
      setPan({ x: 0, y: 0 });
    } catch (err) {
      setMsg("Connection Error: " + err.message);
    }
  };

  useEffect(() => {
    if (playing && steps.length > 0 && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const s = steps[currentStep];
        if (s) { 
            setTreeArr(s.treeArray || []); 
            setHighlights(s.highlights || []);
            setMsg(s.description || '');
        }
        setCurrentStep(c => c + 1);
      }, 800); 
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length && playing) {
      setPlaying(false);
      setMsg("Operation Complete!");
    }
  }, [playing, currentStep, steps]);

  // Handle Mouse Events for Panning
  const handleMouseDown = (e) => {
    // Prevent default text selection behavior
    e.preventDefault();
    setIsPanning(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    e.preventDefault(); // Prevent selection while dragging
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    
    // Increased drag speed multiplier (e.g., 1.5x)
    const dragSpeedMultiplier = 1.5; 
    setPan(prev => ({ 
        x: prev.x - (dx * dragSpeedMultiplier) / zoom, 
        y: prev.y - (dy * dragSpeedMultiplier) / zoom 
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    // Zoom in/out on scroll
    if (e.target.closest('svg')) { // Ensure scrolling only happens over the SVG
        e.preventDefault(); 
        const scaleFactor = 0.1;
        const delta = -Math.sign(e.deltaY) * scaleFactor;
        setZoom(z => Math.max(0.1, Math.min(5, z + delta)));
    }
  };

  // Add wheel listener to SVG specifically
  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
        svg.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
        if (svg) svg.removeEventListener('wheel', handleWheel);
    }
  }, []); 

  const getTreeNodes = () => {
    if (!treeArr || treeArr.length === 0) return { nodes: [], edges: [], bounds: {x:0, y:0, w:100, h:100} };

    const nodes = [];
    const edges = [];
    const maxIndex = treeArr.length;
    const depth = Math.floor(Math.log2(maxIndex)) + 1;
    
    const LEVEL_HEIGHT = 100;
    const maxLeaves = Math.pow(2, depth - 1);
    const totalInternalWidth = Math.max(800, maxLeaves * 70);
    
    const traverse = (i, x, y, level, parentX, parentY) => {
      // Basic visibility check (hide 0s if they mean empty)
      // This applies to ALL tree types (LCA and Heaps) to ensure consistent design
      if (i >= maxIndex) {
          return;
      }
      
      // FIX for Sum/Min/Max Segment Trees: 
      // Do NOT hide node if value is 0 unless it's out of bounds, 
      // because 0 is a valid sum or value.
      // Only hide if we strictly know it's a null placeholder, but in int[] we don't.
      // So we show all nodes up to maxIndex that the backend returns.

      nodes.push({ id: i, val: treeArr[i], x: x, y: y });

      if (parentX !== null) {
        edges.push({ fromX: parentX, fromY: parentY, toX: x, toY: y });
      }

      const spread = totalInternalWidth / Math.pow(2, level + 2); 
      
      traverse(2 * i, x - spread, y + LEVEL_HEIGHT, level + 1, x, y);
      traverse(2 * i + 1, x + spread, y + LEVEL_HEIGHT, level + 1, x, y);
    };

    traverse(1, totalInternalWidth / 2, 50, 0, null, null);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    if (nodes.length > 0) {
      nodes.forEach(n => {
        if(n.x < minX) minX = n.x;
        if(n.x > maxX) maxX = n.x;
        if(n.y < minY) minY = n.y;
        if(n.y > maxY) maxY = n.y;
      });
    } else {
      return { nodes: [], edges: [], bounds: {x:0, y:0, w:100, h:100} };
    }

    const padding = 50;
    const bounds = {
      x: minX - padding,
      y: minY - padding,
      w: (maxX - minX) + padding * 2,
      h: (maxY - minY) + padding * 2
    };

    return { nodes, edges, bounds };
  };

  const { nodes, edges, bounds } = getTreeNodes();

  const renderTreeSVG = () => {
    if (!treeArr || treeArr.length <= 1) return <div style={{padding:'20px', color: '#94a3b8'}}>Ready...</div>;

    let viewBoxX, viewBoxY, viewW, viewH;

    // Auto-Focus Logic overrides manual pan if enabled
    if (autoZoom && highlights.length > 0) {
        let hMinX = Infinity, hMaxX = -Infinity, hMinY = Infinity, hMaxY = -Infinity;
        let found = false;
        nodes.forEach(n => {
            if (highlights.includes(n.id)) {
                if (n.x < hMinX) hMinX = n.x;
                if (n.x > hMaxX) hMaxX = n.x;
                if (n.y < hMinY) hMinY = n.y;
                if (n.y > hMaxY) hMaxY = n.y;
                found = true;
            }
        });

        if (found) {
            const centerX = (hMinX + hMaxX) / 2;
            const centerY = (hMinY + hMaxY) / 2;
            viewW = 600 / zoom; 
            viewH = 400 / zoom;
            viewBoxX = centerX - viewW / 2;
            viewBoxY = centerY - viewH / 2;
        } else {
             viewW = bounds.w / zoom;
             viewH = bounds.h / zoom;
             viewBoxX = (bounds.x + bounds.w/2) - viewW/2 + pan.x;
             viewBoxY = (bounds.y + bounds.h/2) - viewH/2 + pan.y;
        }
    } else {
        const centerX = bounds.x + bounds.w / 2;
        const centerY = bounds.y + bounds.h / 2;
        
        viewW = bounds.w / zoom;
        viewH = bounds.h / zoom;
        
        viewBoxX = (centerX - viewW / 2) + pan.x;
        viewBoxY = (centerY - viewH / 2) + pan.y;
    }

    return (
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        viewBox={`${viewBoxX} ${viewBoxY} ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
            display: 'block', 
            cursor: isPanning ? 'grabbing' : 'grab', 
            transition: isPanning ? 'none' : 'viewBox 0.3s ease-out',
            userSelect: 'none', 
            WebkitUserSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
          </marker>
        </defs>
        
        {edges.map((e, idx) => (
          <line 
            key={`edge-${idx}`}
            x1={e.fromX} y1={e.fromY}
            x2={e.toX} y2={e.toY}
            stroke="#cbd5e1"
            strokeWidth="2"
          />
        ))}

        {nodes.map((n) => {
          const isHighlight = highlights.includes(n.id);
          const isSpecial = n.val === 2147483647 || n.val === -2147483648;
          
          return (
            <g key={`node-${n.id}`}>
              <circle 
                cx={n.x} cy={n.y} r={NODE_RADIUS}
                fill={isHighlight ? colors.accent : colors.primary}
                stroke="white" strokeWidth="2"
                style={{transition: 'fill 0.3s ease'}}
              />
              <text 
                x={n.x} y={n.y} 
                dy=".35em" 
                textAnchor="middle" 
                fill="white" 
                fontWeight="bold"
                fontSize="12px"
                style={{
                    pointerEvents:'none', 
                    userSelect: 'none' 
                }} 
              >
                {isSpecial ? '∞' : n.val}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <>
      <div style={styles.controls}>
        <select value={treeType} onChange={e => setTreeType(e.target.value)} style={styles.select}>
          <option value="sum">Sum Segment Tree</option>
          <option value="min">Min Segment Tree</option>
          <option value="max">Max Segment Tree</option>
          <option value="heap-min">Min Heap</option>
          <option value="heap-max">Max Heap</option>
          <option value="lca">Lowest Common Ancestor</option>
        </select>

        {treeType === 'lca' ? (
          <>
             <textarea 
              placeholder="Edges (Parent Child)&#10;1 2&#10;1 3&#10;2 4" 
              value={edgeList} 
              onChange={e => setEdgeList(e.target.value)} 
              style={{...styles.select, width: '150px', height: '40px', resize: 'none', fontSize: '0.8rem'}}
            />
            <input type="number" placeholder="N1" value={lcaNodes.n1} onChange={e => setLcaNodes({...lcaNodes, n1: Number(e.target.value)})} style={{...styles.select, width: '50px'}} />
            <input type="number" placeholder="N2" value={lcaNodes.n2} onChange={e => setLcaNodes({...lcaNodes, n2: Number(e.target.value)})} style={{...styles.select, width: '50px'}} />
          </>
        ) : (
          <input type="text" placeholder="Array (e.g. 1,2,3,4)" value={customArr} onChange={e => setCustomArr(e.target.value)} style={{...styles.select, width: '180px'}} />
        )}
        
        <button style={styles.btn(true)} onClick={() => run()} disabled={playing}>{treeType === 'lca' ? 'Find LCA' : 'Build'}</button>
        
        {/* Zoom Controls */}
        <div style={{display:'flex', alignItems:'center', gap:'5px', marginLeft: 'auto'}}>
            <button style={{...styles.btn(), backgroundColor: autoZoom ? colors.accent : '#e2e8f0', color: autoZoom ? 'white' : colors.textDark, fontSize:'0.75rem', padding:'6px 10px'}} onClick={() => setAutoZoom(!autoZoom)}>
                {autoZoom ? 'Auto Focus: ON' : 'Auto Focus: OFF'}
            </button>
            <button style={styles.btn()} onClick={() => setZoom(z => Math.max(0.1, z - 0.2))}>-</button>
            <span style={{fontSize:'0.8rem', minWidth:'40px', textAlign:'center'}}>{Math.round(zoom * 100)}%</span>
            <button style={styles.btn()} onClick={() => setZoom(z => Math.min(5, z + 0.2))}>+</button>
        </div>
      </div>
      <div style={styles.canvasWrapper}>
        {renderTreeSVG()}
      </div>
      <div style={styles.statusFooter}>
        {(steps.length > 0 && steps[currentStep]) ? steps[currentStep].description : msg}
      </div>
    </>
  );
};

// ... (DPVisualizer kept same)
const DPVisualizer = ({ styles }) => {
  const [dpType, setDpType] = useState('knapsack');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [msg, setMsg] = useState('Select DP problem');
  
  // Custom inputs
  const [weights, setWeights] = useState('2,3,4,5');
  const [values, setValues] = useState('3,4,5,6');
  const [capacity, setCapacity] = useState(5);
  const [s1, setS1] = useState('ABCBDAB');
  const [s2, setS2] = useState('BDCABA');

  const run = async () => {
    try {
      let res;
      if (dpType === 'knapsack') {
        const w = weights.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const v = values.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        res = await axios.post(`${BASE_URL}/dp/knapsack`, { weights: w, values: v, capacity });
      } else if (dpType === 'lcs') {
        res = await axios.post(`${BASE_URL}/dp/lcs`, { s1, s2 });
      }
      setSteps(res.data);
      setCurrentStep(0);
    } catch (err) {
      setMsg("Error");
    }
  };

  const renderTable = () => {
    if (!steps.length || currentStep >= steps.length) return null;
    const table = steps[currentStep].dpTable;
    
    // Better Table Styling
    const cellStyle = (isActive, isHeader = false) => ({
      width: '40px',
      height: '40px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
      verticalAlign: 'middle',
      backgroundColor: isActive ? colors.accent : (isHeader ? '#f1f5f9' : 'white'),
      color: isActive ? 'white' : colors.textDark,
      fontWeight: isHeader || isActive ? 'bold' : 'normal',
      fontSize: '0.9rem',
      transition: 'background-color 0.2s'
    });

    // LCS Headers
    let colHeaders = null;
    let rowHeaders = null;

    if (dpType === 'lcs') {
      colHeaders = ['Ø', ...s2.split('')];
      rowHeaders = ['Ø', ...s1.split('')];
    } else if (dpType === 'knapsack') {
      // Knapsack headers: Columns are Capacity 0..C, Rows are Items 0..N
      colHeaders = Array.from({length: capacity + 1}, (_, i) => i);
      rowHeaders = Array.from({length: table.length}, (_, i) => i === 0 ? 'Ø' : `I${i}`);
    }

    return (
      <div style={{overflow: 'auto', maxWidth: '100%', maxHeight: '100%'}}>
        <table style={{borderCollapse: 'separate', borderSpacing: '2px', margin: '0 auto'}}>
          {/* Column Headers */}
          {colHeaders && (
            <thead>
              <tr>
                <th></th> {/* Corner */}
                {colHeaders.map((h, i) => (
                  <th key={i} style={cellStyle(false, true)}>{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.map((row, i) => (
              <tr key={i}>
                {/* Row Header */}
                {rowHeaders && <td style={cellStyle(false, true)}>{rowHeaders[i]}</td>}
                {row.map((cell, j) => {
                  const isHighlight = steps[currentStep].highlights.some(h => h[0] === i && h[1] === j);
                  return (
                    <td key={j} style={cellStyle(isHighlight)}>{cell}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div style={styles.controls}>
        <select value={dpType} onChange={e => setDpType(e.target.value)} style={styles.select}>
          <option value="knapsack">0/1 Knapsack</option>
          <option value="lcs">LCS</option>
        </select>
        {dpType === 'knapsack' && (
          <>
            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
              <span style={{fontSize:'0.75rem', color:'#64748b'}}>Weights</span>
              <input type="text" placeholder="2,3,4" value={weights} onChange={e => setWeights(e.target.value)} style={{...styles.select, width: '120px', padding:'6px'}} />
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
              <span style={{fontSize:'0.75rem', color:'#64748b'}}>Values</span>
              <input type="text" placeholder="3,4,5" value={values} onChange={e => setValues(e.target.value)} style={{...styles.select, width: '120px', padding:'6px'}} />
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
              <span style={{fontSize:'0.75rem', color:'#64748b'}}>Cap</span>
              <input type="number" placeholder="5" value={capacity} onChange={e => setCapacity(Number(e.target.value))} style={{...styles.select, width: '60px', padding:'6px'}} />
            </div>
          </>
        )}
        {dpType === 'lcs' && (
          <>
            <input type="text" placeholder="S1" value={s1} onChange={e => setS1(e.target.value)} style={{...styles.select, width: '120px'}} />
            <input type="text" placeholder="S2" value={s2} onChange={e => setS2(e.target.value)} style={{...styles.select, width: '120px'}} />
          </>
        )}
        <button style={styles.btn(true)} onClick={() => run()}>Run</button>
        <button style={styles.btn()} onClick={() => setCurrentStep(c => Math.max(0, c - 1))} disabled={currentStep===0}>Prev</button>
        <button style={styles.btn()} onClick={() => setCurrentStep(c => Math.min(c + 1, steps.length - 1))} disabled={currentStep>=steps.length-1}>Next</button>
      </div>
      <div style={styles.canvasWrapper}>
        {steps.length === 0 ? <div style={{color:'#94a3b8', marginTop:'20px'}}>Enter data and click Run</div> : renderTable()}
      </div>
      <div style={styles.statusFooter}>{steps.length ? steps[currentStep].description : msg}</div>
    </>
  );
};

export default App;