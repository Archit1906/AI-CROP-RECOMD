import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

const LAUNCH_LOGS = [
  'LAUNCH SYSTEM ARMED',
  'CATAPULT CHARGING',
  'EJECTION SEQUENCE INITIATED',
  'UNIT CLEARED FOR LAUNCH',
  'AMRITKRISHI ONLINE',
]

export default function EvaLaunch({ onComplete }) {
  const canvasRef  = useRef(null)
  const overlayRef = useRef(null)
  const doneRef    = useRef(false)
  const [phase,    setPhase]    = useState('launch')
  const [logIndex, setLogIndex] = useState(-1)
  const [showLogo, setShowLogo] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const [shockwave,setShockwave]= useState(false)

  const handleComplete = () => {
    if (doneRef.current) return
    doneRef.current = true
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.6, ease: 'power2.in',
      onComplete
    })
  }

  useEffect(() => {
    setTimeout(() => setShowSkip(true), 800)

    const canvas   = canvasRef.current
    const W        = window.innerWidth
    const H        = window.innerHeight
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0A0A0F, 1)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 200)
    camera.position.set(0, 80, 0)
    camera.lookAt(0, 0, 0)

    // ── TUNNEL WALLS ──────────────────────────────────────────
    // Vertical grid lines rushing past — the launch shaft
    const SHAFT_LINES = 24
    const shaftGroup  = new THREE.Group()

    for (let i = 0; i < SHAFT_LINES; i++) {
      const angle  = (i / SHAFT_LINES) * Math.PI * 2
      const radius = 6
      const x      = Math.cos(angle) * radius
      const z      = Math.sin(angle) * radius

      const points = [
        new THREE.Vector3(x, -200, z),
        new THREE.Vector3(x,  200, z),
      ]
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#FF6600'),
        transparent: true,
        opacity: 0.6
      })
      shaftGroup.add(new THREE.Line(geo, mat))
    }
    scene.add(shaftGroup)

    // Horizontal rings along the shaft — the segmentation lines
    const RING_COUNT = 60
    const rings      = []
    for (let r = 0; r < RING_COUNT; r++) {
      const ringPoints = []
      const segments  = 32
      const radius    = 6
      const yPos      = -200 + r * (400 / RING_COUNT)

      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2
        ringPoints.push(new THREE.Vector3(
          Math.cos(angle) * radius, yPos, Math.sin(angle) * radius
        ))
      }
      const geo  = new THREE.BufferGeometry().setFromPoints(ringPoints)
      const mat  = new THREE.LineBasicMaterial({
        color: new THREE.Color(r % 5 === 0 ? '#FF6600' : '#FF660033'),
        transparent: true,
        opacity: r % 5 === 0 ? 0.8 : 0.3
      })
      rings.push(new THREE.Line(geo, mat))
      scene.add(rings[r])
    }

    // ── PARTICLE STREAM ────────────────────────────────────────
    // Orange sparks flying upward during launch
    const SPARK_COUNT = 2000
    const sparkPos    = new Float32Array(SPARK_COUNT * 3)
    const sparkVel    = new Float32Array(SPARK_COUNT)

    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const r     = Math.random() * 5.5
      sparkPos[i * 3]     = Math.cos(angle) * r
      sparkPos[i * 3 + 1] = (Math.random() - 0.5) * 400
      sparkPos[i * 3 + 2] = Math.sin(angle) * r
      sparkVel[i]         = 0.5 + Math.random() * 2
    }

    const sparkGeo = new THREE.BufferGeometry()
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))
    const sparkMat  = new THREE.PointsMaterial({
      color: '#FF6600', size: 0.05,
      transparent: true, opacity: 0.8
    })
    const sparks = new THREE.Points(sparkGeo, sparkMat)
    scene.add(sparks)

    // ── IMPACT PLATFORM ───────────────────────────────────────
    // Glowing platform at y=0 that the camera flies toward
    const platformGeo = new THREE.RingGeometry(0.5, 8, 64)
    const platformMat = new THREE.MeshBasicMaterial({
      color: '#FF6600', side: THREE.DoubleSide,
      transparent: true, opacity: 0
    })
    const platform = new THREE.Mesh(platformGeo, platformMat)
    platform.rotation.x = -Math.PI / 2
    platform.position.y = 0.1
    scene.add(platform)

    // Shockwave ring — expands on impact
    const shockGeo = new THREE.RingGeometry(0.1, 0.3, 64)
    const shockMat = new THREE.MeshBasicMaterial({
      color: '#FF6600', side: THREE.DoubleSide,
      transparent: true, opacity: 0
    })
    const shockRing = new THREE.Mesh(shockGeo, shockMat)
    shockRing.rotation.x = -Math.PI / 2
    shockRing.position.y = 0.2
    scene.add(shockRing)

    // ── AMBIENT LIGHT ─────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xFF6600, 0.3))
    const pointLight = new THREE.PointLight(0xFF6600, 2, 30)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    // ── ANIMATION LOOP ────────────────────────────────────────
    let frameId
    let camSpeed   = 0
    let camY       = 80
    let launched   = false
    let impacted   = false
    let sparkSpeed = 1

    const clock = new THREE.Clock()

    const animLoop = () => {
      frameId = requestAnimationFrame(animLoop)
      const delta = clock.getDelta()

      // Move rings downward to create rush effect
      rings.forEach(ring => {
        ring.position.y -= camSpeed * delta * 60
        if (ring.position.y < -200) ring.position.y += 400
      })

      // Spark stream
      const pos = sparks.geometry.attributes.position.array
      for (let i = 0; i < SPARK_COUNT; i++) {
        pos[i * 3 + 1] += sparkVel[i] * sparkSpeed * delta * 30
        if (pos[i * 3 + 1] > 200) pos[i * 3 + 1] = -200
      }
      sparks.geometry.attributes.position.needsUpdate = true

      // Rotate shaft slightly
      shaftGroup.rotation.y += delta * 0.1

      // Pulse platform glow
      if (launched) {
        platformMat.opacity = 0.05 + Math.sin(clock.getElapsedTime() * 4) * 0.03
      }

      renderer.render(scene, camera)
    }
    animLoop()

    // ── GSAP TIMELINE ─────────────────────────────────────────
    const tl = gsap.timeline()

    // Phase 1: Hold at top (0 - 0.5s)
    tl.call(() => setPhase('charging'), null, 0)

    // Phase 2: Begin descent (0.5s)
    tl.call(() => {
      launched   = true
      sparkSpeed = 3
    }, null, 0.5)

    // Accelerate camera downward
    tl.to(camera.position, {
      y: 60, duration: 0.5, ease: 'power1.in',
      onUpdate: () => { camSpeed = 0.3 }
    }, 0.5)

    tl.to(camera.position, {
      y: 20, duration: 0.8, ease: 'power3.in',
      onUpdate: () => { camSpeed = 1.5; sparkSpeed = 8 }
    }, 1.0)

    // Phase 3: Hyperspeed rush (1.8s)
    tl.call(() => { setPhase('rush'); setLogIndex(0) }, null, 1.8)

    tl.to(camera.position, {
      y: 2, duration: 0.6, ease: 'power4.in',
      onUpdate: () => { camSpeed = 5; sparkSpeed = 20 }
    }, 1.8)

    // Log sequence during rush
    LAUNCH_LOGS.forEach((log, i) => {
      tl.call(() => setLogIndex(i), null, 1.8 + i * 0.18)
    })

    // Phase 4: IMPACT (2.4s)
    tl.call(() => {
      setPhase('impact')
      camSpeed  = 0
      sparkSpeed = 0
      setShockwave(true)
    }, null, 2.4)

    // Camera slam stop
    tl.to(camera.position, {
      y: 0.5, duration: 0.1, ease: 'power4.out'
    }, 2.4)

    // Camera bounce back up slightly
    tl.to(camera.position, {
      y: 3, duration: 0.4, ease: 'elastic.out(1, 0.5)'
    }, 2.5)

    // Shockwave ring expand
    tl.to(shockRing.scale, {
      x: 40, z: 40, duration: 1.2, ease: 'power2.out'
    }, 2.4)
    tl.to(shockMat, {
      opacity: 0, duration: 1.2, ease: 'power2.out'
    }, 2.4)
    tl.to(shockMat, { opacity: 0.6, duration: 0.05 }, 2.4)

    // Platform flash
    tl.to(platformMat, { opacity: 0.3, duration: 0.1 }, 2.4)
    tl.to(platformMat, { opacity: 0.05, duration: 0.8 }, 2.5)

    // Screen flash
    tl.call(() => {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          backgroundColor: 'rgba(255,102,0,0.4)',
          duration: 0.05
        })
        gsap.to(overlayRef.current, {
          backgroundColor: 'rgba(10,10,15,0)',
          duration: 0.4,
          delay: 0.05
        })
      }
    }, null, 2.4)

    // Camera settle — look forward
    tl.to(camera.rotation, {
      x: -Math.PI / 2 + 0.1,
      duration: 0.8, ease: 'power2.out'
    }, 2.5)

    tl.to(camera.position, {
      y: 2, z: 0.5, duration: 0.8, ease: 'power2.out'
    }, 2.6)

    // Phase 5: Logo reveal (3.2s)
    tl.call(() => {
      setPhase('reveal')
      setShowLogo(true)
      camSpeed = 0
    }, null, 3.2)

    // Slow camera rotation for dramatic effect
    tl.to(camera.rotation, {
      y: 0.05, duration: 3, ease: 'power1.inOut'
    }, 3.2)

    // Auto complete
    tl.call(() => handleComplete(), null, 6.5)

    // Resize
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      window.removeEventListener('resize', onResize)
      tl.kill()
    }
  }, [])

  return (
    <div ref={overlayRef} style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'#0A0A0F', overflow:'hidden'
    }}>
      {/* Three.js canvas */}
      <canvas ref={canvasRef} style={{
        position:'absolute', inset:0,
        width:'100%', height:'100%'
      }} />

      {/* Scanlines */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)'
      }} />

      {/* Phase indicator top left */}
      <div style={{
        position:'absolute', top:24, left:24,
        pointerEvents:'none'
      }}>
        <p style={{ fontFamily:"'Courier New'", fontSize:9,
                     color:'#FF660044', letterSpacing:4, margin:'0 0 4px' }}>
          // NERV LAUNCH SYSTEM
        </p>
        <p style={{
          fontFamily:"'Courier New'", fontSize:13, fontWeight:700,
          color:'#FF6600', letterSpacing:3, margin:0,
          textShadow:'0 0 10px #FF660088',
          animation: phase === 'rush' ? 'glitch 0.2s infinite' : 'none'
        }}>
          {phase === 'charging' && 'CATAPULT CHARGING...'}
          {phase === 'rush'    && 'LAUNCH SEQUENCE ACTIVE'}
          {phase === 'impact'  && 'IMPACT DETECTED'}
          {phase === 'reveal'  && 'UNIT ONLINE'}
        </p>
      </div>

      {/* Launch logs — right side */}
      <div style={{
        position:'absolute', top:'50%', right:32,
        transform:'translateY(-50%)',
        pointerEvents:'none'
      }}>
        {LAUNCH_LOGS.map((log, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:8,
            marginBottom:6, opacity: i <= logIndex ? 1 : 0,
            transition:'opacity 0.1s',
            animation: i === logIndex ? 'flicker 0.15s' : 'none'
          }}>
            <div style={{
              width:6, height:6,
              background: i < logIndex ? '#00FF41' :
                          i === logIndex ? '#FF6600' : '#333',
              borderRadius:'50%',
              boxShadow: i === logIndex ? '0 0 8px #FF6600' : 'none'
            }} />
            <p style={{
              fontFamily:"'Courier New'", fontSize:10,
              color: i < logIndex  ? '#00FF4166' :
                     i === logIndex ? '#FF6600' : '#333',
              letterSpacing:2, margin:0,
              fontWeight: i === logIndex ? 700 : 400
            }}>
              {log}
            </p>
          </div>
        ))}
      </div>

      {/* Shockwave HTML rings */}
      {shockwave && (
        <>
          {[0, 0.15, 0.3].map((delay, i) => (
            <div key={i} style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)',
              width:10, height:10,
              border:'2px solid #FF6600',
              borderRadius:'50%', pointerEvents:'none',
              animation:`shockExpand 1.2s ${delay}s ease-out forwards`
            }} />
          ))}
        </>
      )}

      {/* AMRITKRISHI Logo */}
      {showLogo && (
        <div style={{
          position:'absolute', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          textAlign:'center', pointerEvents:'none',
          animation:'slamIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards'
        }}>
          {/* NGE Cross flash */}
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            width:4, height:'200vh',
            background:'linear-gradient(transparent, #FF660011, transparent)',
            pointerEvents:'none'
          }} />
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            width:'200vw', height:4,
            background:'linear-gradient(90deg, transparent, #FF660011, transparent)',
            pointerEvents:'none'
          }} />

          <p className="logo-glitch-in" style={{
            fontFamily:"'Courier New'", fontSize:52, fontWeight:900,
            color:'#FF6600', letterSpacing:10, margin:'0 0 8px',
            textShadow:'0 0 40px #FF6600, 0 0 80px #FF660066, 0 0 120px #FF660033',
            animation:'logoPulse 2s ease infinite'
          }}>
            AMRITKRISHI
          </p>
          <div style={{
            width:'100%', height:1,
            background:'linear-gradient(90deg, transparent, #FF6600, transparent)',
            margin:'8px 0'
          }} />
          <p style={{
            fontFamily:"'Courier New'", fontSize:11,
            color:'#666680', letterSpacing:6, margin:'0 0 4px'
          }}>
            MAGI AGRICULTURAL INTELLIGENCE SYSTEM
          </p>
          <p style={{
            fontFamily:"'Courier New'", fontSize:9,
            color:'#FF660066', letterSpacing:4, margin:0
          }}>
            VERSION 2.0 // NERV AGRI DIVISION // CLASSIFIED
          </p>

          {/* Feature tags */}
          <div style={{
            display:'flex', gap:12, justifyContent:'center', marginTop:20
          }}>
            {['CROP AI','DISEASE SCAN','WEATHER INTEL','MARKET DATA'].map(tag => (
              <span key={tag} style={{
                fontFamily:"'Courier New'", fontSize:8,
                color:'#FF660088', letterSpacing:2,
                border:'1px solid #FF660033',
                padding:'3px 10px', borderRadius:1
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom progress bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        height:2, background:'#FF660011'
      }}>
        <div style={{
          height:'100%',
          background:'#FF6600',
          boxShadow:'0 0 8px #FF6600',
          animation:'progressFill 6.5s linear forwards'
        }} />
      </div>

      {/* Skip button */}
      {showSkip && (
        <button onClick={handleComplete} style={{
          position:'absolute', top:20, right:20,
          background:'transparent', border:'1px solid #FF660044',
          color:'#FF660066', fontFamily:"'Courier New'",
          fontSize:10, letterSpacing:3, padding:'6px 14px',
          cursor:'pointer', borderRadius:2, transition:'all 0.2s'
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#FF6600'; e.currentTarget.style.color='#FF6600' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='#FF660044'; e.currentTarget.style.color='#FF660066' }}>
          SKIP ►
        </button>
      )}

      {/* All CSS keyframes */}
      <style>{`
        @keyframes glitch {
          0%  { text-shadow: 3px 0 #FF6600, -3px 0 #00FFFF; transform: translateX(2px) }
          25% { text-shadow: -3px 0 #FF6600, 3px 0 #00FFFF; transform: translateX(-2px) }
          50% { text-shadow: 3px 2px #FF6600, -3px -2px #00FFFF; transform: translateX(1px) }
          75% { text-shadow: -3px 2px #FF6600, 3px -2px #00FFFF; transform: translateX(-1px) }
          100%{ text-shadow: 3px 0 #FF6600, -3px 0 #00FFFF; transform: translateX(0) }
        }
        @keyframes flicker {
          0%{opacity:0}30%{opacity:1}60%{opacity:0.6}100%{opacity:1}
        }
        @keyframes shockExpand {
          0%  { width:10px; height:10px; opacity:1; border-color:#FF6600 }
          50% { border-color:#FF660088 }
          100%{ width:120vw; height:120vw; opacity:0; border-color:transparent }
        }
        @keyframes slamIn {
          0%  { opacity:0; transform:translate(-50%,-50%) scale(2.5); filter:blur(20px) }
          60% { opacity:1; transform:translate(-50%,-50%) scale(0.95); filter:blur(0) }
          80% { transform:translate(-50%,-50%) scale(1.02) }
          100%{ transform:translate(-50%,-50%) scale(1) }
        }
        @keyframes logoPulse {
          0%,100%{ text-shadow:0 0 40px #FF6600, 0 0 80px #FF660066 }
          50%    { text-shadow:0 0 60px #FF6600, 0 0 120px #FF660088, 0 0 180px #FF660033 }
        }
        @keyframes progressFill {
          from{ width:0% }
          to  { width:100% }
        }
      `}</style>
    </div>
  )
}
