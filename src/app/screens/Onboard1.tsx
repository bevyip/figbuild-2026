import { useState } from "react";
import { motion } from "motion/react";
import FlowerDecoration from "../components/FlowerDecoration";
import type { FlowerConfig } from "../components/FlowerDecoration";
import ProgressDots from "../components/ProgressDots";
import "./Onboarding.css";

const FLOWERS: FlowerConfig[] = [
  {
    id: "ob1-tl",
    src: "/flower4.svg",
    style: { left: -2, top: -54, width: 153, height: 139 },
    rotate: 15,
    innerWidth: 129,
    innerHeight: 109,
    floatY: [7, -10, 7],
    floatX: [4, -6, 4],
    delay: 0.1,
    duration: 5.2,
    rotateDelta: 7,
  },
  {
    id: "ob1-tr",
    src: "/flower7.svg",
    style: { left: 284, top: 11, width: 199, height: 192 },
    rotate: 95.11,
    innerWidth: 176,
    innerHeight: 184,
    floatY: [-5, 8, -5],
    floatX: [-3, 5, -3],
    delay: 0.4,
    duration: 5.8,
    rotateDelta: 5,
  },
  {
    id: "ob1-bl",
    src: "/flower3.svg",
    style: { left: -87, top: 686, width: 217, height: 228 },
    rotate: 18.48,
    innerWidth: 167,
    innerHeight: 184,
    floatY: [-5, 9, -5],
    floatX: [-4, 5, -4],
    delay: 0.7,
    duration: 6.2,
    rotateDelta: 4,
  },
  {
    id: "ob1-left",
    src: "/ob1-flower-left.svg",
    style: { left: -26, top: 137, width: 92, height: 95 },
    rotate: -173.18,
    innerWidth: 82,
    innerHeight: 86,
    floatY: [-6, 8, -6],
    floatX: [-3, 4, -3],
    delay: 0.5,
    duration: 5.5,
    rotateDelta: 5,
  },
  {
    id: "ob1-br",
    src: "/ob1-flower-br.svg",
    style: { left: 254, top: 632, width: 252, height: 242 },
    rotate: -40.38,
    innerWidth: 221,
    innerHeight: 130,
    floatY: [-4, 6, -4],
    floatX: [3, -5, 3],
    delay: 0.9,
    duration: 4.8,
    rotateDelta: 6,
  },
];

const OPTIONS = [
  "I think I might have it",
  "I was just diagnosed",
  "I've been managing it for years",
  "I'm trying to conceive",
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

type Onboard1Props = {
  onBack: () => void;
  onNext: () => void;
};

export default function Onboard1({ onBack, onNext }: Onboard1Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {FLOWERS.map((flower) => (
        <FlowerDecoration key={flower.id} flower={flower} />
      ))}

      <motion.button
        className="back-btn"
        onClick={onBack}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11.5 3.5L6 9l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      <motion.div className="ob1-card" variants={cardVariants} initial="hidden" animate="visible">
        <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: 31 }}>
          <motion.div variants={fadeUp} className="ob1-header">
            <p className="ob1-welcome">Welcome Queenie!</p>
            <p className="ob1-subtitle">Before we get started lets get to know you a little...</p>
          </motion.div>

          <motion.div variants={fadeUp} className="ob1-body">
            <ProgressDots total={4} active={0} />

            <div className="ob1-question-block">
              <h2 className="ob1-question">Where are you in your PCOS journey?</h2>
              <div className="ob1-options">
                {OPTIONS.map((opt) => (
                  <motion.button
                    key={opt}
                    className={`ob1-option${selected === opt ? " ob1-option--selected" : ""}`}
                    onClick={() => setSelected(opt)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              className="btn-primary ob1-next"
              whileHover={{ scale: 1.025, backgroundColor: "#f5a0be" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              onClick={onNext}
            >
              Next
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
