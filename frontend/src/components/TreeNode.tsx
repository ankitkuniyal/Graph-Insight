'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface TreeNodeProps {
  name: string;
  children: any;
  level: number;
}

export function TreeNode({ name, children, level }: TreeNodeProps) {
  const childKeys = Object.keys(children);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: level * 0.05 }}
      style={{ marginLeft: level > 0 ? '1.5rem' : '0' }}
    >
      <div className="tree-node">
        <div className="node-bullet" />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{name}</span>
        {childKeys.length > 0 && (
          <ChevronRight size={14} color="#94a3b8" />
        )}
      </div>
      {childKeys.length > 0 && (
        <div style={{ 
          borderLeft: '1px dashed rgba(255, 255, 255, 0.1)', 
          marginLeft: '4px',
          marginTop: '0.25rem'
        }}>
          {childKeys.map((key) => (
            <TreeNode key={key} name={key} children={children[key]} level={level + 1} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
