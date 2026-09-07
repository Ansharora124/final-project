'use client';

import { CSSProperties, PointerEvent, ReactNode, useState } from 'react';
import Link from 'next/link';
import { Aperture, ArrowDownLeft, ArrowRight, ArrowUpRight, Award, Bell, Camera, Clock, Compass, Image as ImageIcon, Pause, Play, Plus, Sparkles, Trophy } from 'lucide-react';
import { CURRENT_USER, MOCK_COMPETITIONS, MOCK_GALLERY_PHOTOS, MOCK_NOTIFICATIONS, MOCK_SUBMISSIONS } from '@/lib/mock-data';
import { formatDate, getDaysLeft } from '@/lib/utils';
import styles from './studio.module.css';

function TiltCard({ children, className = '', motion }: { children: ReactNode; className?: string; motion: boolean }) {
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!motion || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`);
    event.currentTarget.style.setProperty('--shine-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--shine-y', `${y * 100}%`);
  }
  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  }
  return <div className={`${styles.tilt} ${className}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>{children}</div>;
}

function CameraScene() {
  return <div className={styles.scene} aria-hidden="true">
    <div className={styles.sceneGlow} />
    <div className={styles.orbit} /><div className={styles.orbitTwo} />
    <div className={`${styles.floatingPrint} ${styles.printOne}`}><img src={MOCK_GALLERY_PHOTOS[1].imageUrl} alt="" /><span>LIGHT / LAND / LIFE</span></div>
    <div className={`${styles.floatingPrint} ${styles.printTwo}`}><img src={MOCK_GALLERY_PHOTOS[2].imageUrl} alt="" /><span>FIND YOUR PERSPECTIVE</span></div>
    <div className={styles.cameraShadow} />
    <div className={styles.cameraFloat}>
      <div className={styles.camera}>
        <div className={styles.cameraBack} /><div className={styles.cameraTop} /><div className={styles.cameraSide} />
        <div className={styles.cameraFront}><span className={styles.cameraBrand}>PIXEL<span>STUDIO / 01</span></span><div className={styles.cameraGrip} /><div className={styles.cameraLight} /></div>
        <div className={styles.viewfinder} /><div className={styles.shutter} />
        {[0, 1, 2, 3, 4, 5, 6].map(layer => <div key={layer} className={styles.lensRing} style={{ '--layer': layer } as CSSProperties} />)}
        <div className={styles.lensFront}><div className={styles.lensGlass}><div className={styles.aperture}><Aperture strokeWidth={0.8} /></div></div><span>35 mm · ƒ / 1.4</span></div>
      </div>
    </div>
    <div className={styles.sceneTag}><span />A different point of view.</div>
    <span className={styles.sceneStar}>✦</span><span className={styles.sceneStarTwo}>+</span>
  </div>;
}

export default function DashboardOverviewPage() {
  const [motion, setMotion] = useState(true);
  const submissions = MOCK_SUBMISSIONS.filter(s => s.userId === CURRENT_USER.id || s.photographerName === CURRENT_USER.name);
  const contests = MOCK_COMPETITIONS.filter(c => c.status === 'active' && !submissions.some(s => s.competitionId === c.id));
  const notifications = MOCK_NOTIFICATIONS.filter(n => n.userId === CURRENT_USER.id).slice(0, 3);
  const stats = [
    { label: 'Competitions entered', value: CURRENT_USER.stats.competitionsEntered, detail: 'Your creative journey', icon: Trophy, accent: 'violet' },
    { label: 'Photos submitted', value: submissions.length, detail: 'A story in every frame', icon: ImageIcon, accent: 'blue' },
    { label: 'Shortlisted entries', value: CURRENT_USER.stats.shortlistsCount, detail: 'A little closer to the podium', icon: Sparkles, accent: 'lime' },
    { label: 'Awards collected', value: CURRENT_USER.stats.winsCount, detail: 'Moments worth celebrating', icon: Award, accent: 'peach' },
  ];

  return <div className={styles.dashboard} data-motion={motion ? 'on' : 'off'}>
    <header className={styles.topbar}>
      <div><p className={styles.breadcrumb}>YOUR CREATIVE SPACE <span>/</span> OVERVIEW</p><h1>Studio dashboard<span>.</span></h1></div>
      <div className={styles.topActions}>
        <button className={styles.motionButton} onClick={() => setMotion(value => !value)} aria-pressed={!motion} aria-label={motion ? 'Pause 3D animations' : 'Play 3D animations'}>{motion ? <Pause size={14} /> : <Play size={14} />}<span>{motion ? 'Pause motion' : 'Play motion'}</span></button>
        <Link href="/dashboard/notifications" className={styles.notificationButton} aria-label="Open notifications"><Bell size={18} /><span /></Link>
      </div>
    </header>

    <section className={styles.hero}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.heroCopy}>
        <p className={styles.heroEyebrow}><span /> MADE FOR THE WAY YOU SEE</p>
        <h2>Your next shot.<br /><span>Your next chapter.</span></h2>
        <p className={styles.heroDescription}>A place for your perspective to take flight.<br className={styles.desktopBreak} /> Create, compete, and make every frame count.</p>
        <div className={styles.heroActions}><Link href="/judge/photos" className={styles.primaryLink}>Test your photograph <ArrowUpRight size={18} /></Link><Link href="/competitions" className={styles.secondaryLink}>Explore competitions <ArrowRight size={15} /></Link></div>
        <p className={styles.heroFootnote}><Aperture size={15} /> A fresh perspective starts with one photograph.</p>
      </div>
      <CameraScene />
      <span className={styles.heroNumber} aria-hidden="true">01 — IN FOCUS</span>
    </section>

    <div className={styles.sectionHeading}><h2>Your creative pulse</h2><span className={styles.demoBadge}>Demo activity</span></div>
    <section className={styles.stats} aria-label="Photography statistics">
      {stats.map((stat, index) => <TiltCard key={stat.label} motion={motion} className={styles.statCard}>
        <div className={styles.statTop}><span className={styles.statIcon} data-accent={stat.accent}><stat.icon size={19} strokeWidth={1.6} /></span><span className={styles.statIndex}>0{index + 1}</span></div>
        <p className={styles.statValue}>{String(stat.value).padStart(2, '0')}<ArrowUpRight size={18} /></p><h3>{stat.label}</h3><p className={styles.statDetail}>{stat.detail}</p>
      </TiltCard>)}
    </section>

    <div className={styles.contentGrid}>
      <div className={styles.mainColumn}>
        <section>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>THE WORK, IN PROGRESS</p><h2>Your latest frames</h2></div><Link href="/dashboard/submissions">View all <ArrowUpRight size={15} /></Link></div>
          <div className={styles.photoGrid}>
            {submissions.slice(0, 2).map(sub => <TiltCard key={sub.id} motion={motion} className={styles.photoCard}>
              <Link href={`/dashboard/submissions/${sub.id}`} className={styles.photoLink}>
                <div className={styles.photoImage}><img src={sub.thumbnailUrl} alt={sub.title} loading="lazy" /><span className={styles.photoCategory}>{sub.category}</span><span className={styles.photoArrow}><ArrowUpRight size={20} /></span></div>
                <div className={styles.photoCaption}><h3>{sub.title}</h3><div><span>{sub.status.replace(/_/g, ' ')}</span><span>{formatDate(sub.submittedAt)}</span></div></div>
              </Link>
            </TiltCard>)}
            {submissions.length < 2 && <Link href="/judge/photos" className={styles.emptyState}><span className={styles.newFrameIcon}><Plus size={24} /></span><strong>Make room for your next idea.</strong><span>One photograph. A whole new perspective.</span><span className={styles.newFrameAction}>Add a photograph <ArrowUpRight size={15} /></span></Link>}
          </div>
        </section>

        <section className={styles.competitionSection}>
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FIND YOUR NEXT CHALLENGE</p><h2>More room to create</h2></div><Link href="/competitions">Discover <ArrowUpRight size={15} /></Link></div>
          <div className={styles.contestList}>{contests.slice(0, 2).map((contest, index) => <Link href={`/competitions/${contest.id}`} key={contest.id} className={styles.contestRow}><span className={styles.contestIndex}>0{index + 1}</span><div><p>{contest.category}</p><h3>{contest.title}</h3></div><span className={styles.prize}>{contest.prizePool}</span><ArrowUpRight size={19} /></Link>)}{!contests.length && <Link className={styles.contestRow} href="/competitions"><Compass /><span>Explore the competition collection</span><ArrowRight size={18} /></Link>}</div>
        </section>
      </div>

      <aside className={styles.rightColumn}>
        <section className={styles.labCard}><span className={styles.labIcon}><Sparkles size={23} /></span><p className={styles.eyebrow}>A LITTLE CREATIVE CLARITY</p><h2>Meet your<br />second pair of eyes.</h2><p>Composition, light, and the feeling your photograph leaves behind. Get feedback on all five judging criteria.</p><Link href="/judge/photos">Open photo judging <ArrowUpRight size={18} /></Link><span className={styles.labOrb} aria-hidden="true" /></section>
        <section className={styles.timelineCard}><div className={styles.sectionHeading}><h2>On the horizon</h2><Clock size={16} /></div><div className={styles.timeline}>{MOCK_COMPETITIONS.slice(0, 3).map(contest => <Link key={contest.id} href={`/competitions/${contest.id}`}><span className={styles.timelineDot} /><p>{formatDate(contest.timeline.submissionDeadline)} <span>{getDaysLeft(contest.timeline.submissionDeadline).text}</span></p><h3>{contest.title}</h3></Link>)}</div></section>
        <section className={styles.updates}><div className={styles.sectionHeading}><h2>Studio notes</h2><ArrowDownLeft size={16} /></div>{notifications.length ? notifications.map(note => <Link key={note.id} href={note.link || '/dashboard/notifications'}><span className={styles.updateDot} /><div><h3>{note.title}</h3><p>{note.message}</p></div></Link>) : <p className={styles.quietNote}>You’re all caught up. Go make something worth sharing.</p>}</section>
      </aside>
    </div>
    <footer className={styles.footer}><span><Camera size={14} /> PIXELPRIZE STUDIO</span><p>For the moments only you can see.</p><span>CREATE SOMETHING THAT STAYS.</span></footer>
  </div>;
}
