/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export default function AnnouncementBar() {
  const text = "✦ WE ARE COMING SOON ON AMAZON • FLIPKART • JIOMART • BLINKIT • ZEPTO • SWIGGY INSTAMART • EXPERIENCE PURE SPICES LIKE NEVER BEFORE • ";
  const repeatedText = Array(4).fill(text).join(" ");

  return (
    <div id="announcement-bar" className="w-full bg-[#1B1B1B] text-[#F8F8F4] overflow-hidden py-3 border-b border-[#B71C1C]/40 z-50 relative select-none">
      <div className="flex whitespace-nowrap min-w-full">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            ease: "linear",
            duration: 35,
            repeat: Infinity,
          }}
          className="inline-block text-xs uppercase tracking-widest font-medium"
        >
          {repeatedText}
        </motion.div>
      </div>
    </div>
  );
}
