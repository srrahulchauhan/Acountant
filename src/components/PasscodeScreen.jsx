import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

export const PasscodeScreen = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '8052';
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when component mounts
    inputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError(false);
    
    if (value.length === 4) {
      if (value === correctPin) {
        setTimeout(() => onUnlock(), 300);
      } else {
        setError(true);
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-50 cursor-pointer"
      onClick={handleContainerClick}
    >
      <input 
        ref={inputRef}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        value={pin}
        onChange={handleChange}
        className="opacity-0 absolute -z-10 w-0 h-0"
        autoFocus
        disabled={pin.length === 4}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm px-8 flex flex-col items-center pointer-events-none"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${error ? 'bg-rose-500/20 text-rose-500' : pin.length === 4 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-sky-500/20 text-sky-400'}`}>
            {pin.length === 4 && !error ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <h1 className="text-2xl font-bold mb-2">Enter Passcode</h1>
          <p className="text-slate-400 text-sm text-center">Type your PIN using the keyboard.</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-4 h-4 rounded-full border-2 ${
                pin.length > i 
                  ? (error ? 'bg-rose-500 border-rose-500' : 'bg-sky-500 border-sky-500')
                  : 'border-slate-600 bg-transparent'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

