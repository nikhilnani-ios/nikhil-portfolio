// import { motion } from 'framer-motion';

// const rise = {
//   hidden: { opacity: 0, y: 22 },
//   show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.12 * i, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } }),
// };

// export default function Hero({ profile }) {
//   const [first, ...rest] = profile.name.split(' ');
//   return (
//     <section id="hero">
//       <motion.div className="eyebrow" variants={rise} initial="hidden" animate="show" custom={0}>
//         Backend · Distributed Systems · {profile.location}
//       </motion.div>

//       <motion.h1 variants={rise} initial="hidden" animate="show" custom={1}>
//         {first}
//         <span className="l2">{rest.join(' ')}</span>
//       </motion.h1>

//       <motion.p className="lede" variants={rise} initial="hidden" animate="show" custom={2}>
//         {profile.lede}
//       </motion.p>

//       <motion.div className="ticker" variants={rise} initial="hidden" animate="show" custom={3}>
//         <span>5 yrs <b>Java / Spring Boot</b></span>
//         <span>MS IT <b>Univ. of Cincinnati · 4.0</b></span>
//         <span>Currently <b>SE-III @ Keyhole Software</b></span>
//       </motion.div>

//       <motion.div className="cta" variants={rise} initial="hidden" animate="show" custom={4}>
//         <a className="btn" href="#work">See the work</a>
//         <a className="btn ghost" href="#contact">Get in touch</a>
//       </motion.div>
//     </section>
//   );
// }


import { motion } from 'framer-motion';

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12 * i,
      duration: 0.7,
      ease: [0.2, 0.7, 0.2, 1],
    },
  }),
};

export default function Hero({ profile }) {
  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="hero">

  <motion.div
    className="eyebrow hero-eyebrow"
    variants={rise}
    initial="hidden"
    animate="show"
    custom={0}
  >
    Backend · Distributed Systems · {profile.location}
  </motion.div>

  <div className="hero-main">

    <motion.div
      className="hero-photo-wrap"
      variants={rise}
      initial="hidden"
      animate="show"
      custom={1}
    >
      <img
        src="/profile.jpg"
        alt="Nikhil Javvaji"
        className="hero-photo"
      />
    </motion.div>

    <div className="hero-copy">

      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        custom={1}
      >
        {first}
        <span className="l2">{rest.join(' ')}</span>
      </motion.h1>

      <motion.p
        className="lede"
        variants={rise}
        initial="hidden"
        animate="show"
        custom={2}
      >
        {profile.lede}
      </motion.p>

      <motion.div
        className="ticker"
        variants={rise}
        initial="hidden"
        animate="show"
        custom={3}
      >
        <span>5 yrs <b>Java / Spring Boot</b></span>
        <span>MS IT <b>Univ. of Cincinnati · 4.0</b></span>
        <span>Currently <b>SE-III @ Keyhole Software</b></span>
      </motion.div>

      <motion.div
        className="cta"
        variants={rise}
        initial="hidden"
        animate="show"
        custom={4}
      >
        <a className="btn" href="#work">See the work</a>
        <a className="btn ghost" href="#contact">Get in touch</a>
      </motion.div>

    </div>
  </div>
</section>
  );
}