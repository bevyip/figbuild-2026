import { motion } from "motion/react";
import FlowerDecoration from "../components/FlowerDecoration";
import type { FlowerConfig } from "../components/FlowerDecoration";
import "./Home.css";

const FLOWERS: FlowerConfig[] = [
  {
    id: "flower1",
    src: "/flower1.svg",
    style: { left: -8, top: 551, width: 92, height: 95 },
    rotate: -173.18,
    innerWidth: 82,
    innerHeight: 86,
    floatY: [-6, 8, -6],
    floatX: [-3, 4, -3],
    delay: 0.1,
    duration: 5.5,
    rotateDelta: 5,
  },
  {
    id: "flower2",
    src: "/flower2.svg",
    style: { left: 304, top: 428, width: 71, height: 74 },
    rotate: 18.48,
    innerWidth: 54,
    innerHeight: 60,
    floatY: [5, -8, 5],
    floatX: [3, -5, 3],
    delay: 0.5,
    duration: 4.8,
    rotateDelta: 6,
  },
  {
    id: "flower3",
    src: "/flower3.svg",
    style: { left: -87, top: 686, width: 217, height: 228 },
    rotate: 18.48,
    innerWidth: 167,
    innerHeight: 184,
    floatY: [-5, 9, -5],
    floatX: [-4, 5, -4],
    delay: 0.9,
    duration: 6.2,
    rotateDelta: 4,
  },
  {
    id: "flower4",
    src: "/flower4.svg",
    style: { left: 172, top: -45, width: 153, height: 139 },
    rotate: 15,
    innerWidth: 129,
    innerHeight: 109,
    floatY: [7, -10, 7],
    floatX: [4, -6, 4],
    delay: 0.3,
    duration: 5.2,
    rotateDelta: 7,
  },
  {
    id: "flower5",
    src: "/flower5.svg",
    style: { left: 280, top: 152, width: 142, height: 145 },
    rotate: 46.7,
    innerWidth: 128,
    innerHeight: 75,
    floatY: [-7, 7, -7],
    floatX: [-4, 6, -4],
    delay: 0.7,
    duration: 4.4,
    rotateDelta: 8,
  },
  {
    id: "flower6",
    src: "/flower6.svg",
    style: { left: 201.89, top: 630.44, width: 213, height: 255 },
    rotate: -11.08,
    innerWidth: 173,
    innerHeight: 226,
    floatY: [3, -6, 3],
    floatX: [2, -4, 2],
    delay: 1.1,
    duration: 7.0,
    rotateDelta: 3,
  },
  {
    id: "flower7",
    src: "/flower7.svg",
    style: { left: -63, top: 139, width: 199, height: 192 },
    rotate: 95.11,
    innerWidth: 176,
    innerHeight: 184,
    floatY: [-5, 8, -5],
    floatX: [-3, 5, -3],
    delay: 0.6,
    duration: 5.8,
    rotateDelta: 5,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

type HomeProps = {
  onGetStarted?: () => void;
};

export default function Home({ onGetStarted }: HomeProps) {
  return (
    <>
      {FLOWERS.map((flower) => (
        <FlowerDecoration key={flower.id} flower={flower} />
      ))}

      <motion.div
        className="home-main-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="home-card-inner"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="home-title-block" variants={fadeUp}>
            <h1 className="home-dandi-title">Dandi</h1>
            <p className="home-subtitle">Your body was always telling you.</p>
          </motion.div>

          <motion.div className="home-button-group" variants={fadeUp}>
            <motion.button
              className="home-btn-primary"
              whileHover={{ scale: 1.025, backgroundColor: "#f5a0be" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              onClick={onGetStarted}
            >
              Get Started
            </motion.button>
            <motion.button
              className="home-btn-secondary"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              I already have an account
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
