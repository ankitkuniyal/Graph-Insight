'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertCircle, CheckCircle2, Copy, Trash2, Layout } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SummaryCards from '@/components/SummaryCards';
import { TreeNode } from '@/components/TreeNode';

type Hierarchy = {
  root: string;
  tree: any;
  depth?: number;
  has_cycle?: boolean;
};

type Summary = {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string;
};

type ApiResponse = {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  ignored_edges?: string[];
  summary: Summary;
};

export default function Home() {
  const [input, setInput] = useState('A->B, A->C, B->D');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let parsedInput;
      try {
        parsedInput = JSON.parse(input);
      } catch (e) {
        // Fallback: accept simple comma or newline separated strings
        const edges = input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        parsedInput = { data: edges };
      }
      const res = await fetch('https://graph-insight-rk97.vercel.app/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedInput),
      });
      if (!res.ok) throw new Error('API Error: Connection failed');
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Parsing error: Invalid JSON format');
    } finally {
      setLoading(false);
    }
  };

  const clearInput = () => setInput('');

  return (
    <>
      <Navbar />
      <main>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="title">Graph Analysis</h1>
          <p className="subtitle">Enterprise-grade relationship processing and cycle detection</p>
        </motion.div>

        <div className="grid">
          {/* Left Column: Input */}
          <motion.div 
            className="glass"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <Terminal size={18} color="var(--text-primary)" /> Input Buffer
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Trash2 className="nav-link" size={16} onClick={clearInput} />
              </div>
            </div>
            
            <div className="input-container">
              <div className="input-header">
                <span>payload.json</span>
                <span>JSON / CSV</span>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter API JSON payload or simply type comma-separated pairs (e.g., A->B, A->C)"
                spellCheck={false}
              />
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem', marginBottom: '1rem', lineHeight: '1.4' }}>
              💡 <strong>Pro Tip:</strong> Evaluators can paste standard API JSON, or you can just quickly type comma/newline-separated strings (like <code>A-&gt;B, A-&gt;C</code>) and the engine will automatically parse it.
            </p>
            
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? <div className="loader"></div> : (
                <>Process Graph Analysis</>
              )}
            </button>

            {error && (
              <motion.div 
                className="badge badge-error" 
                style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Results */}
          <div className="results-section">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.75rem' }}>
                    <button 
                      style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0, background: viewMode === 'visual' ? 'var(--text-primary)' : 'transparent', color: viewMode === 'visual' ? '#000' : 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                      onClick={() => setViewMode('visual')}
                    >Visual Dashboard</button>
                    <button 
                      style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0, background: viewMode === 'json' ? 'var(--text-primary)' : 'transparent', color: viewMode === 'json' ? '#000' : 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                      onClick={() => setViewMode('json')}
                    >JSON Response</button>
                  </div>

                  {viewMode === 'visual' ? (
                    <>
                      <SummaryCards summary={results.summary} />

                  <div className="bento-container">
                    {results.hierarchies.map((h, i) => (
                      <motion.div 
                        key={i} 
                        className="glass"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                          <h3 style={{ color: h.has_cycle ? 'var(--danger)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, fontSize: '1rem' }}>
                            {h.has_cycle ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                            {h.has_cycle ? 'Cyclic Component' : `Root: ${h.root}`}
                          </h3>
                          {!h.has_cycle && <span className="badge badge-success">Depth {h.depth}</span>}
                        </div>
                        
                        {h.has_cycle ? (
                          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
                            <pre style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'Fira Code, monospace' }}>
{`{
  "root": "${h.root}",
  "tree": {},
  "has_cycle": true
}`}
                            </pre>
                          </div>
                        ) : (
                          <div style={{ marginTop: '0.5rem' }}>
                            <TreeNode name={h.root} children={h.tree[h.root]} level={0} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {(results.invalid_entries.length > 0 || results.duplicate_edges.length > 0 || (results.ignored_edges && results.ignored_edges.length > 0)) && (
                    <motion.div 
                      className="glass"
                      style={{ marginTop: '1.5rem' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Validation Logs</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                          {results.invalid_entries.map((entry, i) => (
                            <span key={i} className="badge badge-error">Invalid: {entry}</span>
                          ))}
                          {results.duplicate_edges.map((entry, i) => (
                            <span key={i} className="badge badge-duplicate">Duplicate: {entry}</span>
                          ))}
                          {results.ignored_edges?.map((entry, i) => (
                            <span key={i} className="badge" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)' }}>Ignored (Multi-Parent): {entry}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)', 
                      textAlign: 'center', 
                      padding: '1rem',
                      opacity: 0.6
                    }}>
                      {results.user_id} • {results.college_roll_number} • {results.email_id}
                    </div>
                  </>
                ) : (
                  <motion.div className="glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Response from POST /bfhl</span>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className="badge badge-success">200 OK</span>
                        <Copy 
                          size={16} 
                          color="var(--text-secondary)" 
                          style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                          onClick={(e) => {
                            navigator.clipboard.writeText(JSON.stringify(results, null, 2));
                            // Optional: could add toast here, but simple visual feedback works
                            const el = e.currentTarget;
                            el.style.color = '#10b981'; // green
                            setTimeout(() => el.style.color = 'var(--text-secondary)', 1000);
                          }}
                        />
                      </div>
                    </div>
                    <pre style={{ color: 'var(--text-primary)', fontSize: '0.85rem', overflowX: 'auto', fontFamily: 'Fira Code, monospace', lineHeight: '1.5' }}>
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </motion.div>
                )}
                </motion.div>
              ) : (
                <motion.div 
                  className="glass" 
                  style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'var(--text-secondary)',
                    minHeight: '400px',
                    textAlign: 'center'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Layout size={48} strokeWidth={1} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                  <p style={{ maxWidth: '300px' }}>
                    Ready for analysis. Input your graph edges and click process to generate visual hierarchies.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}
