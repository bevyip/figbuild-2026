import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./Onboarding.css";

const WATER_COLOR = "#dee5ff";
const FILL_DURATION = 7;

const RAIN_COLS = [
  { id: 1, x: 18, delay: 0.0 },
  { id: 2, x: 55, delay: 0.4 },
  { id: 3, x: 90, delay: 0.15 },
  { id: 4, x: 130, delay: 0.7 },
  { id: 5, x: 165, delay: 0.3 },
  { id: 6, x: 200, delay: 0.55 },
  { id: 7, x: 235, delay: 0.1 },
  { id: 8, x: 270, delay: 0.8 },
  { id: 9, x: 305, delay: 0.45 },
  { id: 10, x: 345, delay: 0.2 },
  { id: 11, x: 380, delay: 0.65 },
  { id: 12, x: 38, delay: 0.9 },
  { id: 13, x: 152, delay: 0.6 },
  { id: 14, x: 290, delay: 0.35 },
  { id: 15, x: 215, delay: 0.85 },
];

function RainColumn({ x, delay }: { x: number; delay: number }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 6,
            height: 28,
            borderRadius: 99,
            background: WATER_COLOR,
            opacity: 0.85,
            zIndex: 15,
            pointerEvents: "none",
          }}
          initial={{ y: -40 }}
          animate={{ y: 920 }}
          transition={{
            duration: 1.2 + Math.random() * 0.4,
            delay: delay + i * 0.38,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.1,
          }}
        />
      ))}
    </>
  );
}

function WaveSurface() {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: -28,
        left: -20,
        width: "calc(100% + 40px)",
        overflow: "hidden",
        lineHeight: 0,
      }}
      animate={{ x: [0, -30, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 440 30"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 30 }}
      >
        <path
          d="M0,15 C40,0 80,28 120,15 C160,2 200,28 240,15 C280,2 320,28 360,15 C390,5 415,22 440,15 L440,30 L0,30 Z"
          fill={WATER_COLOR}
        />
      </svg>
    </motion.div>
  );
}

type ConnectProps = {
  onBack: () => void;
  onFinished: () => void;
};

export default function Connect({ onBack, onFinished }: ConnectProps) {
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (connecting) {
      const t = setTimeout(() => {
        onFinished?.();
      }, (FILL_DURATION + 0.3) * 1000);
      return () => clearTimeout(t);
    }
  }, [connecting, onFinished]);

  return (
    <div className="connect-screen">
      <motion.button
        className="back-btn"
        onClick={onBack}
        style={{ zIndex: 30 }}
        initial={{ opacity: 0, x: -10 }}
        animate={{
          opacity: connecting ? 0 : 1,
          x: 0,
          pointerEvents: connecting ? "none" : "auto",
        }}
        transition={{ duration: 0.4, delay: connecting ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M11.5 3.5L6 9l5.5 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      <motion.video
        className="connect-ring-video"
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: 2 }}
      >
        <source src="/ring.webm" type="video/webm" />
      </motion.video>

      <motion.button
        className="connect-btn"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        whileHover={!connecting ? { scale: 1.025 } : {}}
        whileTap={!connecting ? { scale: 0.97 } : {}}
        onClick={() => setConnecting(true)}
        style={{ cursor: connecting ? "default" : "pointer", zIndex: 5 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={connecting ? "c" : "i"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {connecting ? "Connecting..." : "Connect"}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <motion.div
        className="connect-flower"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.5 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        style={{ zIndex: 3 }}
      >
        <img src="/connect-flower.svg" alt="" style={{ width: "100%", height: "100%" }} />
      </motion.div>

      <AnimatePresence>
        {connecting && (
          <>
            {RAIN_COLS.map((col) => (
              <RainColumn key={col.id} x={col.x} delay={col.delay} />
            ))}
            <motion.div
              key="water"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: WATER_COLOR,
                zIndex: 10,
                overflow: "visible",
              }}
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: FILL_DURATION, ease: "linear" }}
            >
              <WaveSurface />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
