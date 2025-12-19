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
    // Sidebar: Mobile Overlay vs Desktop Fixed
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
      padding: '0 20px', // Reduced padding for mobile
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
      padding: isMobile ? '15px' : '30px', // Responsive padding
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden', // Prevent outer scroll
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
    // Visualizer Inner Components
    canvasWrapper: {
      flex: 1,
      position: 'relative',
      backgroundColor: '#ffffff',
      width: '100%',
      height: '100%',
      minHeight: '300px', // Minimum height for chart
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
      flexWrap: 'wrap', // Important for mobile wrapping
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
      minWidth: isMobile ? '100%' : '180px', // Full width on mobile
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
      flexShrink: 0 // Prevent footer from shrinking
    }
  };

  const handleNavClick = (t) => {
    setTab(t);
    setIsMobileMenuOpen(false); // Close menu on selection
  };

  return (
    <div style={styles.app}>
      {/* Mobile Menu Overlay */}
      <div style={styles.menuOverlay} onClick={() => setIsMobileMenuOpen(false)} />

      {/* SIDEBAR */}
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

      {/* MAIN AREA */}
      <main style={styles.main}>
        {/* TOP BAR */}
        <header style={styles.topbar}>
          <button style={styles.menuBtn} onClick={() => setIsMobileMenuOpen(true)}>☰</button>
          <h2 style={{margin: 0, fontSize: '1.25rem', fontWeight: '700', color: colors.textDark}}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Algorithms
          </h2>
        </header>

        {/* CONTENT */}
        <div style={styles.contentArea}>
          <div style={styles.visualizerCard}>
            {/* Pass styles prop to children so they reuse the layout logic */}
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

// --- SORTING COMPONENT ---
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

  // Handle Resize
  useEffect(() => {
    const handleResize = () => generate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generate = () => {
    if(!containerRef.current) return;
    let newArr;
    if (customInput.trim()) {
      newArr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    } else {
      const width = containerRef.current.offsetWidth;
      const count = Math.floor(width / 20);
      newArr = Array.from({ length: Math.min(count, 40) }, () => Math.floor(Math.random() * 90) + 5);
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
        <input type="text" placeholder="Custom array (e.g. 1,2,3)" value={customInput} onChange={e => setCustomInput(e.target.value)} style={{...styles.select, width: '200px'}} disabled={playing} />
        <button style={styles.btn()} onClick={() => generate()} disabled={playing}>Generate</button>
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
          <input type="range" min="10" max="500" value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{width: '100px'}} />
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
  
  // Graph Editor states
  const [editorMode, setEditorMode] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [adjMatrix, setAdjMatrix] = useState('');
  const [matrixMode, setMatrixMode] = useState(false);

  const run = async () => {
    try {
      let payload = null;
      if (editorMode && graphData.nodes.length > 0) {
        payload = {
          nodes: graphData.nodes.map(n => ({ id: n.id, x: n.x, y: n.y })),
          edges: graphData.edges.map(e => ({ source: e.source, target: e.target, weight: e.weight }))
        };
      }
      const res = await axios.post(`${BASE_URL}/graph/${algo}`, payload);
      setGraphData({ nodes: res.data.nodes, edges: res.data.edges });
      setSteps(res.data.steps);
      setPlaying(true);
      setCurrentStep(0);
    } catch (err) {
      setMsg("Backend connection failed");
    }
  };

  // Graph Editor Functions
  const addNode = (x, y) => {
    const newId = Math.max(...graphData.nodes.map(n => n.id), 0) + 1;
    setGraphData(prev => ({
      ...prev,
      nodes: [...prev.nodes, { id: newId, x, y }]
    }));
  };

  const removeNode = (id) => {
    setGraphData(prev => ({
      nodes: prev.nodes.filter(n => n.id !== id),
      edges: prev.edges.filter(e => e.source !== id && e.target !== id)
    }));
  };

  const addEdge = (source, target) => {
    if (source === target) return;
    const exists = graphData.edges.some(e => 
      (e.source === source && e.target === target) || (e.source === target && e.target === source)
    );
    if (!exists) {
      setGraphData(prev => ({
        ...prev,
        edges: [...prev.edges, { source, target, weight: 1 }]
      }));
    }
  };

  const generateFromMatrix = () => {
    const rows = adjMatrix.trim().split('\n').map(r => r.trim().split(/\s+/).map(Number));
    const n = rows.length;
    if (n === 0 || rows[0].length !== n) {
      alert('Invalid matrix format. Must be square matrix.');
      return;
    }
    const nodes = [];
    const edges = [];
    
    for (let i = 0; i < n; i++) {
      nodes.push({ id: i, x: 100 + i * 100, y: 150 });
      for (let j = i + 1; j < n; j++) {
        if (rows[i][j] > 0) {
          edges.push({ source: i, target: j, weight: rows[i][j] });
        }
      }
    }
    
    setGraphData({ nodes, edges });
    setMatrixMode(false); // Switch to visual mode after generating
  };

  const handleCanvasClick = (e) => {
    console.log('Canvas clicked!', e.clientX, e.clientY);
    if (!editorMode || matrixMode || dragging !== null) return; // Prevent click during drag
    const cvs = canvasRef.current;
    const rect = cvs.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    console.log('Relative coords:', x, y);

    // Transform coordinates to match the drawing coordinate system
    const w = cvs.width;
    const h = cvs.height;
    const baseWidth = 500;
    const baseHeight = 400;
    const scale = Math.min(w / baseWidth, h / baseHeight) * 0.7;
    const offsetX = (w - (baseWidth * scale)) / 2;
    const offsetY = (h - (baseHeight * scale)) / 2;

    x = (x - offsetX) / scale;
    y = (y - offsetY) / scale;

    console.log('Transformed coords:', x, y);

    // Check if clicked on node (with larger hit area for better UX)
    const clickedNode = graphData.nodes.find(n => {
      const dx = x - n.x;
      const dy = y - n.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      console.log('Node', n.id, 'at', n.x, n.y, 'distance:', distance);
      return distance < 35; // Increased from 28 for easier clicking
    });

    console.log('Clicked node:', clickedNode);

    if (clickedNode) {
      if (selectedNode === null) {
        setSelectedNode(clickedNode.id);
        console.log('Selected node:', clickedNode.id);
      } else if (selectedNode === clickedNode.id) {
        setSelectedNode(null);
        console.log('Deselected node');
      } else {
        addEdge(selectedNode, clickedNode.id);
        setSelectedNode(null);
        console.log('Added edge between', selectedNode, 'and', clickedNode.id);
      }
    } else {
      // Only add node if not clicking on existing node
      addNode(x, y);
      console.log('Added node at', x, y);
    }
  };

  const handleMouseDown = (e) => {
    console.log('Mouse down!', e.clientX, e.clientY);
    if (!editorMode || matrixMode) return;
    const cvs = canvasRef.current;
    const rect = cvs.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Transform coordinates
    const w = cvs.width;
    const h = cvs.height;
    const baseWidth = 500;
    const baseHeight = 400;
    const scale = Math.min(w / baseWidth, h / baseHeight) * 0.7;
    const offsetX = (w - (baseWidth * scale)) / 2;
    const offsetY = (h - (baseHeight * scale)) / 2;

    x = (x - offsetX) / scale;
    y = (y - offsetY) / scale;

    const node = graphData.nodes.find(n => {
      const dx = x - n.x;
      const dy = y - n.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      console.log('Mouse down on node', n.id, 'distance:', distance);
      return distance < 35; // Match click detection radius
    });

    console.log('Dragging node:', node);
    if (node) {
      setDragging(node.id);
    }
  };

  const handleMouseMove = (e) => {
    if (!editorMode || matrixMode || dragging === null) return;
    const cvs = canvasRef.current;
    const rect = cvs.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Transform coordinates
    const w = cvs.width;
    const h = cvs.height;
    const baseWidth = 500;
    const baseHeight = 400;
    const scale = Math.min(w / baseWidth, h / baseHeight) * 0.7;
    const offsetX = (w - (baseWidth * scale)) / 2;
    const offsetY = (h - (baseHeight * scale)) / 2;

    x = (x - offsetX) / scale;
    y = (y - offsetY) / scale;

    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(n =>
        n.id === dragging ? { ...n, x, y } : n
      )
    }));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleKeyDown = (e) => {
    if (selectedNode !== null && e.key === 'Delete') {
      removeNode(selectedNode);
      setSelectedNode(null);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  // Separate useEffect for mouse listeners
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    if (editorMode && !matrixMode) {
      cvs.addEventListener('mousedown', handleMouseDown);
      cvs.addEventListener('mousemove', handleMouseMove);
      cvs.addEventListener('mouseup', handleMouseUp);
      cvs.addEventListener('click', handleCanvasClick);
      return () => {
        cvs.removeEventListener('mousedown', handleMouseDown);
        cvs.removeEventListener('mousemove', handleMouseMove);
        cvs.removeEventListener('mouseup', handleMouseUp);
        cvs.removeEventListener('click', handleCanvasClick);
      };
    }
  }, [editorMode, matrixMode]);

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

  useEffect(() => {
    const cvs = canvasRef.current;
    const wrapper = wrapperRef.current;
    if(!cvs || !wrapper) return;

    const resizeCanvas = () => {
      cvs.width = wrapper.clientWidth;
      cvs.height = wrapper.clientHeight;
      draw();
    };

    const draw = () => {
      const ctx = cvs.getContext('2d');
      const w = cvs.width;
      const h = cvs.height;
      ctx.clearRect(0,0, w, h);

      if (editorMode && matrixMode) {
        ctx.fillStyle = '#1e293b';
        ctx.font = '16px Arial';
        ctx.fillText('Matrix Input Mode', 20, 30);
        return;
      }

      // Scaling: Fit graph into view
      const baseWidth = 500;
      const baseHeight = 400;
      // Calculate scale factor, keeping aspect ratio somewhat but ensuring visibility
      const scale = Math.min(w / baseWidth, h / baseHeight) * 0.7; 
      const offsetX = (w - (baseWidth * scale)) / 2;
      const offsetY = (h - (baseHeight * scale)) / 2;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      graphData.edges.forEach(e => {
        const u = graphData.nodes.find(n => n.id === e.source);
        const v = graphData.nodes.find(n => n.id === e.target);
        if(!u || !v) return;

        const isHigh = activeEdges.some(ae => 
          (ae[0]===e.source && ae[1]===e.target) || (ae[0]===e.target && ae[1]===e.source)
        );

        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(v.x, v.y);
        ctx.strokeStyle = isHigh ? colors.danger : '#cbd5e1';
        ctx.lineWidth = isHigh ? 6 : 3;
        ctx.stroke();

        const mx = (u.x+v.x)/2;
        const my = (u.y+v.y)/2;
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(mx, my, 12, 0, 2*Math.PI); ctx.fill();
        ctx.fillStyle = '#64748b'; ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(e.weight, mx, my);
      });

      graphData.nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 28, 0, 2*Math.PI);
        const isActive = activeNodes.includes(n.id);
        const isSelected = selectedNode === n.id;
        ctx.fillStyle = isActive ? colors.secondary : isSelected ? colors.accent : 'white';
        ctx.fill();
        ctx.strokeStyle = isActive ? colors.secondary : isSelected ? colors.accent : '#94a3b8';
        ctx.lineWidth = isSelected ? 4 : 3;
        ctx.stroke();
        ctx.fillStyle = isActive ? 'white' : '#1e293b';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(n.id, n.x, n.y);

        if(labels[n.id]) {
          ctx.fillStyle = colors.primary;
          ctx.font = 'bold 14px Arial';
          ctx.fillText(labels[n.id], n.x, n.y - 40);
        }
      });
      ctx.restore();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [graphData, activeNodes, activeEdges, labels, editorMode, matrixMode, selectedNode, dragging]);

  return (
    <>
      <div style={styles.controls}>
        <select value={algo} onChange={e => setAlgo(e.target.value)} style={styles.select} disabled={playing}>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
          <option value="dijkstra">Dijkstra</option>
          <option value="kruskal">Kruskal</option>
          <option value="bellmanford">Bellman-Ford</option>
          <option value="floydwarshall">Floyd-Warshall</option>
          <option value="prim">Prim</option>
          <option value="topological">Topological Sort</option>
        </select>
        <button style={styles.btn()} onClick={() => setEditorMode(!editorMode)} disabled={playing}>
          {editorMode ? 'Use Default' : 'Custom Graph'}
        </button>
        {editorMode && (
          <>
            <button style={styles.btn()} onClick={() => setMatrixMode(!matrixMode)} disabled={playing}>
              {matrixMode ? 'Visual Editor' : 'Matrix Input'}
            </button>
            {matrixMode && (
              <>
                <textarea 
                  placeholder="Adjacency Matrix (space separated, one row per line)" 
                  value={adjMatrix} 
                  onChange={e => setAdjMatrix(e.target.value)} 
                  style={{...styles.select, width: '250px', height: '40px', resize: 'none'}}
                  disabled={playing}
                />
                <button style={styles.btn()} onClick={generateFromMatrix} disabled={playing}>Generate</button>
              </>
            )}
            <button style={styles.btn()} onClick={() => setGraphData({ nodes: [], edges: [] })} disabled={playing}>Clear</button>
          </>
        )}
        <button style={styles.btn(true)} onClick={() => run()} disabled={playing}>Run</button>
      </div>
      <div ref={wrapperRef} style={styles.canvasWrapper}>
        {editorMode && matrixMode ? (
          <div style={{padding: '20px', color: '#94a3b8'}}>
            <h3>Adjacency Matrix Input</h3>
            <p>Enter the adjacency matrix above. Use 0 for no edge, positive numbers for edge weights.</p>
            <p>Example for 3 nodes:</p>
            <pre>0 1 2
1 0 3
2 3 0</pre>
          </div>
        ) : (
          <canvas ref={canvasRef} style={{display: 'block', width: '100%', height: '100%'}} />
        )}
      </div>
      <div style={styles.statusFooter}>
        {editorMode ? 'Editor Mode: Click to add nodes, select two nodes to add edge, drag to move' : msg}
      </div>
    </>
  );
};

// --- TREE COMPONENT ---
const TreeVisualizer = ({ styles }) => {
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [customArr, setCustomArr] = useState('1,2,3,4,5,6,7,8');
  const [treeArr, setTreeArr] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [msg, setMsg] = useState('Click Build');

  const run = async () => {
    try {
      const parsedArr = customArr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      setArr(parsedArr);
      const res = await axios.post(`${BASE_URL}/tree/build`, parsedArr);
      setSteps(res.data);
      setPlaying(true);
      setCurrentStep(0);
    } catch (err) {
      setMsg("Connection Error");
    }
  };

  useEffect(() => {
    if (playing && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const s = steps[currentStep];
        setTreeArr(s.treeArray);
        setHighlights(s.highlights);
        setMsg(s.description);
        setCurrentStep(c => c + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length && playing) {
      setPlaying(false);
      setMsg("Segment Tree Built!");
    }
  }, [playing, currentStep, steps]);

  const renderTree = () => {
    if(!treeArr || treeArr.length === 0) return <div style={{padding:'20px', color: '#94a3b8'}}>Ready...</div>;
    
    const levels = [];
    let idx = 1; let size = 1;
    while(idx < treeArr.length && levels.length < 6) {
      const lvl = [];
      for(let i=0; i<size; i++) {
        if(idx < treeArr.length) lvl.push({val: treeArr[idx], id: idx});
        idx++;
      }
      levels.push(lvl);
      size *= 2;
    }

    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent: 'center', height: '100%', gap: '2vh'}}>
        {levels.map((lvl, lIdx) => (
          <div key={lIdx} style={{display:'flex', gap: '1vw'}}>
            {lvl.map(n => (
              <div key={n.id} style={{
                width: '3vw', height: '3vw', minWidth: '35px', minHeight: '35px',
                borderRadius: '50%',
                backgroundColor: highlights.includes(n.id) ? colors.accent : (n.val===0 ? '#f1f5f9' : colors.primary),
                color: n.val===0 ? '#cbd5e1' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '0.9rem',
                border: n.val === 0 ? '1px dashed #cbd5e1' : 'none',
                transition: 'all 0.3s'
              }}>
                {n.val}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div style={styles.controls}>
        <input type="text" placeholder="Array (e.g. 1,2,3,4)" value={customArr} onChange={e => setCustomArr(e.target.value)} style={{...styles.select, width: '200px'}} />
        <button style={styles.btn(true)} onClick={() => run()} disabled={playing}>Build</button>
      </div>
      <div style={styles.canvasWrapper}>{renderTree()}</div>
      <div style={styles.statusFooter}>{msg}</div>
    </>
  );
};

// --- SEARCH COMPONENT ---
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
        setArr(searchArr); // Update display to sorted
      }
      console.log('Sending:', { array: searchArr, target });
      const res = await axios.post(`${BASE_URL}/search/${algo}`, { array: searchArr, target });
      console.log('Response:', res.data);
      setSteps(res.data);
      setCurrentStep(0);
      // Auto play
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

// --- DP COMPONENT ---
const DPVisualizer = ({ styles }) => {
  const [dpType, setDpType] = useState('knapsack');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [msg, setMsg] = useState('Select DP problem');
  
  // Custom inputs
  const [weights, setWeights] = useState('1,2,3');
  const [values, setValues] = useState('10,20,30');
  const [capacity, setCapacity] = useState(5);
  const [s1, setS1] = useState('ABC');
  const [s2, setS2] = useState('ACB');
  const [dims, setDims] = useState('10,20,30,40');

  const run = async () => {
    try {
      let res;
      if (dpType === 'knapsack') {
        const w = weights.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        const v = values.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        res = await axios.post(`${BASE_URL}/dp/knapsack`, { weights: w, values: v, capacity });
      } else if (dpType === 'lcs') {
        res = await axios.post(`${BASE_URL}/dp/lcs`, { s1, s2 });
      } else if (dpType === 'matrixchain') {
        const d = dims.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        res = await axios.post(`${BASE_URL}/dp/matrixchain`, d);
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
    return (
      <table style={{borderCollapse: 'collapse', margin: '20px'}}>
        <tbody>
          {table.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{border: '1px solid black', padding: '5px', background: steps[currentStep].highlights.some(h => h[0] === i && h[1] === j) ? colors.accent : 'white'}}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div style={styles.controls}>
        <select value={dpType} onChange={e => setDpType(e.target.value)} style={styles.select}>
          <option value="knapsack">0/1 Knapsack</option>
          <option value="lcs">LCS</option>
          <option value="matrixchain">Matrix Chain</option>
        </select>
        {dpType === 'knapsack' && (
          <>
            <input type="text" placeholder="Weights (e.g. 1,2,3)" value={weights} onChange={e => setWeights(e.target.value)} style={{...styles.select, width: '150px'}} />
            <input type="text" placeholder="Values (e.g. 10,20,30)" value={values} onChange={e => setValues(e.target.value)} style={{...styles.select, width: '150px'}} />
            <input type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(Number(e.target.value))} style={{...styles.select, width: '100px'}} />
          </>
        )}
        {dpType === 'lcs' && (
          <>
            <input type="text" placeholder="String 1" value={s1} onChange={e => setS1(e.target.value)} style={{...styles.select, width: '120px'}} />
            <input type="text" placeholder="String 2" value={s2} onChange={e => setS2(e.target.value)} style={{...styles.select, width: '120px'}} />
          </>
        )}
        {dpType === 'matrixchain' && (
          <input type="text" placeholder="Dimensions (e.g. 10,20,30)" value={dims} onChange={e => setDims(e.target.value)} style={{...styles.select, width: '180px'}} />
        )}
        <button style={styles.btn(true)} onClick={() => run()}>Run</button>
        <button style={styles.btn()} onClick={() => setCurrentStep(c => Math.min(c + 1, steps.length - 1))}>Next Step</button>
      </div>
      <div style={styles.canvasWrapper}>
        {renderTable()}
      </div>
      <div style={styles.statusFooter}>{steps.length ? steps[currentStep].description : msg}</div>
    </>
  );
};

export default App;