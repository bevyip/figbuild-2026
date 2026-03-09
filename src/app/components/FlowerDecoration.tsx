import { motion } from "motion/react";

export type FlowerConfig = {
  id: string;
  src: string;
  style: { left: number; top: number; width: number; height: number };
  rotate: number;
  innerWidth: number;
  innerHeight: number;
  floatY: [number, number, number];
  floatX: [number, number, number];
  delay: number;
  duration: number;
  rotateDelta: number;
};

export default function FlowerDecoration({ flower }: { flower: FlowerConfig }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1, y: flower.floatY, x: flower.floatX }}
      transition={{
        opacity: { duration: 0.5, delay: flower.delay },
        scale: {
          duration: 0.8,
          delay: flower.delay,
          type: "spring",
          stiffness: 140,
          damping: 10,
        },
        y: {
          duration: flower.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: flower.delay + 0.8,
        },
        x: {
          duration: flower.duration * 1.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: flower.delay + 0.8,
        },
      }}
      style={{
        position: "absolute",
        left: flower.style.left,
        top: flower.style.top,
        width: flower.style.width,
        height: flower.style.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        willChange: "transform",
        zIndex: 20,
      }}
    >
      <motion.div
        animate={{
          rotate: [
            flower.rotate - flower.rotateDelta,
            flower.rotate + flower.rotateDelta,
            flower.rotate - flower.rotateDelta,
          ],
        }}
        transition={{
          duration: flower.duration * 1.1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: flower.delay + 0.8,
        }}
        style={{ display: "flex", flexShrink: 0 }}
      >
        <img
          src={flower.src}
          alt=""
          style={{
            width: flower.innerWidth,
            height: flower.innerHeight,
            display: "block",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
