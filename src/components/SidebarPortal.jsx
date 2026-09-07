import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * SidebarPortal: Projects children (such as InventoryTray or contextual sidebars)
 * directly into the global 20% right sidebar slot (#viewport-sidebar-slot) in App.jsx.
 */
export const SidebarPortal = ({ children }) => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const el = document.getElementById('viewport-sidebar-slot');
    setTarget(el);
  }, []);

  if (!target) return null;
  return ReactDOM.createPortal(children, target);
};
