import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import React from "react"

// Animation settings
const fadeDuration = 0.5;
const wrapperChangeDuration = 0.3;
const delayBetween = 0.1;

function AdaptiveContainer({ children, selectedChildren, rootClassName = "" }) {
  const childrenList = React.Children.toArray(children);

  return (
    <LayoutGroup>
      <motion.div
        layout
        className={`overflow-hidden rounded-3xl ${rootClassName}`}
        style={{ borderRadius: "24px"}}
        transition={{
          layout: {
            duration: wrapperChangeDuration,
            ease: "easeInOut"
          },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedChildren}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: fadeDuration, delay: delayBetween + wrapperChangeDuration } }}
            exit={{ opacity: 0, transition: { duration: fadeDuration, delay: 0 } }}
          >
            {childrenList[selectedChildren]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  )
}

export default AdaptiveContainer;