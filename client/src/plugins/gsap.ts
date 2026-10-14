import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Single registration point — every module imports gsap from here so
// ScrollTrigger is only registered once.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
