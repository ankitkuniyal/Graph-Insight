'use client';

import { motion } from 'framer-motion';
import { TreePine, Repeat, Maximize } from 'lucide-react';

interface SummaryProps {
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export default function SummaryCards({ summary }: SummaryProps) {
  const cards = [
    { label: 'Total Trees', value: summary.total_trees, icon: <TreePine size={20} color="var(--text-primary)" /> },
    { label: 'Total Cycles', value: summary.total_cycles, icon: <Repeat size={20} color="var(--text-secondary)" /> },
    { label: 'Largest Tree Root', value: summary.largest_tree_root || 'N/A', icon: <Maximize size={20} color="var(--text-secondary)" /> },
  ];

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div className="summary-grid" style={{ marginBottom: '0.75rem' }}>
        {cards.map((card, i) => (
          <motion.div 
            key={card.label}
            className="glass stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', opacity: 0.8 }}>
              {card.icon}
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </motion.div>
        ))}
      </div>
      {summary.largest_tree_root && (
        <motion.p 
          style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Tree rooted at <strong>{summary.largest_tree_root}</strong> has the maximum depth (longest root-to-leaf path).
        </motion.p>
      )}
    </div>
  );
}
