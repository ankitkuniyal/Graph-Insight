'use client';

import { motion } from 'framer-motion';
import { Network, Search, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav>
      <div className="nav-content">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ 
            background: 'var(--text-primary)',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex'
          }}>
            <Network size={18} color="#000" />
          </div>
          GraphInsight
        </motion.div>

        <motion.div 
          className="nav-links"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="nav-link">Overview</span>
          <span className="nav-link">Hierarchies</span>
          <span className="nav-link">Settings</span>
        </motion.div>

        <motion.div 
          style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Search className="nav-link" size={18} />
          <Menu className="nav-link" size={18} />
        </motion.div>
      </div>
    </nav>
  );
}
