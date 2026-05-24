import React, { useEffect, useRef, useCallback } from 'react';
import { initScene } from '../three/SceneManager';

const ThreeCanvas = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  const onPageMouseMove = useCallback((e) => {
    if (!sceneRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    let ndcX = 0, ndcY = 0;
    if (rect) {
      ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    sceneRef.current.handleMouseMove(ndcX, ndcY, e.clientX, e.clientY);
  }, []);

  const onPageMouseOver = useCallback((e) => {
    if (!sceneRef.current) return;
    sceneRef.current.handleMouseOver(e.target.tagName);
  }, []);

  const onPageMouseOut = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.handleMouseOut();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    sceneRef.current = initScene(containerRef.current);

    const handleClick = () => { sceneRef.current?.handleClick(); };
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const sp = total > 0 ? window.scrollY / total : 0;
      sceneRef.current?.handleScroll(sp);
    };

    const el = containerRef.current;
    el.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // GLOBAL cursor tracking — cube looks at whatever you hover / touch
    document.addEventListener('mousemove', onPageMouseMove);
    document.addEventListener('mouseover', onPageMouseOver);
    document.addEventListener('mouseout', onPageMouseOut);

    return () => {
      el.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', onPageMouseMove);
      document.removeEventListener('mouseover', onPageMouseOver);
      document.removeEventListener('mouseout', onPageMouseOut);
      if (sceneRef.current) { sceneRef.current.dispose(); sceneRef.current = null; }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />
  );
};

export default ThreeCanvas;
