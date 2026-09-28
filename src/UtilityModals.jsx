import React from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  LifeBuoy,
  Map,
  PhoneCall,
  X,
} from "lucide-react";

export function EmergencyModal({ copy, close }) {
  return (
    <motion.div
      className="utility-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <motion.section
        className="emergency-modal"
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-heading"
      >
        <button className="utility-close" onClick={close} aria-label={copy.cancel}>
          <X />
        </button>
        <i className="emergency-symbol"><LifeBuoy /></i>
        <h2 id="emergency-heading">{copy.emergencyTitle}</h2>
        <p>{copy.emergencyText}</p>
        <ul>
          {copy.emergencyTips.map((tip) => (
            <li key={tip}><Check />{tip}</li>
          ))}
        </ul>
        <a className="call-112" href="tel:112">
          <PhoneCall />
          {copy.call112}
        </a>
        <button className="utility-cancel" onClick={close}>{copy.cancel}</button>
      </motion.section>
    </motion.div>
  );
}

export function Onboarding({ copy, close }) {
  const cards = [
    [Map, copy.onboardingMap],
    [Camera, copy.onboardingSignal],
    [AlertTriangle, copy.onboardingResult],
  ];
  return (
    <motion.div
      className="utility-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="onboarding-modal"
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-heading"
      >
        <div className="onboarding-brand">twelve <span>● live</span></div>
        <h2 id="onboarding-heading">{copy.onboardingTitle}</h2>
        <p>{copy.onboardingText}</p>
        <div className="onboarding-features">
          {cards.map(([Icon, text], index) => (
            <article key={text}>
              <i><Icon /></i>
              <b>0{index + 1}</b>
              <span>{text}</span>
            </article>
          ))}
        </div>
        <button onClick={close}>
          {copy.start}
          <ArrowRight />
        </button>
      </motion.section>
    </motion.div>
  );
}