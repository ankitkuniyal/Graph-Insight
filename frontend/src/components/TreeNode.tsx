'use client';

import { motion } from 'framer-motion';

interface TreeNodeProps {
  name: string;
  children: any;
  level: number;
}

export function TreeNode({ name, children, level }: TreeNodeProps) {
  const childKeys = Object.keys(children).sort();
  
  return (
    <div style={{ position: 'relative' }}>
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.05 }}
        style={{ position: 'relative', zIndex: 1, padding: '0.35rem 0' }}
      >
        {/* Horizontal connector to vertical parent line */}
        {level > 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            width: '1.5rem',
            height: '2px',
            background: 'var(--border-color)',
            zIndex: -1,
            transform: 'translateY(-50%)'
          }} />
        )}

        <div className="tree-node" style={{ 
          marginLeft: level > 0 ? '1.5rem' : '0',
          background: level === 0 ? 'rgba(59, 130, 246, 0.1)' : 'var(--card-bg)',
          borderColor: level === 0 ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)',
          boxShadow: level === 0 ? '0 0 20px rgba(59, 130, 246, 0.05)' : 'none',
          padding: '0.5rem 0.85rem'
        }}>
          <div className="node-bullet" style={{ 
            background: level === 0 ? '#3b82f6' : 'var(--text-secondary)',
            boxShadow: level === 0 ? '0 0 10px #3b82f6' : 'none'
          }} />
          <span style={{ 
            fontWeight: level === 0 ? 700 : 500, 
            fontSize: level === 0 ? '1rem' : '0.9rem',
            color: level === 0 ? '#fff' : 'var(--text-primary)'
          }}>{name}</span>
          
          {childKeys.length > 0 && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px' }}>
              {childKeys.length} CHILD{childKeys.length > 1 ? 'REN' : ''}
            </span>
          )}
        </div>
      </motion.div>
      
      {childKeys.length > 0 && (
        <div style={{ position: 'relative', marginLeft: '1.1rem' }}>
          {/* Vertical line covering the span of the children */}
          <div style={{
            position: 'absolute',
            top: '-1rem', // Reach up to parent
            bottom: '1.25rem', // Stop at last child's center
            left: 0,
            width: '2px',
            background: 'var(--border-color)',
            zIndex: 0
          }} />
          
          {childKeys.map((key) => (
            <TreeNode 
              key={key} 
              name={key} 
              children={children[key]} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
