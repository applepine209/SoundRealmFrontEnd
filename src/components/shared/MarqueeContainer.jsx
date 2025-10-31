import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

export default function MarqueeOnHover({
  children,
  className = "",
}) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });
  const [childSize, setChildSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const child = wrapperRef.current;
    const parent = child?.parentElement;
    if (!parent) return;

    const updateParent = () => {
      const r = parent.getBoundingClientRect();
      setParentSize({ width: Math.round(r.width), height: Math.round(r.height) });
    };

    updateParent();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateParent);
      ro.observe(parent);
    } else {
      window.addEventListener("resize", updateParent);
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateParent);
    };
  }, []);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      // scrollWidth/scrollHeight capture the full content size (even if clipped)
      const w = Math.round(el.scrollWidth || el.getBoundingClientRect().width);
      const h = Math.round(el.scrollHeight || el.getBoundingClientRect().height);
      setChildSize({ width: w, height: h });
    };

    // First measure after mount/children change
    measure();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    } else {
      window.addEventListener("resize", measure);
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [children]); // re-measure when children change

  let containerVariants = {
    normal : {},
    hovered : {
      x: parentSize.width - childSize.width >=0 ? 0 : -(childSize.width - parentSize.width),
      transition: { duration: (childSize.width / 200), ease: "linear" }
    }
  };

  return (
    <div ref={wrapperRef} className={className + " overflow-hidden"}>
      <motion.div
        ref={contentRef}
        className="inline-block flex-nowrap whitespace-nowrap"
        variants={containerVariants}
        animate={"normal"}
        whileHover={"hovered"}
      >
        {children}
      </motion.div>
    </div>
  );
}