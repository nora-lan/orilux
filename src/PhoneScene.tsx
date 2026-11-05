import { useId } from 'react'
import './phone-scene.css'

// Separate the phone and data panels from the source artwork so each can float
// independently, matching the product site's original motion.
const panels = [
  { id: 'network', points: '878,243 1048,202 1040,366 852,388', duration: '7.6s', delay: '-1.2s' },
  { id: 'donut', points: '805,405 1019,383 1003,563 785,548', duration: '6.4s', delay: '-3.1s' },
  { id: 'waves', points: '707,549 1000,578 986,736 686,711', duration: '8.8s', delay: '-5.2s' },
  { id: 'bars', points: '1364,141 1623,82 1621,282 1341,351', duration: '8.2s', delay: '-2.8s' },
  { id: 'analytics', points: '1345,360 1592,310 1582,535 1328,570', duration: '7.1s', delay: '-4.7s' },
  { id: 'surface', points: '1335,583 1594,550 1590,765 1327,767', duration: '9.2s', delay: '-.6s' },
] as const

const phonePath = 'M1093 124 L1285 79 Q1312 73 1333 97 Q1348 112 1340 153 L1299 749 Q1294 786 1257 797 L1050 801 Q1002 798 1005 750 L1065 167 Q1067 136 1093 124 Z'

export default function PhoneScene() {
  const prefix = `v2-phone-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const id = (name: string) => `${prefix}-${name}`
  const url = (name: string) => `url(#${id(name)})`
  const source = `#${id('source')}`

  return <div className="v2-phone-scene" aria-hidden="true">
    <svg className="v2-phone-art-plane" viewBox="0 0 1672 941" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs>
        <image id={id('source')} href="/media/v2/ai-phone-background.png" width="1672" height="941" />
        <clipPath id={id('phone')}><path d={phonePath} /></clipPath>
        <clipPath id={id('screen')}><path d="M1094 164 L1318 108 L1263 681 L1026 729 Z" /></clipPath>
        {panels.map(panel => <clipPath id={id(panel.id)} key={panel.id}><polygon points={panel.points} /></clipPath>)}
        <mask id={id('background')} maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="941" style={{ maskType: 'luminance' }}>
          <rect width="1672" height="941" fill="white" />
          <path d={phonePath} fill="black" />
          {panels.map(panel => <polygon key={panel.id} points={panel.points} fill="black" />)}
        </mask>
        <linearGradient id={id('scan')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#64edff" stopOpacity="0" />
          <stop offset=".85" stopColor="#64edff" stopOpacity=".13" />
          <stop offset="1" stopColor="#aff9ff" stopOpacity=".35" />
        </linearGradient>
        <radialGradient id={id('pulse')}>
          <stop offset="0" stopColor="#5df6ff" stopOpacity=".34" />
          <stop offset="1" stopColor="#27dcff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* The blurred layer fills the small gaps left by moving cutouts. The
          sharp base masks out every moving object to avoid duplicate edges. */}
      <use href={source} className="v2-phone-underlay" />
      <use href={source} mask={url('background')} />
      {panels.map(panel => <g className={`v2-phone-panel v2-phone-panel-${panel.id}`} style={{ animationDuration: panel.duration, animationDelay: panel.delay }} key={panel.id}>
        <g clipPath={url(panel.id)}>
          <use href={source} />
          {panel.id === 'network' && <ellipse className="v2-phone-data-pulse" cx="960" cy="300" rx="53" ry="56" fill={url('pulse')} />}
          {panel.id === 'donut' && <ellipse className="v2-phone-data-pulse v2-phone-pulse-delayed" cx="858" cy="477" rx="44" ry="51" fill={url('pulse')} />}
          {panel.id === 'waves' && <g className="v2-phone-flow-lines">
            <path d="M720 640 C775 606 807 702 851 650 S931 648 979 630" />
            <path d="M718 668 C781 704 815 623 866 660 S928 686 977 651" />
          </g>}
          {panel.id === 'bars' && <g className="v2-phone-bar-highlights">
            {[0, 1, 2, 3, 4, 5].map(index => <path key={index} d={`M${1417 + index * 27} ${289 - index * 7} l${2 + index * .4} -${38 + index * 13}`} style={{ animationDelay: `${-index * .38}s` }} />)}
          </g>}
          {panel.id === 'analytics' && <>
            <ellipse className="v2-phone-data-pulse" cx="1422" cy="451" rx="64" ry="60" fill={url('pulse')} />
            <circle className="v2-phone-orbit" cx="1502" cy="408" r="20" />
          </>}
          {panel.id === 'surface' && <g className="v2-phone-flow-lines v2-phone-surface-lines">
            <path d="M1353 696 L1400 674 L1434 626 L1464 680 L1495 652 L1528 689 L1568 662" />
            <path d="M1353 708 C1415 685 1441 665 1478 695 S1530 689 1567 689" />
          </g>}
        </g>
      </g>)}
      <g className="v2-phone-floating">
        <use href={source} clipPath={url('phone')} />
        <g clipPath={url('screen')}>
          <rect className="v2-phone-screen-scan" x="1018" y="170" width="330" height="95" fill={url('scan')} />
          <path className="v2-phone-screen-wave" d="M1080 405 C1134 448 1160 271 1196 324 S1250 286 1302 300" />
        </g>
      </g>
    </svg>
  </div>
}
