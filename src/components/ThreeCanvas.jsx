import React, { useEffect, useRef } from 'react';
import { initScene } from '../three/SceneManager';

const ThreeCanvas = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    sceneRef.current = initScene(containerRef.current);

    const handleMouseMove = (e) => {
      if (!sceneRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      sceneRef.current.handleMouseMove(x, y);
    };

    const handleClick = () => {
      if (!sceneRef.current) return;
      sceneRef.current.handleClick();
    };

    const handleScroll = () => {
      if (!sceneRef.current) return;
      const total = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = total > 0 ? window.scrollY / total : 0;
      sceneRef.current.handleScroll(scrollPercent);
    };

    const el = containerRef.current;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      if (sceneRef.current) {
        sceneRef.current.dispose();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-move"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ThreeCanvas;
