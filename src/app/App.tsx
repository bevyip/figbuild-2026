import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Home from "./screens/Home";
import Onboard1 from "./screens/Onboard1";
import Onboard2 from "./screens/Onboard2";
import Onboard3 from "./screens/Onboard3";
import Onboard4 from "./screens/Onboard4";
import Connect from "./screens/Connect";
import Dashboard from "./screens/Dashboard";

const SCREENS = ["home", "onboard1", "onboard2", "onboard3", "onboard4", "connect", "dashboard"] as const;
type ScreenName = (typeof SCREENS)[number];

const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 852 : -852,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? -852 : 852,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.55, 0, 0.78, 0] as const },
  }),
};

const dashVariants = {
  enter: { opacity: 1, y: 0 },
  center: { opacity: 1, y: 0, transition: { duration: 0.01 } },
  exit: { opacity: 0, y: -40, transition: { duration: 0.4, ease: [0.55, 0, 0.78, 0] as const } },
};

const screenLayerClass = "absolute inset-0 flex items-center justify-center z-[1]";
const screenBgStyle = { background: "url(/bg.png) center center / cover no-repeat" };

export default function App() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function navigate(to: ScreenName) {
    const nextIndex = SCREENS.indexOf(to);
    setDirection(nextIndex > screenIndex ? 1 : -1);
    setScreenIndex(nextIndex);
  }

  const screen = SCREENS[screenIndex];

  return (
    <div className="size-full flex items-center justify-center bg-zinc-900 overflow-hidden font-['Instrument_Sans',sans-serif]">
      <div className="relative w-[393px] h-[852px] rounded-[40px] shadow-2xl overflow-hidden ring-8 ring-black app-bg">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={screen}
            className={screen === "dashboard" ? "absolute inset-0" : screenLayerClass}
            style={screen !== "dashboard" ? screenBgStyle : undefined}
            custom={direction}
            variants={screen === "dashboard" ? dashVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {screen === "home" && (
              <Home onGetStarted={() => navigate("onboard1")} />
            )}
            {screen === "onboard1" && (
              <Onboard1
                onBack={() => navigate("home")}
                onNext={() => navigate("onboard2")}
              />
            )}
            {screen === "onboard2" && (
              <Onboard2
                onBack={() => navigate("onboard1")}
                onNext={() => navigate("onboard3")}
              />
            )}
            {screen === "onboard3" && (
              <Onboard3
                onBack={() => navigate("onboard2")}
                onNext={() => navigate("onboard4")}
              />
            )}
            {screen === "onboard4" && (
              <Onboard4
                onBack={() => navigate("onboard3")}
                onFinish={() => navigate("connect")}
              />
            )}
            {screen === "connect" && (
              <Connect
                onBack={() => navigate("onboard4")}
                onFinished={() => navigate("dashboard")}
              />
            )}
            {screen === "dashboard" && <Dashboard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
