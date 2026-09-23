import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator as CalcIcon, Code, Network, FileCode2, Play, RotateCcw, Plus, Trash2, ExternalLink } from 'lucide-react';

const Tools = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'calculator';
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // --- CALCULATOR STATE ---
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcHistory, setCalcHistory] = useState('');

  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcHistory('');
      return;
    }
    if (val === 'DEL') {
      setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '=') {
      try {
        // Safe math calculation
        const result = Function(`"use strict"; return (${calcDisplay.replace(/×/g, '*').replace(/÷/g, '/')})`)();
        setCalcHistory(`${calcDisplay} =`);
        setCalcDisplay(String(result));
      } catch (err) {
        setCalcDisplay('Error');
      }
      return;
    }

    setCalcDisplay((prev) => {
      if (prev === '0' || prev === 'Error') return val;
      return prev + val;
    });
  };

  // --- CODE EDITOR STATE ---
  const defaultHtml = `<div className="card">
  <h1>Hello, Student OS! 🚀</h1>
  <p>Write custom HTML, CSS, and JS right here in your live code sandbox.</p>
  <button onclick="alert('Student Life OS Code Sandbox!')">Click Me</button>
</div>`;

  const defaultCss = `body {
  font-family: 'Inter', sans-serif;
  background: #f4f5fb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  text-align: center;
}
h1 { color: #4f46e5; margin-bottom: 10px; }
button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}`;

  const defaultJs = `console.log('Sandbox live!');`;

  const [codeHtml, setCodeHtml] = useState(defaultHtml);
  const [codeCss, setCodeCss] = useState(defaultCss);
  const [codeJs, setCodeJs] = useState(defaultJs);
  const [codeSrcDoc, setCodeSrcDoc] = useState('');

  const runCode = () => {
    const combined = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${codeCss}</style>
        </head>
        <body>
          ${codeHtml}
          <script>${codeJs}</script>
        </body>
      </html>
    `;
    setCodeSrcDoc(combined);
  };

  useEffect(() => {
    runCode();
  }, []);

  const resetCode = () => {
    setCodeHtml(defaultHtml);
    setCodeCss(defaultCss);
    setCodeJs(defaultJs);
    runCode();
  };

  // --- FLOWCHART STATE ---
  const [nodes, setNodes] = useState([
    { id: '1', title: 'Start Revision', type: 'start' },
    { id: '2', title: 'Review DBMS Normalization', type: 'process' },
    { id: '3', title: 'Solve 10 Practice Problems', type: 'process' },
    { id: '4', title: 'Self Quiz Passed?', type: 'decision' },
    { id: '5', title: 'Complete Exam Prep 🎯', type: 'end' }
  ]);
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeType, setNewNodeType] = useState('process');

  const addNode = (e) => {
    if (e) e.preventDefault();
    if (!newNodeTitle.trim()) return;
    const newNode = {
      id: String(Date.now()),
      title: newNodeTitle,
      type: newNodeType
    };
    setNodes([...nodes, newNode]);
    setNewNodeTitle('');
  };

  const deleteNode = (id) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  // --- PDF NOTES STATE ---
  const [pdfList, setPdfList] = useState([
    { id: '1', title: 'Data Structures Quick Cheat Sheet', subject: 'Data Structures', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: '2', title: 'Database Systems Fundamentals Chapter 1', subject: 'DBMS', url: 'https://www.db-book.com' },
    { id: '3', title: 'Operating Systems Process State Machine', subject: 'OS', url: 'https://www.gnu.org/software/libc/manual/pdf/libc.pdf' }
  ]);
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfUrl, setNewPdfUrl] = useState('');
  const [newPdfSubject, setNewPdfSubject] = useState('Computer Science');

  const addPdf = (e) => {
    e.preventDefault();
    if (!newPdfTitle || !newPdfUrl) return;
    setPdfList([
      ...pdfList,
      {
        id: String(Date.now()),
        title: newPdfTitle,
        url: newPdfUrl,
        subject: newPdfSubject
      }
    ]);
    setNewPdfTitle('');
    setNewPdfUrl('');
  };

  const deletePdf = (id) => {
    setPdfList(pdfList.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Student Tools & Suite</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Interactive tools including Calculator, Live Sandbox, Flowcharts, and Study PDFs</p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'calculator', label: 'Calculator', icon: CalcIcon },
          { id: 'editor', label: 'Code Editor', icon: Code },
          { id: 'flowchart', label: 'Flowcharts', icon: Network },
          { id: 'pdf', label: 'PDF Notes Hub', icon: FileCode2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="max-w-md mx-auto card-soft p-6 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-5 text-right font-mono text-white space-y-1 border border-slate-800">
            <p className="text-xs text-slate-400 h-5">{calcHistory}</p>
            <h2 className="text-3xl font-bold tracking-wider truncate">{calcDisplay}</h2>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {['C', 'DEL', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((item) => (
              <button
                key={item}
                onClick={() => handleCalcClick(item)}
                className={`py-4 rounded-xl font-bold text-base transition-all active:scale-95 shadow-sm ${
                  item === '='
                    ? 'col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white'
                    : ['÷', '×', '-', '+', '%'].includes(item)
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200'
                    : ['C', 'DEL'].includes(item)
                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 hover:bg-rose-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CODE EDITOR */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Live HTML / CSS / JS Playground</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={runCode}
                className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Code</span>
              </button>
              <button
                onClick={resetCode}
                className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">HTML</label>
                <textarea
                  rows={5}
                  value={codeHtml}
                  onChange={(e) => setCodeHtml(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl focus:outline-none border border-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CSS</label>
                <textarea
                  rows={5}
                  value={codeCss}
                  onChange={(e) => setCodeCss(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl focus:outline-none border border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Live Output Preview</label>
              <iframe
                title="Code Sandbox Preview"
                srcDoc={codeSrcDoc}
                className="w-full h-[360px] bg-white rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FLOWCHART CREATOR */}
      {activeTab === 'flowchart' && (
        <div className="space-y-6">
          <form onSubmit={addNode} className="card-soft p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              required
              value={newNodeTitle}
              onChange={(e) => setNewNodeTitle(e.target.value)}
              placeholder="Enter flowchart step (e.g. Solve Practice Set)..."
              className="w-full sm:flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={newNodeType}
              onChange={(e) => setNewNodeType(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="process">Process Step (Box)</option>
              <option value="decision">Decision Step (Yellow)</option>
              <option value="end">Target Step (Purple)</option>
            </select>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shrink-0 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Step</span>
            </button>
          </form>

          <div className="card-soft p-8 flex flex-col items-center space-y-4 max-w-2xl mx-auto">
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
              Study Workflow Diagram
            </h4>

            {nodes.map((node, index) => (
              <React.Fragment key={node.id}>
                <div className={`w-full max-w-md p-4 rounded-2xl flex items-center justify-between border shadow-sm transition-transform hover:scale-105 ${
                  node.type === 'start' || node.type === 'end'
                    ? 'bg-indigo-600 text-white border-indigo-700 font-bold text-center justify-center'
                    : node.type === 'decision'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                }`}>
                  <span className="text-sm">{node.title}</span>
                  {node.type !== 'start' && node.type !== 'end' && (
                    <button
                      onClick={() => deleteNode(node.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {index < nodes.length - 1 && (
                  <div className="w-0.5 h-8 bg-indigo-400 dark:bg-indigo-600 relative">
                    <div className="w-2 h-2 border-r-2 border-b-2 border-indigo-400 dark:border-indigo-600 transform rotate-45 absolute bottom-0 -left-[3px]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PDF NOTES HUB */}
      {activeTab === 'pdf' && (
        <div className="space-y-6">
          <form onSubmit={addPdf} className="card-soft p-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              value={newPdfTitle}
              onChange={(e) => setNewPdfTitle(e.target.value)}
              placeholder="PDF Document Title..."
              className="sm:col-span-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
            <input
              type="url"
              required
              value={newPdfUrl}
              onChange={(e) => setNewPdfUrl(e.target.value)}
              placeholder="PDF Link (https://...)"
              className="sm:col-span-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
            <input
              type="text"
              value={newPdfSubject}
              onChange={(e) => setNewPdfSubject(e.target.value)}
              placeholder="Subject / Category"
              className="sm:col-span-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
            <button
              type="submit"
              className="sm:col-span-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add PDF</span>
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pdfList.map((pdf) => (
              <div key={pdf.id} className="card-soft p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                      PDF Document
                    </span>
                    <button
                      onClick={() => deletePdf(pdf.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">{pdf.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{pdf.subject}</p>
                </div>

                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 font-bold text-xs transition-colors"
                >
                  <span>Open PDF Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tools;
