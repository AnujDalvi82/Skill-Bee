'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexProps {
  children?: string;
  math?: string;
  block?: boolean;
  inline?: boolean;
  className?: string;
}

export const Latex: React.FC<LatexProps> = ({
  children,
  math,
  block = false,
  inline = false,
  className = ''
}) => {
  const isBlock = block && !inline;
  const content = (math ?? children ?? '').trim();

  const html = useMemo(() => {
    if (!content) return '';
    try {
      // Strip outer enclosing $$ or $ if present
      let raw = content;
      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        raw = raw.slice(2, -2).trim();
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        raw = raw.slice(1, -1).trim();
      }
      return katex.renderToString(raw, {
        displayMode: isBlock,
        throwOnError: false,
      });
    } catch (e) {
      console.warn('KaTeX render error for:', content, e);
      return content;
    }
  }, [content, isBlock]);

  return (
    <span
      className={`${isBlock ? 'my-2 block text-center' : 'inline-block align-middle'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
