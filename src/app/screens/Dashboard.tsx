import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  LayoutGroup,
  useMotionValue,
  animate,
} from "motion/react";
import "./Dashboard.css";

const VITALS = [
  { label: "Heart Rate", value: "67", unit: "BPM", bg: "#f3a632" },
  { label: "Glucose", value: "104", unit: "MG/DL", bg: "#ee583f" },
  { label: "Sleep Quality", value: "8.1", unit: "HR", bg: "#a99730" },
  { label: "Temperature", value: "99.1", unit: "°F", bg: "#f77fab" },
];

const springSnap = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const NUDGE_MAX = 14;
const NUDGE_FACTOR = 0.2;

function getNudge(
  myPosition: number,
  activeDrag: { index: number; x: number } | null,
  total: number
): number {
  if (!activeDrag) return 0;
  const { index, x } = activeDrag;
  if (x < 0) {
    const swapTarget = index === 0 ? total - 1 : index - 1;
    if (myPosition === swapTarget) return Math.max(-NUDGE_MAX, x * NUDGE_FACTOR);
  } else if (x > 0) {
    const swapTarget = index === total - 1 ? 0 : index + 1;
    if (myPosition === swapTarget) return Math.min(NUDGE_MAX, x * NUDGE_FACTOR);
  }
  return 0;
}

function VitalTile({
  vital,
  position,
  totalCount,
  activeDrag,
  onSwipe,
  onDragStart,
  onDrag,
  onDragEnd,
}: {
  vital: (typeof VITALS)[0];
  position: number;
  totalCount: number;
  activeDrag: { index: number; x: number } | null;
  onSwipe: (dir: "left" | "right") => void;
  onDragStart: (index: number) => void;
  onDrag: (x: number) => void;
  onDragEnd: () => void;
}) {
  const dragX = useMotionValue(0);
  const SWIPE_THRESHOLD = 36;
  const VEL_THRESHOLD = 200;
  const isDragging = activeDrag?.index === position;
  const nudge = getNudge(position, activeDrag, totalCount);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const { offset, velocity } = info;
      const goLeft = offset.x < -SWIPE_THRESHOLD || velocity.x < -VEL_THRESHOLD;
      const goRight = offset.x > SWIPE_THRESHOLD || velocity.x > VEL_THRESHOLD;
      animate(dragX, 0, springSnap);
      onDragEnd();
      if (goLeft) onSwipe("left");
      else if (goRight) onSwipe("right");
    },
    [onSwipe, onDragEnd, dragX]
  );

  return (
    <motion.div
      layout
      transition={springSnap}
      className="dash-vital-tile"
      style={{
        background: vital.bg,
        x: isDragging ? dragX : nudge,
        touchAction: "pan-y",
      }}
      drag="x"
      dragConstraints={{ left: -70, right: 70 }}
      dragElastic={0.12}
      onDragStart={() => onDragStart(position)}
      onDrag={(_, info) => onDrag(info.offset.x)}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, zIndex: 10 }}
    >
      <span className="dash-vital-label">{vital.label}</span>
      <div className="dash-vital-value">
        <span className="dash-vital-num">{vital.value}</span>
        <span
          className={`dash-vital-unit${vital.unit === "MG/DL" ? " dash-vital-unit--small" : ""}`}
        >
          {vital.unit}
        </span>
      </div>
    </motion.div>
  );
}

const CARDS = [
  {
    id: 1,
    title: "Your body is in a high-resistance state today.",
    body: "Low HRV and elevated skin temperature suggest your nervous system is under stress. Prioritise rest and avoid high-intensity workouts today.",
    tags: ["Low HRV", "Skin-temp increase"],
  },
  {
    id: 2,
    title: "Your period is 10 days later than expected.",
    body: "Your period is 10 days later than your recent average. Body temperature and HRV suggest hormonal fluctuation. If the delay continues, consider consulting a gynecologist.",
    tags: ["Hormonal fluctuation", "High stress"],
  },
  {
    id: 3,
    title: "Possible PCOS Pattern",
    body: "Eight weeks of data suggest a combined insulin-resistant and inflammatory pattern. Blood-glucose instability and skin inflammation responses have repeated.",
    tags: ["Insulin-resistant", "Glucose instability"],
  },
  {
    id: 4,
    title: "Fatigue appears to repeat in a 3-day cycle.",
    body: "Fatigue increases the day after <6 hours of sleep plus a high-carb lunch. Managing both may reduce fatigue frequency.",
    tags: ["High-carbohydrate meal"],
  },
];

const MOCK_RESPONSES: Record<string, string> = {
  "When will my next period cycle be?":
    "Based on your 28-day cycle data, your next period is estimated to start around March 22nd — about 14 days from now. Your temperature dip and low HRV today are consistent with the mid-luteal phase. I'd recommend staying hydrated and reducing caffeine intake in the week leading up.",
  "What supplements will be administered today?":
    "Today's recommended supplements:\n• Vitamin D3 (2000 IU) — immune support\n• Magnesium Glycinate (400mg) — sleep quality\n• Omega-3 (1000mg) — hormonal balance\n\nTake all three with breakfast for best absorption.",
  default:
    "Great question! Based on your health data, I can see your body is currently in a high-stress state with low HRV. Rest and hydration are your best tools today. Want me to look into anything specific about your cycle or nutrition?",
};

const SUGGESTED = [
  "Ask Dandi anything on your mind.",
  "When will my next period cycle be?",
  "What supplements will be administered today?",
];

function getMockResponse(msg: string): string {
  return MOCK_RESPONSES[msg.trim()] ?? MOCK_RESPONSES.default;
}

/** Points up when expanded (open), down when collapsed */
function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ flexShrink: 0, color: "#345900" }}
    >
      <path
        d="M5 8l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function InsightCard({
  card,
  index,
}: {
  card: (typeof CARDS)[0];
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      className="dash-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="dash-card-header">
        <p className="dash-card-title">{card.title}</p>
        <button
          type="button"
          className="dash-chevron-btn"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <Chevron open={open} />
        </button>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        <p className="dash-card-body">{card.body}</p>
      </motion.div>
      <div className="dash-card-footer">
        <div className="dash-tags">
          {card.tags.map((t) => (
            <span key={t} className="dash-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const NAV_ITEMS = [
  { id: "home", icon: "/nav-home.svg", iconSize: { w: 28, h: 28 } },
  { id: "insights", icon: "/nav-insights.svg", iconSize: { w: 21, h: 21 } },
  { id: "upload", icon: "/nav-upload.svg", iconSize: { w: 49, h: 39 } },
  { id: "community", icon: "/nav-community.svg", iconSize: { w: 49, h: 39 } },
  { id: "profile", icon: "/nav-profile.svg", iconSize: { w: 49, h: 39 } },
];

function NavBar({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <div className="dash-nav-wrap">
      <div className="dash-nav-pill">
        {NAV_ITEMS.map(({ id, icon, iconSize }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              className="dash-nav-btn"
              onClick={() => onTabChange(id)}
            >
              <img
                src={isActive ? "/nav-active.svg" : "/nav-inactive.svg"}
                alt=""
                className="dash-nav-btn-bg"
              />
              <img
                src={icon}
                alt={id}
                className="dash-nav-icon"
                style={{ width: iconSize.w, height: iconSize.h }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AiCardContent({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  async function sendMessage(msg: string) {
    if (!msg.trim()) return;
    setText("");
    setResponse(null);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 950 + Math.random() * 500));
    setTyping(false);
    setResponse(getMockResponse(msg.trim()));
  }

  return (
    <motion.div
      className="ai-card-inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, delay: 0.22 }}
    >
      <button type="button" className="ai-close-btn--abs" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 3l10 10M13 3L3 13"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="ai-top-section">
        <img src="/ai-flower.svg" alt="" className="ai-card-flower-lg" />
        <p className="ai-card-title-lg">Ask Dandi anything on your mind.</p>
      </div>

      <div className="ai-middle">
        <AnimatePresence mode="wait">
          {typing ? (
            <motion.div
              key="typing"
              className="ai-typing-row"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <div className="chat-bubble chat-bubble--dandi chat-typing">
                <span />
                <span />
                <span />
              </div>
            </motion.div>
          ) : response ? (
            <motion.div
              key="response"
              className="ai-response-box"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="ai-response-text">
                {response.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <button
                type="button"
                className="ai-back-btn"
                onClick={() => setResponse(null)}
              >
                ← Ask another question
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="suggestions"
              className="ai-suggestions"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {SUGGESTED.slice(1).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="ai-suggestion-chip"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="ai-input-row">
        <input
          className="ai-input"
          placeholder="Ask me anything about yourself"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(text)}
        />
        <button
          type="button"
          className="ai-send-btn"
          onClick={() => sendMessage(text)}
        >
          <img src="/send-icon.svg" alt="Send" width={18} height={18} />
        </button>
      </div>
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [vitalOrder, setVitalOrder] = useState([0, 1, 2, 3]);
  const [activeDrag, setActiveDrag] = useState<{ index: number; x: number } | null>(null);
  const spinControls = useAnimation();
  const rotRef = useRef(0);

  const handleVitalDragStart = useCallback((index: number) => {
    setActiveDrag({ index, x: 0 });
  }, []);
  const handleVitalDrag = useCallback((x: number) => {
    setActiveDrag((prev) => (prev ? { ...prev, x } : null));
  }, []);
  const handleVitalDragEnd = useCallback(() => {
    setActiveDrag(null);
  }, []);

  const handleVitalReorder = useCallback((position: number, dir: "left" | "right") => {
    setVitalOrder((prev) => {
      const next = [...prev];
      const last = prev.length - 1;
      if (dir === "left") {
        if (position > 0) {
          [next[position - 1], next[position]] = [next[position], next[position - 1]];
        } else {
          [next[0], next[last]] = [next[last], next[0]];
        }
      } else {
        if (position < last) {
          [next[position], next[position + 1]] = [next[position + 1], next[position]];
        } else {
          [next[0], next[last]] = [next[last], next[0]];
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    async function autoSpin() {
      await new Promise((r) => setTimeout(r, 600));
      setSpinning(true);
      await spinControls.start({
        rotate: 720,
        transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] },
      });
      rotRef.current = 720;
      setSpinning(false);
    }
    autoSpin();
  }, [spinControls]);

  async function handleFlowerClick() {
    if (spinning) return;
    setSpinning(true);
    rotRef.current += 360;
    await spinControls.start({
      rotate: rotRef.current,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    });
    setSpinning(false);
    setAiOpen(true);
  }

  return (
    <LayoutGroup>
      <div className="dash-screen">
        <div className="dash-bg" />

        {/* Blue water fade-out */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "#dee5ff",
            zIndex: 50,
            pointerEvents: "none",
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="dash-scroll">
          <motion.div
            className="dash-content"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="dash-header">
              <div className="dash-greeting-block">
                <p className="dash-hi">Hi, Queenie!</p>
                <p className="dash-headline">
                  This is your current health status...
                </p>
              </div>

              <div style={{ width: 70, height: 70, flexShrink: 0 }}>
                <AnimatePresence>
                  {!aiOpen && (
                    <motion.button
                      key="flower-btn"
                      layoutId="ai-morph"
                      type="button"
                      onClick={handleFlowerClick}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        borderRadius: 999,
                        width: 70,
                        height: 70,
                        overflow: "hidden",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <motion.img
                        src="/dash-flower.svg"
                        alt="Ask Dandi"
                        style={{ width: 70, height: 70 }}
                        animate={spinControls}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <AnimatePresence>
              {aiOpen && (
                <motion.div
                  key="ai-card"
                  layoutId="ai-morph"
                  className="ai-card"
                  style={{ borderRadius: 24, overflow: "hidden" }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <AiCardContent onClose={() => setAiOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={fadeUp}>
              <p className="dash-section-title">Health status</p>
              <div className="dash-vitals">
                {vitalOrder.map((vitalIndex, position) => (
                  <VitalTile
                    key={VITALS[vitalIndex].label}
                    vital={VITALS[vitalIndex]}
                    position={position}
                    totalCount={vitalOrder.length}
                    activeDrag={activeDrag}
                    onSwipe={(dir) => handleVitalReorder(position, dir)}
                    onDragStart={handleVitalDragStart}
                    onDrag={handleVitalDrag}
                    onDragEnd={handleVitalDragEnd}
                  />
                ))}
              </div>
            </motion.div>

            <div>
              <motion.p
                variants={fadeUp}
                className="dash-section-title"
              >
                Body condition and mood
              </motion.p>
              <div className="dash-cards">
                {CARDS.map((card, i) => (
                  <InsightCard key={card.id} card={card} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </LayoutGroup>
  );
}
