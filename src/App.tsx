import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  AlertTriangle,
  Bell,
  BrainCircuit,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  DatabaseZap,
  MessageCircle,
  FileText,
  Fingerprint,
  HeartPulse,
  IdCard,
  Layers3,
  Menu,
  MonitorCog,
  Pill,
  Radio,
  Radar,
  ScanSearch,
  ServerCog,
  Workflow,
  Watch,
  TestTube2,
  Settings,
  Stethoscope,
  TabletSmartphone,
  UserRound,
  Video,
  X,
} from 'lucide-react';
import hospitalFilm01 from '../vid/01-scrub.mp4?url';
import hospitalFilm02 from '../vid/02-scrub.mp4?url';
import hospitalFilm03 from '../vid/03-scrub.mp4?url';
import hospitalFilm04 from '../vid/04-scrub.mp4?url';
import hospitalFilm05 from '../vid/5-scrub.mp4?url';
import hospitalFilm06 from '../vid/06-scrub.mp4?url';
import hospitalFilm07 from '../vid/7-scrub.mp4?url';
import hospitalFilm08 from '../vid/8-scrub.mp4?url';
import hospitalFilmMobile01 from '../vid/mobile/01-mobile.mp4?url';
import hospitalFilmMobile02 from '../vid/mobile/02-mobile.mp4?url';
import hospitalFilmMobile03 from '../vid/mobile/03-mobile.mp4?url';
import hospitalFilmMobile04 from '../vid/mobile/04-mobile.mp4?url';
import hospitalFilmMobile05 from '../vid/mobile/5-mobile.mp4?url';
import hospitalFilmMobile06 from '../vid/mobile/06-mobile.mp4?url';
import hospitalFilmMobile07 from '../vid/mobile/7-mobile.mp4?url';
import hospitalFilmMobile08 from '../vid/mobile/8-mobile.mp4?url';
import hospitalTwinLoop from '../vid/hosp-loop.mp4?url';
import mediscopeLogoWhite from './assets/medislogo-white.png';
import { scenes } from './experienceData';
import type { JourneyScene } from './experienceData';

gsap.registerPlugin(ScrollTrigger);

const accentClasses = {
  cyan: 'from-cyan-300 via-teal-300 to-emerald-300 text-cyan-200 border-cyan-300/30 shadow-cyan-500/20',
  blue: 'from-sky-300 via-blue-400 to-cyan-300 text-sky-200 border-sky-300/30 shadow-blue-500/20',
  green: 'from-emerald-300 via-teal-300 to-lime-200 text-emerald-200 border-emerald-300/30 shadow-emerald-500/20',
  red: 'from-red-300 via-orange-300 to-amber-200 text-red-200 border-red-300/30 shadow-red-500/20',
};

const cinematicVideos = {
  arrivalToReception: {
    src: hospitalFilm01,
    mobileSrc: hospitalFilmMobile01,
    label: 'Chegada para recepcao',
  },
  receptionToPatient: {
    src: hospitalFilm02,
    mobileSrc: hospitalFilmMobile02,
    label: 'Recepcao para paciente',
  },
  patientToClinical: {
    src: hospitalFilm03,
    mobileSrc: hospitalFilmMobile03,
    label: 'Paciente para consulta',
  },
  clinicalToRooms: {
    src: hospitalFilm04,
    mobileSrc: hospitalFilmMobile04,
    label: 'Consulta para leitos',
  },
  roomsToEmergency: {
    src: hospitalFilm05,
    mobileSrc: hospitalFilmMobile05,
    label: 'Leitos para emergencia',
  },
  emergencyToInventory: {
    src: hospitalFilm06,
    mobileSrc: hospitalFilmMobile06,
    label: 'Emergencia para estoque',
  },
  inventoryToManagement: {
    src: hospitalFilm07,
    mobileSrc: hospitalFilmMobile07,
    label: 'Estoque para gestao',
  },
  managementToInstitutional: {
    src: hospitalFilm08,
    mobileSrc: hospitalFilmMobile08,
    label: 'Gestao para institucional',
  },
} as const;

type CinematicVideoId = keyof typeof cinematicVideos;

const sceneVideoMap: Record<number, CinematicVideoId> = {
  0: 'arrivalToReception',
  1: 'arrivalToReception',
  2: 'receptionToPatient',
  3: 'patientToClinical',
  4: 'clinicalToRooms',
  5: 'roomsToEmergency',
  6: 'emergencyToInventory',
  7: 'inventoryToManagement',
  8: 'managementToInstitutional',
};

type JourneyItem =
  | {
      kind: 'scene';
      scene: JourneyScene;
      sceneIndex: number;
    }
  | {
      kind: 'transition';
      id: string;
      from: number;
      to: number;
      videoId: CinematicVideoId;
      direction: 'forward' | 'reverse';
      label: string;
      scrollVh: number;
      scrubDistance: number;
      startTime?: number;
    };

const journeyItems: JourneyItem[] = [
  { kind: 'scene', scene: scenes[0], sceneIndex: 0 },
  { kind: 'scene', scene: scenes[1], sceneIndex: 1 },
  {
    kind: 'transition',
    id: 'reception-patient-film',
    from: 1,
    to: 2,
    videoId: 'receptionToPatient',
    direction: 'reverse',
    label: 'Recepcao para paciente',
    scrollVh: 100,
    scrubDistance: 1400,
  },
  { kind: 'scene', scene: scenes[2], sceneIndex: 2 },
  {
    kind: 'transition',
    id: 'patient-clinical-film',
    from: 2,
    to: 3,
    videoId: 'patientToClinical',
    direction: 'forward',
    label: 'Paciente para consulta',
    scrollVh: 100,
    scrubDistance: 1400,
  },
  { kind: 'scene', scene: scenes[3], sceneIndex: 3 },
  {
    kind: 'transition',
    id: 'clinical-rooms-film',
    from: 3,
    to: 4,
    videoId: 'clinicalToRooms',
    direction: 'forward',
    label: 'Consulta para leitos',
    scrollVh: 100,
    scrubDistance: 1400,
  },
  { kind: 'scene', scene: scenes[4], sceneIndex: 4 },
  {
    kind: 'transition',
    id: 'rooms-emergency-film',
    from: 4,
    to: 5,
    videoId: 'roomsToEmergency',
    direction: 'forward',
    label: 'Leitos para emergencia',
    scrollVh: 100,
    scrubDistance: 1400,
    startTime: 2,
  },
  { kind: 'scene', scene: scenes[5], sceneIndex: 5 },
  {
    kind: 'transition',
    id: 'emergency-inventory-film',
    from: 5,
    to: 6,
    videoId: 'emergencyToInventory',
    direction: 'forward',
    label: 'Emergencia para estoque',
    scrollVh: 100,
    scrubDistance: 1400,
  },
  { kind: 'scene', scene: scenes[6], sceneIndex: 6 },
  {
    kind: 'transition',
    id: 'inventory-management-film',
    from: 6,
    to: 7,
    videoId: 'inventoryToManagement',
    direction: 'forward',
    label: 'Estoque para gestao',
    scrollVh: 100,
    scrubDistance: 1400,
  },
  { kind: 'scene', scene: scenes[7], sceneIndex: 7 },
  {
    kind: 'transition',
    id: 'management-institutional-film',
    from: 7,
    to: 8,
    videoId: 'managementToInstitutional',
    direction: 'forward',
    label: 'Gestao para institucional',
    scrollVh: 100,
    scrubDistance: 1400,
  },
  ...scenes.slice(8).map((scene, offset) => ({
    kind: 'scene' as const,
    scene,
    sceneIndex: offset + 8,
  })),
];

function App() {
  const videoRefs = useRef<Record<CinematicVideoId, HTMLVideoElement | null>>({
    arrivalToReception: null,
    receptionToPatient: null,
    patientToClinical: null,
    clinicalToRooms: null,
    roomsToEmergency: null,
    emergencyToInventory: null,
    inventoryToManagement: null,
    managementToInstitutional: null,
  });
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const activeSceneRef = useRef(0);
  const [activeVideoId, setActiveVideoId] = useState<CinematicVideoId>('arrivalToReception');
  const activeVideoIdRef = useRef<CinematicVideoId>('arrivalToReception');
  const [navOpen, setNavOpen] = useState(false);
  const useMobileVideo = useMobileVideoSource();

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    const setScene = (index: number) => {
      if (activeSceneRef.current !== index) {
        activeSceneRef.current = index;
        setActiveScene(index);
      }
    };

    const setActiveVideo = (videoId: CinematicVideoId) => {
      if (activeVideoIdRef.current !== videoId) {
        activeVideoIdRef.current = videoId;
        setActiveVideoId(videoId);
      }
    };

    const seekVideo = (
      video: HTMLVideoElement,
      progress: number,
      direction: 'forward' | 'reverse',
      startTime = 0,
    ) => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;

      if (duration <= 0) {
        return;
      }

      const clampedProgress = Math.min(1, Math.max(0, progress));
      const rangeStart = Math.min(Math.max(0, startTime), duration);
      const playableDuration = Math.max(0, duration - rangeStart);
      const rawTime =
        direction === 'reverse'
          ? rangeStart + playableDuration * (1 - clampedProgress)
          : rangeStart + playableDuration * clampedProgress;
      video.currentTime = Math.min(duration, Math.max(0, rawTime));
    };

    const triggers = gsap.utils.toArray<HTMLElement>('[data-journey-item]').map((item) => {
      const kind = item.dataset.kind;

      if (kind === 'intro-transition') {
        const videoId = item.dataset.videoId as CinematicVideoId;
        const direction = item.dataset.direction as 'forward' | 'reverse';
        const from = Number(item.dataset.from);
        const to = Number(item.dataset.to);
        const scrubDistance = Number(item.dataset.scrubDistance);

        return ScrollTrigger.create({
          trigger: item,
          start: 'top top',
          end: `+=${scrubDistance}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.08,
          invalidateOnRefresh: true,
          onEnter: () => {
            setActiveVideo(videoId);
            setScene(from);
            const video = videoRefs.current[videoId];
            if (video) {
              seekVideo(video, 0, direction);
            }
          },
          onEnterBack: () => {
            setActiveVideo(videoId);
            const video = videoRefs.current[videoId];
            if (video) {
              seekVideo(video, 1, direction);
            }
          },
          onLeave: () => {
            setScene(to);
            const video = videoRefs.current[videoId];
            if (video) {
              seekVideo(video, 1, direction);
            }
          },
          onLeaveBack: () => {
            setScene(from);
            const video = videoRefs.current[videoId];
            if (video) {
              seekVideo(video, 0, direction);
            }
          },
          onUpdate: (self) => {
            const video = videoRefs.current[videoId];

            setActiveVideo(videoId);
            setScene(self.progress < 0.92 ? from : to);

            if (video) {
              seekVideo(video, self.progress, direction);
            }
          },
        });
      }

      if (kind === 'scene') {
        const sceneIndex = Number(item.dataset.sceneIndex);
        const sceneVideoId = sceneVideoMap[sceneIndex] ?? 'managementToInstitutional';

        return ScrollTrigger.create({
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            setScene(sceneIndex);
            setActiveVideo(sceneVideoId);
          },
          onEnterBack: () => {
            setScene(sceneIndex);
            setActiveVideo(sceneVideoId);
          },
        });
      }

      const videoId = item.dataset.videoId as CinematicVideoId;
      const direction = item.dataset.direction as 'forward' | 'reverse';
      const from = Number(item.dataset.from);
      const to = Number(item.dataset.to);
      const scrubDistance = Number(item.dataset.scrubDistance);
      const startTime = Number(item.dataset.startTime ?? 0);

      return ScrollTrigger.create({
        trigger: item,
        start: 'top top',
        end: `+=${scrubDistance}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.12,
        invalidateOnRefresh: true,
        onEnter: () => {
          setActiveVideo(videoId);
          const video = videoRefs.current[videoId];
          if (video) {
            seekVideo(video, 0, direction, startTime);
          }
        },
        onEnterBack: () => {
          setActiveVideo(videoId);
          const video = videoRefs.current[videoId];
          if (video) {
            seekVideo(video, 1, direction, startTime);
          }
        },
        onLeave: () => {
          const video = videoRefs.current[videoId];
          setScene(to);
          if (video) {
            seekVideo(video, 1, direction, startTime);
          }
        },
        onLeaveBack: () => {
          const video = videoRefs.current[videoId];
          setScene(from);
          if (video) {
            seekVideo(video, 0, direction, startTime);
          }
        },
        onUpdate: (self) => {
          const video = videoRefs.current[videoId];

          setActiveVideo(videoId);
          setScene(self.progress < 0.5 ? from : to);

          if (video) {
            seekVideo(video, self.progress, direction, startTime);
          }
        },
      });
    });

    setActiveVideo('arrivalToReception');
    setScene(0);

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  const currentScene = scenes[activeScene];

  const animateScrollTo = (targetY: number, duration = 1200, onComplete?: () => void) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (progress: number) =>
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  };

  const scrollToScene = (index: number) => {
    const target = document.getElementById(scenes[index].id);

    if (index === 0 && target) {
      activeVideoIdRef.current = 'arrivalToReception';
      setActiveVideoId('arrivalToReception');
    } else if (target) {
      setActiveVideoId(sceneVideoMap[index] ?? 'managementToInstitutional');
    }

    if (target) {
      animateScrollTo(target.getBoundingClientRect().top + window.scrollY, index === 0 ? 1600 : 1200);
    }

    setNavOpen(false);
  };

  return (
    <main ref={shellRef} className="relative min-h-screen overflow-x-hidden bg-obsidian text-white">
      <CinematicVideo videoRefs={videoRefs} activeVideoId={activeVideoId} useMobileVideo={useMobileVideo} />
      <TopNavigation activeScene={currentScene} navOpen={navOpen} setNavOpen={setNavOpen} />
      <SideNavigation
        activeScene={activeScene}
        navOpen={navOpen}
        onNavigate={scrollToScene}
        setNavOpen={setNavOpen}
      />

      <div className="relative z-10">
        {journeyItems.map((item) => (
          item.kind === 'scene' ? (
            <ScenePanel
              key={item.scene.id}
              scene={item.scene}
              index={item.sceneIndex}
              isLast={item.sceneIndex === scenes.length - 1}
            />
          ) : (
            <VideoTransitionPanel key={item.id} transition={item} />
          )
        ))}
      </div>
    </main>
  );
}

function useMobileVideoSource() {
  const [useMobileVideo, setUseMobileVideo] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const connection = (navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    }).connection;

    const updatePreference = () => {
      const constrainedConnection =
        Boolean(connection?.saveData) || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '');

      setUseMobileVideo(mobileQuery.matches || constrainedConnection);
    };

    updatePreference();
    mobileQuery.addEventListener('change', updatePreference);

    return () => {
      mobileQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  return useMobileVideo;
}

function CinematicVideo({
  videoRefs,
  activeVideoId,
  useMobileVideo,
}: {
  videoRefs: React.MutableRefObject<Record<CinematicVideoId, HTMLVideoElement | null>>;
  activeVideoId: CinematicVideoId;
  useMobileVideo: boolean;
}) {
  useEffect(() => {
    const activeVideo = videoRefs.current[activeVideoId];

    if (activeVideo && activeVideo.readyState === 0) {
      activeVideo.load();
    }
  }, [activeVideoId, useMobileVideo, videoRefs]);

  useEffect(() => {
    const prepareVideos = () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (!video) {
          return;
        }

        video.load();

        const playAttempt = video.play();
        if (playAttempt) {
          playAttempt.then(() => video.pause()).catch(() => undefined);
        }
      });
    };

    window.addEventListener('pointerdown', prepareVideos, { once: true, passive: true });
    window.addEventListener('touchstart', prepareVideos, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', prepareVideos);
      window.removeEventListener('touchstart', prepareVideos);
    };
  }, [videoRefs]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {(Object.entries(cinematicVideos) as Array<[CinematicVideoId, (typeof cinematicVideos)[CinematicVideoId]]>).map(
        ([videoId, video]) => {
          const isActive = activeVideoId === videoId;

          return (
            <video
              key={`${videoId}-${useMobileVideo ? 'mobile' : 'desktop'}`}
              ref={(node) => {
                videoRefs.current[videoId] = node;
              }}
              className={`absolute inset-0 h-full w-full scale-105 object-cover saturate-[1.18] transition-opacity duration-500 ${
                isActive ? 'opacity-90' : 'opacity-0'
              }`}
              src={useMobileVideo ? video.mobileSrc : video.src}
              aria-label={video.label}
              muted
              playsInline
              preload={!useMobileVideo || isActive ? 'auto' : 'metadata'}
            />
          );
        },
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(14,165,233,.08),transparent_36%),radial-gradient(circle_at_96%_92%,rgba(2,7,13,.76),rgba(2,7,13,.42)_16%,transparent_36%),linear-gradient(90deg,rgba(2,7,13,.28),rgba(2,7,13,.04)_45%,rgba(2,7,13,.46))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,13,.28),rgba(2,7,13,.02)_42%,rgba(2,7,13,.40))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(2,7,13,.18)_68%,rgba(2,7,13,.74)_100%),linear-gradient(90deg,rgba(2,7,13,.72),transparent_18%,transparent_78%,rgba(2,7,13,.82)),linear-gradient(180deg,transparent_60%,rgba(2,7,13,.72)_100%)]" />
      <div className="absolute inset-0 bg-radial-grid bg-[length:100%_100%,64px_64px,64px_64px] opacity-22" />
    </div>
  );
}

function VideoTransitionPanel({
  transition,
}: {
  transition: Extract<JourneyItem, { kind: 'transition' }>;
}) {
  return (
    <section
      id={transition.id}
      data-journey-item
      data-kind="transition"
      data-from={transition.from}
      data-to={transition.to}
      data-video-id={transition.videoId}
      data-direction={transition.direction}
      data-scrub-distance={transition.scrubDistance}
      data-start-time={transition.startTime ?? 0}
      className="relative"
      style={{ minHeight: `${transition.scrollVh}vh` }}
      aria-label={transition.label}
    />
  );
}

function TopNavigation({
  activeScene,
  navOpen,
  setNavOpen,
}: {
  activeScene: JourneyScene;
  navOpen: boolean;
  setNavOpen: (value: boolean) => void;
}) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-[#03101c]/72 px-4 backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex h-24 max-w-[1560px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center">
          <img
            src={mediscopeLogoWhite}
            alt="Mediscope - Tecnologia que salva vidas"
            className="h-[66px] w-auto max-w-[285px] object-contain sm:h-[72px] sm:max-w-[345px]"
          />
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 lg:flex">
          <p className="truncate text-center font-display text-xl font-semibold uppercase tracking-wide text-white xl:text-2xl">
            {activeScene.nav}
          </p>
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.8)]" />
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
            Plataforma única para o ecossistema de Saúde
          </p>
        </div>

        <div className="relative hidden items-center gap-5 text-white/80 md:flex">
          <button
            type="button"
            onClick={() => setIsDemoOpen((open) => !open)}
            className="inline-flex h-11 items-center justify-center rounded border border-cyan-200/28 bg-[#02070d] px-4 text-sm font-semibold text-cyan-50 shadow-[0_0_22px_rgba(14,165,233,.22)] transition hover:border-cyan-100/42 hover:bg-[#061421]"
          >
            Solicite uma demo
          </button>
          <Bell className="size-5" />
          <Settings className="size-5" />
          <UserRound className="size-5" />
          {isDemoOpen && <DemoRequestPopover onClose={() => setIsDemoOpen(false)} />}
        </div>

        <button
          type="button"
          aria-label={navOpen ? 'Fechar navegacao' : 'Abrir navegacao'}
          onClick={() => setNavOpen(!navOpen)}
          className="grid size-11 place-items-center rounded border border-white/15 bg-white/5 text-white md:hidden"
        >
          {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
    </header>
  );
}

function DemoRequestPopover({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formsubmit.co/ajax/anderson@mediscope.com.br', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: 'Contato do site',
          Nome: formData.nome,
          Email: formData.email,
          Telefone: formData.telefone,
          Empresa: formData.empresa,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha no envio');
      }

      setStatus('sent');
      setFormData({ nome: '', email: '', telefone: '', empresa: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="absolute right-0 top-[calc(100%+1rem)] z-50 w-[360px] rounded-lg border border-cyan-100/24 bg-[#02070d] p-5 text-left shadow-glass">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-white">Solicite uma demo</p>
          <p className="mt-1 text-sm leading-5 text-cyan-50/58">Nossa equipe entrará em contato com você.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar formulário"
          className="grid size-8 shrink-0 place-items-center rounded border border-white/10 bg-white/5 text-white/72 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/52">Nome</span>
          <input
            required
            name="nome"
            value={formData.nome}
            onChange={(event) => updateField('nome', event.target.value)}
            className="h-11 w-full rounded border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/45 focus:bg-white/[0.075]"
            placeholder="Seu nome"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/52">Email</span>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="h-11 w-full rounded border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/45 focus:bg-white/[0.075]"
            placeholder="voce@empresa.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/52">Telefone</span>
          <input
            required
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={(event) => updateField('telefone', event.target.value)}
            className="h-11 w-full rounded border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/45 focus:bg-white/[0.075]"
            placeholder="(00) 00000-0000"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/52">Empresa</span>
          <input
            required
            name="empresa"
            value={formData.empresa}
            onChange={(event) => updateField('empresa', event.target.value)}
            className="h-11 w-full rounded border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-200/45 focus:bg-white/[0.075]"
            placeholder="Nome da empresa"
          />
        </label>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded bg-cyan-100 px-4 text-sm font-semibold text-[#03101c] transition hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'sending' ? 'Enviando...' : 'Enviar solicitação'}
        </button>

        {status === 'sent' && (
          <p className="text-sm font-medium text-emerald-300">Contato enviado com sucesso.</p>
        )}
        {status === 'error' && (
          <p className="text-sm font-medium text-red-300">
            Não foi possível enviar agora. Tente novamente em instantes.
          </p>
        )}
      </form>
    </div>
  );
}

function SideNavigation({
  activeScene,
  navOpen,
  onNavigate,
  setNavOpen,
}: {
  activeScene: number;
  navOpen: boolean;
  onNavigate: (index: number) => void;
  setNavOpen: (value: boolean) => void;
}) {
  return (
    <>
      <aside
        className={`fixed left-4 top-24 z-30 w-[260px] rounded-lg border border-white/10 bg-[#03101c]/74 p-3 shadow-glass backdrop-blur-2xl transition-transform duration-300 sm:left-6 lg:translate-x-0 ${
          navOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'
        }`}
      >
        <div className="mb-3 flex items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
          <span>Jornada</span>
          <Layers3 className="size-4 text-cyan-200" />
        </div>
        <nav className="space-y-1">
          {scenes.map((scene, index) => {
            const Icon = scene.icon;
            const isActive = index === activeScene;

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onNavigate(index)}
                className={`group flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm transition ${
                  isActive
                    ? 'bg-gradient-to-r from-signal to-blue-700 text-white shadow-trace'
                    : 'text-white/72 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{scene.nav}</span>
                <ChevronRight className={`size-4 transition ${isActive ? 'opacity-100' : 'opacity-35'}`} />
              </button>
            );
          })}
        </nav>
      </aside>

      {navOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
        />
      )}
    </>
  );
}

function ScenePanel({ scene, index, isLast }: { scene: JourneyScene; index: number; isLast: boolean }) {
  const Icon = scene.icon;
  const isEven = index % 2 === 0;
  const accent = accentClasses[scene.accent];
  const hasIntro = Boolean(scene.introParagraphs?.length);

  if (scene.id === 'principles') {
    return <PrinciplesScenePanel scene={scene} index={index} />;
  }

  if (scene.id === 'patient-app') {
    return <PatientAppScenePanel scene={scene} index={index} />;
  }

  if (scene.id === 'clinical') {
    return <ClinicalScenePanel scene={scene} index={index} />;
  }

  if (scene.id === 'room') {
    return <ConnectivityScenePanel scene={scene} index={index} />;
  }

  if (scene.id === 'emergency') {
    return <ArtificialIntelligenceScenePanel scene={scene} index={index} />;
  }

  if (scene.id === 'inventory') {
    return <ManagementIntelligenceScenePanel scene={scene} index={index} />;
  }

  if (hasIntro) {
    return <IntroScenePanel scene={scene} index={index} />;
  }

  return (
    <section
      id={scene.id}
      data-journey-item
      data-kind="scene"
      data-scene-index={index}
      className={`relative flex min-h-screen items-start px-4 pb-24 pt-28 sm:px-6 lg:px-10 ${
        isEven ? 'justify-end' : 'justify-center lg:justify-start'
      }`}
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        <div className="hidden lg:block" />
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className={`max-w-3xl ${isEven ? 'lg:col-start-2' : 'lg:col-start-2'} ${
            isEven ? 'lg:justify-self-end' : 'lg:justify-self-start'
          }`}
        >
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            {scene.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-cyan-50/75 sm:text-lg">{scene.body}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
            <motion.div
              whileHover={{ y: -4, scale: 1.01 }}
              className={`rounded-lg border bg-[#03101c]/72 p-5 shadow-2xl backdrop-blur-2xl ${accent}`}
            >
              <div className={`mb-5 grid size-12 place-items-center rounded bg-gradient-to-br ${accent}`}>
                <Icon className="size-6 text-[#02111c]" />
              </div>
              <p className="font-display text-4xl font-semibold text-white">{scene.metric}</p>
              <p className="mt-2 text-sm leading-5 text-white/62">{scene.metricLabel}</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-lg border border-white/10 bg-[#03101c]/68 p-5 backdrop-blur-2xl"
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                Inteligencia aplicada
              </p>
              <div className="grid gap-3">
                {scene.points.map((point) => (
                  <div key={point} className="flex items-center gap-3 rounded border border-white/8 bg-white/[0.035] px-3 py-2">
                    <span className="size-2 rounded-full bg-pulse shadow-[0_0_16px_rgba(19,217,196,.9)]" />
                    <span className="text-sm text-white/78">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {isLast && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <motion.a
                whileHover={{ y: -2 }}
                href="mailto:contato@mediscope.health"
                className="inline-flex h-12 items-center justify-center gap-2 rounded bg-white px-5 text-sm font-semibold text-[#03101c]"
              >
                Solicitar apresentacao
                <ChevronRight className="size-4" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#arrival"
                className="inline-flex h-12 items-center justify-center gap-2 rounded border border-white/16 bg-white/7 px-5 text-sm font-semibold text-white backdrop-blur-xl"
              >
                Rever jornada
              </motion.a>
            </div>
          )}
        </motion.article>
      </div>
    </section>
  );
}

function PrinciplesScenePanel({ scene, index }: { scene: JourneyScene; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const flowSteps = [
    { label: 'Paciente', detail: 'Pessoa no centro da jornada', icon: UserRound, tone: 'cyan' },
    { label: 'CPF • Cartão SUS • Face ID', detail: 'Identificação segura e interoperável', icon: IdCard, tone: 'blue' },
    { label: 'Identidade Única', detail: 'Cadastro mestre em toda a rede', icon: Fingerprint, tone: 'cyan' },
    { label: 'Prontuário Integrado', detail: 'Informação assistencial unificada', icon: FileText, tone: 'blue' },
    { label: 'Histórico Clínico', detail: 'Linha do tempo longitudinal', icon: Layers3, tone: 'cyan' },
    { label: 'Inteligência Artificial', detail: 'Contexto, risco e apoio à decisão', icon: BrainCircuit, tone: 'ai' },
    { label: 'Decisão Clínica', detail: 'Cuidado rápido, seguro e coordenado', icon: Stethoscope, tone: 'green' },
    { label: 'Gestão Inteligente', detail: 'Dados atualizados para tomada de decisão em tempo real.', icon: MonitorCog, tone: 'green' },
  ];

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 68%',
      end: 'bottom 28%',
      scrub: 0.25,
      onUpdate: (self) => {
        setActiveFlowStep(Math.min(flowSteps.length - 1, Math.floor(self.progress * flowSteps.length)));
      },
      onEnter: () => setActiveFlowStep(0),
      onLeave: () => setActiveFlowStep(flowSteps.length - 1),
      onEnterBack: () => setActiveFlowStep(flowSteps.length - 1),
      onLeaveBack: () => setActiveFlowStep(0),
    });

    return () => trigger.kill();
  }, [flowSteps.length]);

  return (
    <section
      ref={sectionRef}
      id={scene.id}
      data-journey-item
      data-kind="scene"
      data-scene-index={index}
      className="relative flex min-h-screen items-start px-4 pb-20 pt-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)_560px]">
        <div className="hidden lg:block" />

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="rounded-lg border border-white/10 bg-[#03101c]/58 p-6 shadow-glass backdrop-blur-xl sm:p-7">
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.03] text-white sm:text-6xl">
              {scene.title}
            </h1>

            {scene.kicker && (
              <p className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-snug text-cyan-100/90">
                {scene.kicker}
              </p>
            )}

            <div className="mt-6 space-y-4 text-base leading-8 text-cyan-50/76">
              <p>{scene.body}</p>
              {scene.introParagraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>

          <div className="mt-7 rounded-lg border border-white/10 bg-[#03101c]/52 p-5 shadow-glass backdrop-blur-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/55">
              O que isso significa na prática
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {scene.points.map((point) => (
                <div key={point} className="flex gap-3 rounded border border-white/8 bg-white/[0.035] p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                  <span className="text-sm leading-5 text-white/72">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.3, once: false }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative rounded-lg border border-cyan-100/12 bg-[#03101c]/48 p-5 shadow-glass backdrop-blur-xl"
        >
          <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_0%,rgba(19,217,196,.16),transparent_38%)]" />
          <div className="relative">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
              Fluxo inteligente de dados
            </p>

            <div className="relative space-y-3">
              <div className="absolute bottom-12 left-7 top-12 w-px overflow-hidden bg-cyan-100/12">
                <span className="absolute left-0 top-0 h-24 w-px animate-[flowEnergy_4.8s_linear_infinite] bg-gradient-to-b from-transparent via-cyan-200 to-transparent" />
              </div>

              {flowSteps.map((step, stepIndex) => {
                const Icon = step.icon;
                const isAi = step.tone === 'ai';
                const isFinal = step.tone === 'green';
                const isActive = stepIndex <= activeFlowStep;

                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.7, once: false }}
                    transition={{ delay: stepIndex * 0.08, duration: 0.42, ease: 'easeOut' }}
                    className="relative flex items-center gap-4"
                  >
                    <div
                      className={`relative z-10 grid size-14 shrink-0 place-items-center rounded border ${
                        isFinal && isActive
                          ? 'border-emerald-300/35 bg-emerald-300/12 text-emerald-200 shadow-[0_0_26px_rgba(52,211,153,.28)]'
                          : isAi && isActive
                            ? 'animate-[aiPulse_2.1s_ease-in-out_infinite] border-cyan-200/40 bg-cyan-300/14 text-cyan-100 shadow-[0_0_34px_rgba(103,232,249,.36)]'
                            : isActive
                              ? 'border-sky-200/35 bg-sky-300/14 text-cyan-100 shadow-[0_0_26px_rgba(14,165,233,.28)]'
                              : 'border-white/10 bg-white/[0.035] text-cyan-100/48'
                      }`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div
                      className={`min-w-0 flex-1 rounded border p-3 transition duration-300 ${
                        isActive
                          ? 'border-cyan-200/20 bg-cyan-300/[0.075] shadow-[0_0_22px_rgba(14,165,233,.16)]'
                          : 'border-white/8 bg-white/[0.035]'
                      }`}
                    >
                      <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-white/58'}`}>
                        {step.label}
                      </p>
                      <p className={`mt-1 text-xs leading-5 ${isActive ? 'text-cyan-50/68' : 'text-cyan-50/38'}`}>
                        {step.detail}
                      </p>
                    </div>
                    <span
                      className="absolute left-[1.65rem] top-1/2 size-1.5 animate-[flowParticle_2.8s_linear_infinite] rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,.95)]"
                      style={{ animationDelay: `${stepIndex * 0.18}s` }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function PatientAppScenePanel({ scene, index }: { scene: JourneyScene; index: number }) {
  const featureIcons = [FileText, TestTube2, Video, Pill, Bell, CalendarDays, MessageCircle, Watch];
  const features = scene.points.map((point, featureIndex) => {
    const [title, description] = point.split('|');
    return {
      title,
      description,
      icon: featureIcons[featureIndex] ?? TabletSmartphone,
    };
  });

  return (
    <section
      id={scene.id}
      data-journey-item
      data-kind="scene"
      data-scene-index={index}
      className="relative flex min-h-screen items-start px-4 pb-20 pt-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden lg:block" />

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(520px,1fr)]"
        >
          <div className="rounded-lg border border-white/10 bg-[#03101c]/58 p-6 shadow-glass backdrop-blur-xl sm:p-7">
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.03] text-white sm:text-6xl">
              {scene.title}
            </h1>
            <p className="mt-6 text-base leading-8 text-cyan-50/76">{scene.body}</p>

            <div className="mt-6 space-y-4 border-l-2 border-emerald-300/70 pl-5 text-base leading-8 text-cyan-50/78">
              {scene.introParagraphs?.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            {scene.introParagraphs?.[2] && (
              <p className="mt-7 font-display text-xl font-semibold leading-8 text-emerald-100/90">
                “{scene.introParagraphs[2]}”
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature, featureIndex) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.45, once: false }}
                  transition={{ delay: featureIndex * 0.04, duration: 0.42, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className="rounded-lg border border-white/10 bg-[#03101c]/52 p-4 shadow-glass backdrop-blur-xl"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded border border-emerald-300/24 bg-emerald-300/10 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,.18)]">
                      <Icon className="size-5" />
                    </div>
                    <p className="font-display text-lg font-semibold text-white">{feature.title}</p>
                  </div>
                  <p className="text-sm leading-6 text-cyan-50/66">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function ClinicalScenePanel({ scene, index }: { scene: JourneyScene; index: number }) {
  const resourceIcons = [Layers3, BrainCircuit, FileText, TestTube2, AlertTriangle, ClipboardList, Pill, HeartPulse];
  const decisionFlow = [
    { label: 'Paciente', detail: 'A jornada começa com contexto individual', icon: UserRound, tone: 'cyan' },
    { label: 'Histórico Clínico', detail: 'Linha do tempo assistencial integrada', icon: Layers3, tone: 'cyan' },
    { label: 'Exames • Imagens • Medicamentos • Alergias', detail: 'Dados clínicos reunidos no ponto de cuidado', icon: TestTube2, tone: 'blue' },
    { label: 'Inteligência Artificial', detail: 'Correlação, risco, padrões e automação', icon: BrainCircuit, tone: 'ai' },
    { label: 'Insights Clínicos', detail: 'Sinais relevantes apresentados com clareza', icon: AlertTriangle, tone: 'blue' },
    { label: 'Médico', detail: 'O profissional interpreta e decide', icon: Stethoscope, tone: 'doctor' },
    { label: 'Melhor decisão clínica', detail: 'Conduta mais segura, rápida e bem fundamentada', icon: CheckCircle2, tone: 'green' },
  ];
  const resources = scene.points.map((point, resourceIndex) => {
    const [title, description] = point.split('|');
    return {
      title,
      description,
      icon: resourceIcons[resourceIndex] ?? BrainCircuit,
    };
  });

  return (
    <section
      id={scene.id}
      data-journey-item
      data-kind="scene"
      data-scene-index={index}
      className="relative flex min-h-screen items-start px-4 pb-20 pt-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,0.92fr)_minmax(520px,0.95fr)]">
        <div className="hidden lg:block" />

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="rounded-lg border border-white/10 bg-[#03101c]/58 p-6 shadow-glass backdrop-blur-xl sm:p-7"
        >
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.03] text-white sm:text-6xl">
            {scene.title}
          </h1>
          <div className="mt-6 space-y-4 text-base leading-8 text-cyan-50/76">
            <p>{scene.body}</p>
            {scene.introParagraphs?.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {scene.introParagraphs?.[2] && (
            <p className="mt-7 border-l-2 border-cyan-300/70 pl-5 font-display text-xl font-semibold leading-8 text-cyan-100/90">
              “{scene.introParagraphs[2]}”
            </p>
          )}

          <div className="mt-7">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/55">
              Recursos Inteligentes
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.map((resource, resourceIndex) => {
                const Icon = resource.icon;

                return (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.45, once: false }}
                    transition={{ delay: resourceIndex * 0.035, duration: 0.38, ease: 'easeOut' }}
                    whileHover={{ y: -3 }}
                    className="rounded border border-white/8 bg-white/[0.035] p-3"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="size-4 text-cyan-200" />
                      <p className="text-sm font-semibold text-white">{resource.title}</p>
                    </div>
                    <p className="text-xs leading-5 text-cyan-50/58">{resource.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.3, once: false }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="space-y-4"
        >
          <div className="rounded-lg border border-cyan-100/12 bg-[#03101c]/56 p-5 shadow-glass backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded border border-cyan-300/24 bg-cyan-300/10 text-cyan-200">
                <Video className="size-5" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-white">Telemedicina Sem Limites</h2>
            </div>
            <div className="space-y-3 text-sm leading-6 text-cyan-50/68">
              <p>
                No Mediscope, a experiência clínica permanece a mesma, independentemente de onde médico e paciente
                estejam. Todos os recursos disponíveis no atendimento presencial também estão disponíveis durante a
                teleconsulta.
              </p>
              <p>
                O profissional consulta prontuário integrado, exames, imagens, prescrições, histórico, protocolos,
                alertas inteligentes e apoio à decisão exatamente como faria em um consultório físico.
              </p>
              <p>
                Consultas podem ser gravadas, transcritas automaticamente e incorporadas ao histórico do paciente,
                conforme configuração da instituição e autorização aplicável.
              </p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                'Atendimento pelo App do Paciente',
                'Consultórios Avançados para especialistas remotos',
                'Prontuário clínico completo durante a consulta',
                'Gravação e transcrição inteligente das consultas*',
                'Compartilhamento de exames e imagens em tempo real',
                'Prescrição eletrônica integrada',
                'Apoio por Inteligência Artificial durante o atendimento',
              ].map((item) => (
                <div key={item} className="flex gap-2 rounded border border-white/8 bg-white/[0.035] p-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-cyan-200" />
                  <span className="text-xs leading-5 text-cyan-50/62">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-cyan-100/12 bg-[#03101c]/52 p-5 shadow-glass backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,.035),transparent)]" />
            <div className="relative">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/60">
              Fluxo de apoio à decisão
            </p>
            <div className="relative space-y-2.5">
              <div className="absolute bottom-12 left-7 top-12 w-px overflow-hidden bg-cyan-100/12">
                <span className="absolute left-0 top-0 h-24 w-px animate-[flowEnergy_4.8s_linear_infinite] bg-gradient-to-b from-transparent via-cyan-200 to-transparent" />
              </div>

              {decisionFlow.map((step, stepIndex) => {
                const Icon = step.icon;
                const isAi = step.tone === 'ai';
                const isDoctor = step.tone === 'doctor';
                const isFinal = step.tone === 'green';

                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.62, once: false }}
                    transition={{ delay: stepIndex * 0.075, duration: 0.42, ease: 'easeOut' }}
                    className="relative flex items-center gap-4"
                  >
                    <div
                      className={`relative z-10 grid size-12 shrink-0 place-items-center rounded border ${
                        isFinal
                          ? 'border-emerald-300/40 bg-emerald-300/14 text-emerald-200 shadow-[0_0_30px_rgba(52,211,153,.3)]'
                          : isDoctor
                            ? 'border-white/20 bg-white/10 text-white shadow-[0_0_26px_rgba(255,255,255,.14)]'
                            : isAi
                              ? 'animate-[aiPulse_2.1s_ease-in-out_infinite] border-cyan-200/40 bg-cyan-300/14 text-cyan-100 shadow-[0_0_34px_rgba(103,232,249,.36)]'
                              : 'border-sky-200/22 bg-sky-300/9 text-cyan-100 shadow-[0_0_18px_rgba(14,165,233,.16)]'
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div
                      className={`min-w-0 flex-1 rounded border p-2.5 ${
                        isFinal
                          ? 'border-emerald-300/22 bg-emerald-300/[0.085]'
                          : 'border-white/8 bg-white/[0.045]'
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{step.label}</p>
                      <p className="mt-1 text-xs leading-5 text-cyan-50/58">{step.detail}</p>
                    </div>
                    <span
                      className="absolute left-[1.4rem] top-1/2 size-1.5 animate-[flowParticle_2.8s_linear_infinite] rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,.95)]"
                      style={{ animationDelay: `${stepIndex * 0.16}s` }}
                    />
                  </motion.div>
                );
              })}
            </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function ArtificialIntelligenceScenePanel({ scene, index }: { scene: JourneyScene; index: number }) {
  const introParagraphs = scene.introParagraphs ?? [];
  const managementBlock = introParagraphs.find((paragraph) => paragraph.startsWith('Gestão|'));
  const continuousBlock = introParagraphs.find((paragraph) => paragraph.startsWith('Inteligência Contínua|'));
  const introCopy = introParagraphs.filter(
    (paragraph) =>
      !paragraph.startsWith('Gestão|') &&
      !paragraph.startsWith('Inteligência Contínua|') &&
      !paragraph.startsWith('A Inteligência Artificial não substitui') &&
      !paragraph.startsWith('A melhor Inteligência Artificial'),
  );
  const humanQuote = introParagraphs.find((paragraph) => paragraph.startsWith('A Inteligência Artificial não substitui'));
  const continuousQuote = introParagraphs.find((paragraph) => paragraph.startsWith('A melhor Inteligência Artificial'));
  const managementParts = managementBlock?.split('|').slice(1) ?? [];
  const continuousParts = continuousBlock?.split('|').slice(1) ?? [];
  const continuousList = continuousParts[3]
    ?.split(';')
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

  return (
    <section
      id={scene.id}
      data-journey-item
      data-kind="scene"
      data-scene-index={index}
      className="relative flex min-h-screen items-start px-4 pb-20 pt-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,0.9fr)_minmax(560px,1fr)]">
        <div className="hidden lg:block" />

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-5"
        >
          <div className="rounded-lg border border-white/10 bg-[#03101c]/60 p-6 shadow-glass backdrop-blur-xl sm:p-7">
            <div className="mb-5 grid size-12 place-items-center rounded border border-cyan-200/24 bg-cyan-300/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,.18)]">
              <BrainCircuit className="size-6" />
            </div>

            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.03] text-white sm:text-6xl">
              {scene.title}
            </h1>

            {scene.kicker && (
              <p className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-snug text-cyan-100/90">
                {scene.kicker}
              </p>
            )}

            <div className="mt-6 space-y-4 text-base leading-8 text-cyan-50/76">
              <p>{scene.body}</p>
              {introCopy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {humanQuote && (
              <p className="mt-7 border-l-2 border-cyan-300/70 pl-5 font-display text-xl font-semibold leading-8 text-cyan-100/90">
                “{humanQuote}”
              </p>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-[#03101c]/52 p-5 shadow-glass backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded border border-sky-300/24 bg-sky-300/10 text-sky-200">
                <Activity className="size-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">{scene.solutionHeading}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cyan-100/48">IA em toda a plataforma</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {scene.solutions?.map((solution) => (
                <div key={solution.name} className="rounded border border-white/8 bg-white/[0.035] p-3">
                  <p className="text-sm font-semibold text-white">{solution.name}</p>
                  <p className="mt-1 text-xs leading-5 text-cyan-50/60">{solution.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.3, once: false }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="grid gap-4"
        >
          <div className="rounded-lg border border-red-300/16 bg-[#03101c]/58 p-5 shadow-glass backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded border border-red-300/24 bg-red-300/10 text-red-200">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">Atendimento de Urgência</p>
                <p className="mt-1 text-sm text-cyan-50/58">Em situações críticas, cada segundo faz diferença.</p>
              </div>
            </div>

            <div className="grid gap-2">
              {scene.points.map((point) => (
                <div key={point} className="flex gap-3 rounded border border-white/8 bg-white/[0.035] px-3 py-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-red-200" />
                  <p className="text-xs leading-5 text-cyan-50/68">{point}</p>
                </div>
              ))}
            </div>

            <p className="mt-4 border-l-2 border-red-200/60 pl-4 font-display text-base font-semibold leading-7 text-red-50/90">
              O resultado é uma equipe preparada antes mesmo da entrada do paciente no hospital.
            </p>
          </div>

          {managementParts.length > 0 && (
            <div className="rounded-lg border border-sky-300/16 bg-[#03101c]/58 p-5 shadow-glass backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded border border-sky-300/24 bg-sky-300/10 text-sky-200">
                  <MonitorCog className="size-5" />
                </div>
                <p className="font-display text-lg font-semibold text-white">Inteligência para Gestão</p>
              </div>

              <div className="space-y-3 text-sm leading-6 text-cyan-50/68">
                {managementParts.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {continuousParts.length > 0 && (
            <div className="rounded-lg border border-cyan-200/16 bg-[#03101c]/58 p-5 shadow-glass backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded border border-cyan-200/26 bg-cyan-300/10 text-cyan-100">
                  <BrainCircuit className="size-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-white">Inteligência Contínua</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cyan-100/48">{scene.metric} motores especializados</p>
                </div>
              </div>

              <div className="space-y-3 text-sm leading-6 text-cyan-50/68">
                {continuousParts.slice(0, 3).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {continuousList.map((item) => (
                  <div key={item} className="rounded border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-5 text-cyan-50/68">
                    {item}
                  </div>
                ))}
              </div>

              {continuousParts[4] && (
                <p className="mt-4 text-sm font-semibold leading-6 text-cyan-100/90">{continuousParts[4]}</p>
              )}

              {continuousQuote && (
                <p className="mt-4 border-l-2 border-emerald-300/70 pl-4 font-display text-base font-semibold leading-7 text-emerald-100/90">
                  “{continuousQuote}”
                </p>
              )}
            </div>
          )}
        </motion.aside>
      </div>
    </section>
  );
}

function ManagementIntelligenceScenePanel({ scene, index }: { scene: JourneyScene; index: number }) {
  const introParagraphs = scene.introParagraphs ?? [];
  const introCopy = introParagraphs.slice(0, 2);
  const quoteOne = introParagraphs.find((paragraph) => paragraph.startsWith('Conhecer os números'));
  const quoteTwo = introParagraphs.find((paragraph) => paragraph.startsWith('Quando cada recurso'));
  const structuredBlocks = introParagraphs
    .slice(2)
    .filter((paragraph) => paragraph.includes('|'))
    .map((block) => {
      const [title, ...parts] = block.split('|');
      return { title, parts };
    });
  const resourceManagementBlock = structuredBlocks.find((block) => block.title === 'Gestão Inteligente de Recursos');
  const resourceManagementListIndex = resourceManagementBlock?.parts.findIndex((part) => part.includes(';')) ?? -1;
  const resourceManagementItems =
    resourceManagementBlock && resourceManagementListIndex >= 0
      ? resourceManagementBlock.parts[resourceManagementListIndex]
          .split(';')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  const sideBlocks = structuredBlocks.filter((block) => block.title !== 'Gestão Inteligente de Recursos');
  const timelineSteps = [
    {
      label: 'Recebimento',
      detail: 'Fornecedor confirmado, lote identificado e validade registrada.',
      icon: DatabaseZap,
      meta: 'Operador: Almoxarifado • 08:42 • Lote MDS-24A',
    },
    {
      label: 'Almoxarifado',
      detail: 'Entrada no estoque central com localização e conferência automática.',
      icon: Boxes,
      meta: 'Local: Central • Validade: 11/2027 • Conferido',
    },
    {
      label: 'Farmácia',
      detail: 'Transferência rastreada para estoque assistencial.',
      icon: Pill,
      meta: 'Destino: Farmácia clínica • Temperatura validada',
    },
    {
      label: 'Separação',
      detail: 'Medicamento separado conforme prescrição e protocolo de segurança.',
      icon: ClipboardList,
      meta: 'Prescrição vinculada • Dupla checagem pendente',
    },
    {
      label: 'Enfermagem',
      detail: 'Equipe recebe o item com identificação do paciente e confirmação de dose.',
      icon: UserRound,
      meta: 'Responsável: Enfermagem • Dose confirmada',
    },
    {
      label: 'Beira do Leito',
      detail: 'Conferência de segurança antes da administração.',
      icon: CheckCircle2,
      meta: 'Paciente, medicamento, dose, horário e via checados',
    },
    {
      label: 'Paciente',
      detail: 'Administração vinculada à jornada assistencial.',
      icon: HeartPulse,
      meta: 'Evento clínico registrado em tempo real',
    },
    {
      label: 'Registro Automático',
      detail: 'Prontuário, estoque e indicadores atualizados sem retrabalho.',
      icon: FileText,
      meta: 'Prontuário atualizado • Estoque baixado • Indicador gerado',
    },
  ];
  const technologies = ['RFID', 'Código de Barras', 'QR Code', 'RTLS', 'BLE', 'Dispositivos Móveis', 'Gateways Inteligentes', 'Sensores Proprietários'];
  const custodyTimeline = (
    <div className="rounded-lg border border-emerald-300/24 bg-[#02140f]/82 p-5 shadow-[0_0_34px_rgba(16,185,129,.18)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-white">Cadeia de custódia visual</p>
          <p className="mt-1 text-sm text-cyan-50/62">Rastreabilidade do recebimento ao prontuário.</p>
        </div>
        <span className="rounded border border-emerald-300/24 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
          Completa
        </span>
      </div>

      <div className="relative grid gap-3 sm:grid-cols-2">
        <div className="absolute bottom-4 left-6 top-16 hidden w-px bg-emerald-300/18 sm:block">
          <span className="block h-28 w-px animate-[flowEnergy_4.8s_linear_infinite] bg-gradient-to-b from-transparent via-emerald-200 to-transparent" />
        </div>

        {timelineSteps.map((step, stepIndex) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.18, once: false }}
              transition={{ delay: stepIndex * 0.04, duration: 0.36, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              title={step.meta}
              className="group relative min-h-[136px] rounded border border-emerald-300/18 bg-emerald-300/[0.055] p-3 transition hover:border-emerald-200/38 hover:bg-emerald-300/[0.09]"
            >
              <div className="mb-3 grid size-11 place-items-center rounded border border-emerald-300/30 bg-emerald-300/12 text-emerald-100 shadow-[0_0_22px_rgba(52,211,153,.18)]">
                <Icon className="size-5" />
              </div>
              <p className="text-sm font-semibold text-white">{step.label}</p>
              <p className="mt-1 text-xs leading-5 text-cyan-50/58">{step.detail}</p>
              <p className="mt-3 hidden rounded border border-white/10 bg-[#02070d]/92 p-2 text-[11px] leading-4 text-emerald-50/78 group-hover:block">
                {step.meta}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section
      id={scene.id}
      data-journey-item
      data-kind="scene"
      data-scene-index={index}
      className="relative flex min-h-screen items-start px-4 pb-20 pt-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,0.86fr)_minmax(590px,1fr)]">
        <div className="hidden lg:block" />

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-5"
        >
          <div className="rounded-lg border border-white/10 bg-[#03101c]/60 p-6 shadow-glass backdrop-blur-xl sm:p-7">
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.03] text-white sm:text-6xl">
              {scene.title}
            </h1>

            {scene.kicker && (
              <p className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-snug text-emerald-100/90">
                {scene.kicker}
              </p>
            )}

            <div className="mt-6 space-y-4 text-base leading-8 text-cyan-50/76">
              <p>{scene.body}</p>
              {introCopy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {quoteOne && (
              <p className="mt-7 border-l-2 border-emerald-300/70 pl-5 font-display text-xl font-semibold leading-8 text-emerald-100/90">
                “{quoteOne}”
              </p>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-[#03101c]/52 p-5 shadow-glass backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded border border-emerald-300/24 bg-emerald-300/10 text-emerald-200">
                <MonitorCog className="size-5" />
              </div>
              <p className="font-display text-lg font-semibold text-white">{scene.solutionHeading}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {scene.solutions?.map((solution) => (
                <div key={solution.name} className="rounded border border-white/8 bg-white/[0.035] p-3">
                  <p className="text-sm font-semibold text-white">{solution.name}</p>
                  <p className="mt-1 text-xs leading-5 text-cyan-50/60">{solution.description}</p>
                </div>
              ))}
            </div>
          </div>

          {resourceManagementBlock && (
            <div className="rounded-lg border border-emerald-300/16 bg-[#03101c]/56 p-5 shadow-glass backdrop-blur-xl">
              <p className="font-display text-lg font-semibold text-white">{resourceManagementBlock.title}</p>
              <div className="mt-3 space-y-3 text-sm leading-6 text-cyan-50/68">
                {resourceManagementBlock.parts.map((part, partIndex) => {
                  if (partIndex === resourceManagementListIndex) {
                    return (
                      <div key={part} className="grid gap-2 sm:grid-cols-2">
                        {resourceManagementItems.map((item) => (
                          <div
                            key={item}
                            className="rounded border border-white/8 bg-white/[0.035] px-3 py-2 text-xs leading-5 text-cyan-50/66"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return <p key={part}>{part}</p>;
                })}
              </div>
            </div>
          )}
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.3, once: false }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="grid gap-4"
        >
          {custodyTimeline}

          <div className="grid gap-4 xl:grid-cols-2">
            {sideBlocks.slice(0, 3).map((block) => (
              <div key={block.title} className="rounded-lg border border-white/10 bg-[#03101c]/54 p-4 shadow-glass backdrop-blur-xl">
                <p className="font-display text-base font-semibold text-white">{block.title}</p>
                <div className="mt-3 space-y-3 text-sm leading-6 text-cyan-50/66">
                  {block.parts.map((part) => (
                    <p key={part}>{part}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {sideBlocks.slice(3).map((block) => {
              const listIndex = block.parts.findIndex((part) => part.includes(';'));
              const listItems =
                listIndex >= 0
                  ? block.parts[listIndex].split(';').map((item) => item.trim()).filter(Boolean)
                  : [];

              return (
                <div key={block.title} className="rounded-lg border border-white/10 bg-[#03101c]/54 p-4 shadow-glass backdrop-blur-xl">
                  <p className="font-display text-base font-semibold text-white">{block.title}</p>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-cyan-50/66">
                    {block.parts.map((part, partIndex) => {
                      if (partIndex === listIndex) {
                        return (
                          <div key={part} className="grid gap-2">
                            {listItems.map((item) => (
                              <div key={item} className="rounded border border-white/8 bg-white/[0.035] px-3 py-2 text-xs leading-5 text-cyan-50/66">
                                {item}
                              </div>
                            ))}
                          </div>
                        );
                      }

                      return <p key={part}>{part}</p>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-cyan-200/16 bg-[#03101c]/58 p-5 shadow-glass backdrop-blur-xl">
            <p className="mb-4 font-display text-lg font-semibold text-white">Tecnologias Suportadas</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {technologies.map((technology) => (
                <div key={technology} className="rounded border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-xs font-semibold text-cyan-50/74">
                  {technology}
                </div>
              ))}
            </div>

            {quoteTwo && (
              <p className="mt-5 border-l-2 border-cyan-300/70 pl-4 font-display text-base font-semibold leading-7 text-cyan-100/90">
                “{quoteTwo}”
              </p>
            )}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function ConnectivityScenePanel({ scene, index }: { scene: JourneyScene; index: number }) {
  const connectivityIcons = [ScanSearch, Activity, ServerCog, Radar, MonitorCog, Pill, Workflow, DatabaseZap, Watch];
  const textBlocks = scene.introParagraphs ?? [];
  const closingStatement = textBlocks[textBlocks.length - 1];
  const supportingBlocks = textBlocks.slice(0, -1);
  const integrationResources = supportingBlocks.reduce<string[]>((resources, block) => {
    const resourcesPart = block.split('|').find((part) => part.startsWith('Recursos de Integração:'));

    if (!resourcesPart) {
      return resources;
    }

    return [
      ...resources,
      ...resourcesPart
        .replace('Recursos de Integração:', '')
        .split(';')
        .map((item) => item.trim())
        .filter(Boolean),
    ];
  }, []);
  const capabilities = scene.points.map((point, pointIndex) => {
    const [title, description] = point.split('|');
    return {
      title,
      description,
      icon: connectivityIcons[pointIndex] ?? Radio,
    };
  });

  return (
    <section
      id={scene.id}
      data-journey-item
      data-kind="scene"
      data-scene-index={index}
      className="relative flex min-h-screen items-start px-4 pb-20 pt-28 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,0.82fr)_minmax(580px,1fr)]">
        <div className="hidden lg:block" />

        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="rounded-lg border border-white/10 bg-[#03101c]/58 p-6 shadow-glass backdrop-blur-xl sm:p-7"
        >
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.03] text-white sm:text-6xl">
            {scene.title}
          </h1>

          {scene.kicker && (
            <p className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-snug text-cyan-100/90">
              {scene.kicker}
            </p>
          )}

          <div className="mt-6 space-y-4 text-base leading-8 text-cyan-50/76">
            <p>{scene.body}</p>
            {supportingBlocks.map((block) => {
              const [heading, ...paragraphs] = block.split('|');

              if (paragraphs.length === 0) {
                return <p key={block}>{heading}</p>;
              }

              return (
                <div key={heading} className="rounded-lg border border-sky-300/16 bg-sky-300/[0.045] p-4">
                  <h2 className="font-display text-xl font-semibold leading-7 text-cyan-100">{heading}</h2>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-cyan-50/70">
                    {paragraphs.map((paragraph, paragraphIndex) => {
                      if (paragraph.startsWith('Recursos de Integração:')) {
                        return null;
                      }

                      const isFinalQuote = paragraphIndex === paragraphs.length - 1 && heading === 'Ecossistema Aberto';

                      if (isFinalQuote) {
                        return (
                          <p
                            key={paragraph}
                            className="border-l-2 border-emerald-300/70 pl-4 font-display text-base font-semibold leading-7 text-emerald-100/90"
                          >
                            “{paragraph}”
                          </p>
                        );
                      }

                      return <p key={paragraph}>{paragraph}</p>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {closingStatement && (
            <p className="mt-7 border-l-2 border-sky-300/70 pl-5 font-display text-xl font-semibold leading-8 text-sky-100/90">
              “{closingStatement}”
            </p>
          )}
        </motion.article>

        <div className="grid gap-3 sm:grid-cols-2">
          {capabilities.map((capability, capabilityIndex) => {
            const Icon = capability.icon;

            return (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.38, once: false }}
                transition={{ delay: capabilityIndex * 0.035, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -3 }}
                className={`rounded-lg border border-white/10 bg-[#03101c]/52 p-4 shadow-glass backdrop-blur-xl ${
                  capabilityIndex === 0 ? 'sm:col-span-2' : ''
                }`}
              >
                {capabilityIndex === 0 && (
                  <div className="mb-4 overflow-hidden rounded border border-cyan-100/12 bg-black/30">
                    <video
                      src={hospitalTwinLoop}
                      className="aspect-video w-full object-cover opacity-90"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                )}
                <div className="mb-3 flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded border border-sky-300/24 bg-sky-300/10 text-sky-200 shadow-[0_0_18px_rgba(14,165,233,.18)]">
                    <Icon className="size-5" />
                  </div>
                  <p className="font-display text-base font-semibold leading-5 text-white">{capability.title}</p>
                </div>
                <p className="text-sm leading-6 text-cyan-50/62">{capability.description}</p>
              </motion.div>
            );
          })}

          {integrationResources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.38, once: false }}
              transition={{ delay: capabilities.length * 0.035, duration: 0.4, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="rounded-lg border border-cyan-200/18 bg-[#03101c]/62 p-4 shadow-glass backdrop-blur-xl sm:col-span-2"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded border border-cyan-200/28 bg-cyan-300/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,.18)]">
                  <ClipboardList className="size-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold leading-6 text-white">Recursos de Integração</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-cyan-100/48">Ecossistema Aberto</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {integrationResources.map((item) => (
                  <div
                    key={item}
                    className="rounded border border-white/10 bg-white/[0.045] px-3 py-2 text-xs leading-5 text-cyan-50/72"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function IntroScenePanel({
  scene,
  index,
}: {
  scene: JourneyScene;
  index: number;
}) {
  return (
    <section
      id={scene.id}
      data-journey-item
      data-kind="intro-transition"
      data-scene-index={index}
      data-from={0}
      data-to={1}
      data-video-id="arrivalToReception"
      data-direction="forward"
      data-scrub-distance={820}
      className="relative flex min-h-screen items-center px-4 pb-10 pt-24 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)_minmax(440px,40vw)]">
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.22, once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-[620px] rounded-lg border border-white/12 bg-[#03101c]/46 p-5 shadow-glass backdrop-blur-xl sm:p-6 lg:col-start-3 lg:justify-self-end"
        >
          <h1 className="max-w-[600px] font-display text-4xl font-semibold leading-[1.04] text-white drop-shadow-[0_10px_34px_rgba(0,0,0,.62)] sm:text-5xl lg:text-[3rem]">
            {scene.title}
          </h1>

          {scene.kicker && (
            <p className="mt-4 max-w-[560px] font-display text-xl font-semibold leading-snug text-cyan-100/88 drop-shadow-[0_8px_26px_rgba(0,0,0,.56)] sm:text-2xl">
              {scene.kicker}
            </p>
          )}

          <div className="mt-5 max-w-[620px] border-l-2 border-pulse/70 py-1 pl-5">
            <p className="text-base leading-7 text-cyan-50/82 drop-shadow-[0_6px_22px_rgba(0,0,0,.62)] sm:text-lg sm:leading-8">
              {scene.body}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <motion.a
              whileHover={{ y: -2 }}
              href="#principles"
              className="inline-flex h-12 items-center justify-center rounded bg-cyan-100 px-5 text-sm font-semibold text-[#03101c] shadow-[0_0_28px_rgba(103,232,249,.24)]"
            >
              Entrar no Hospital Inteligente
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#patient-app"
              className="inline-flex h-12 items-center justify-center rounded border border-white/16 bg-white/7 px-5 text-sm font-semibold text-white backdrop-blur-xl"
            >
              Ver Recursos
            </motion.a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {scene.introParagraphs?.map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -3 }}
                className="rounded border border-white/10 bg-white/[0.045] p-3"
              >
                <span className="mb-3 block size-1.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.9)]" />
                <p className="text-sm font-semibold leading-5 text-cyan-50/88">{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/68">
            <span className="relative h-10 w-[3px] overflow-hidden rounded-full bg-white/16">
              <span className="absolute left-0 top-0 h-4 w-full animate-[scrollHint_1.45s_ease-in-out_infinite] rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.9)]" />
            </span>
            Role para navegar
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export default App;
