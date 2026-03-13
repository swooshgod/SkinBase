'use client';

import { useState, useEffect } from 'react';
import { useSkinBaseStore } from '@/lib/store';

export default function QuizNameStep() {
  const { userName, setUserName } = useSkinBaseStore();
  const [localName, setLocalName] = useState(userName || '');

  useEffect(() => {
    if (userName) setLocalName(userName);
  }, [userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalName(value);
    setUserName(value);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#1C1917' }}>
        What&apos;s your name?
      </h2>
      <p className="text-sm mb-8" style={{ color: '#78716C' }}>
        We&apos;ll personalize your routine for you
      </p>

      <input
        type="text"
        value={localName}
        onChange={handleChange}
        placeholder="Your first name..."
        autoFocus
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '16px 20px',
          fontSize: 18,
          fontWeight: 500,
          textAlign: 'center',
          border: '2px solid #E7DFD5',
          borderRadius: 16,
          background: '#FFFFFF',
          color: '#1C1917',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#1B2B4B')}
        onBlur={(e) => (e.target.style.borderColor = '#E7DFD5')}
      />
    </div>
  );
}
