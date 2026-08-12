import { useEffect, useState } from 'react';
import Backdrop from './scene/Backdrop';
import Hero from './sections/Hero';
import Work from './sections/Work';
import Stack from './sections/Stack';
import Contact from './sections/Contact';
import Hud from './sections/Hud';
import Inspector from './sections/Inspector';
import { loadPortfolio, subscribeThroughput } from './api/client';
import { useStage } from './store';
import StageDebug from './sections/StageDebug';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [data, setData] = useState(null);
  const reducedMotion = prefersReducedMotion();
  const setProgress = useStage((s) => s.setProgress);
  const setThroughput = useStage((s) => s.setThroughput);

  useEffect(() => { loadPortfolio().then(setData); }, []);

  useEffect(() => subscribeThroughput(setThroughput), [setThroughput]);

  // useEffect(() => {
  //   const onScroll = () => {
  //     const max = document.body.scrollHeight - window.innerHeight;
  //     setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
  //   };
  //   onScroll();
  //   window.addEventListener('scroll', onScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, [setProgress]);

  useEffect(() => {
  const clamp = (value) => Math.max(0, Math.min(1, value));

  const onScroll = () => {
    const work = document.getElementById('work');
    const stack = document.getElementById('stack');
    const contact = document.getElementById('contact');

    if (!work || !stack || !contact) return;

    const scrollPoint =
      window.scrollY + window.innerHeight * 0.5;

    const workY = work.offsetTop;
    const stackY = stack.offsetTop;
    const contactY = contact.offsetTop;

    let progress = 0;

    if (scrollPoint < workY) {
      const local = clamp(
        scrollPoint / Math.max(workY, 1)
      );

      progress = local * (1 / 3);
    }

    else if (scrollPoint < stackY) {
      const local = clamp(
        (scrollPoint - workY) /
          Math.max(stackY - workY, 1)
      );

      progress = (1 + local) / 3;
    }

    else if (scrollPoint < contactY) {
      const local = clamp(
        (scrollPoint - stackY) /
          Math.max(contactY - stackY, 1)
      );

      progress = (2 + local) / 3;
    }

    else {
      progress = 1;
    }

    setProgress(progress);
  };

  onScroll();

  window.addEventListener('scroll', onScroll, {
    passive: true,
  });

  window.addEventListener('resize', onScroll);

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}, [setProgress]);

  if (!data) return <div className="booting">Starting services…</div>;

  return (
    <>
      <Backdrop topology={data.topology} reducedMotion={reducedMotion} />
      <div id="veil" />
      <Inspector nodes={data.topology.nodes} />

      <nav>
        <div className="brand">N<b>.</b>JAVVAJI</div>
        <div className="links">
          <a href="#work">Work</a><a href="#stack">Stack</a><a href="#contact">Contact</a>
        </div>
      </nav>

      <Hud nodeCount={data.topology.nodes.length} live={data.live} />
      <StageDebug />

      <main className="wrap">
        <Hero profile={data.profile} />
        <Work roles={data.roles} metrics={data.metrics} />
        <Stack skills={data.skills} />
        <Contact profile={data.profile} />
      </main>
    </>
  );
}
