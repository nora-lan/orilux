import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

type CloudMode = 'latency' | 'throughput'
type CloudChartProps = {
  mode: CloudMode
  load?: number
  tour?: boolean
  reducedMotion?: boolean
}

const samples = {
  latency: {
    unit: 'ms',
    title: '请求延迟',
    current: [16, 15, 16, 13, 12, 14, 12],
    reference: [32, 30, 35, 31, 33, 30, 32],
    maximum: 40,
  },
  throughput: {
    unit: 'req/s',
    title: '请求吞吐量',
    current: [1500, 1750, 1680, 2200, 2500, 2350, 2800],
    reference: [1000, 1100, 1050, 1300, 1450, 1380, 1600],
    maximum: 3200,
  },
}

const clampLoad = (load: number) => Number.isFinite(load) ? Math.min(3, Math.max(1, load)) : 1
const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length

function getSample(mode: CloudMode, load: number) {
  const multiplier = clampLoad(load)
  const base = samples[mode]
  const latency = mode === 'latency'
  const currentFactor = latency ? 1 + (multiplier - 1) * 0.3 : multiplier
  const referenceFactor = latency ? 1 + (multiplier - 1) * 0.65 : multiplier
  const round = (value: number) => latency ? Math.round(value * 10) / 10 : Math.round(value)
  return {
    ...base,
    current: base.current.map(value => round(value * currentFactor)),
    reference: base.reference.map(value => round(value * referenceFactor)),
  }
}

/** The headline metrics and the plotted series share the same simulated samples. */
export function getCloudMetrics(mode: CloudMode, load = 1) {
  const mean = average(getSample(mode, load).current)
  return mode === 'latency'
    ? { value: mean.toFixed(1).replace(/\.0$/, ''), unit: ' ms' }
    : { value: (mean / 1000).toFixed(2), unit: ' k / s' }
}

export const cloudMetrics = {
  latency: getCloudMetrics('latency'),
  throughput: getCloudMetrics('throughput'),
}

export default function CloudChart({ mode, load = 1, tour = false, reducedMotion = false }: CloudChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<echarts.EChartsType | null>(null)
  const [systemReducedMotion, setSystemReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const reduce = reducedMotion || systemReducedMotion
  const effectiveLoad = clampLoad(load)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setSystemReducedMotion(preference.matches)
    preference.addEventListener('change', onChange)
    return () => preference.removeEventListener('change', onChange)
  }, [])

  // Mount the canvas once. Mode and load changes update the existing series below.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const chart = echarts.init(container, undefined, { renderer: 'canvas' })
    chartRef.current = chart
    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(container)
    return () => {
      observer.disconnect()
      chartRef.current = null
      chart.dispose()
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    const sample = getSample(mode, effectiveLoad)
    const axisStep = mode === 'latency' ? 20 : 1000
    const maximum = Math.max(sample.maximum, Math.ceil(Math.max(...sample.current, ...sample.reference) * 1.12 / axisStep) * axisStep)

    chart.dispatchAction({ type: 'hideTip' })
    chart.dispatchAction({ type: 'downplay' })
    chart.setOption({
      animation: !reduce,
      animationDuration: 650,
      animationDurationUpdate: reduce ? 0 : 650,
      animationEasingUpdate: 'cubicOut',
      color: ['#2864ff', '#b8c2d5'],
      textStyle: { fontFamily: 'Inter, "Microsoft YaHei", sans-serif' },
      grid: { left: 48, right: 18, top: 24, bottom: 28 },
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: '#ffffff',
        borderColor: '#e5eaf4',
        padding: [10, 14],
        textStyle: { color: '#27334c', fontSize: 12 },
        extraCssText: 'box-shadow: 0 8px 28px rgba(28, 57, 105, 0.09); border-radius: 8px;',
        axisPointer: { type: 'line', lineStyle: { color: '#c6d8fa', type: 'dashed' } },
        valueFormatter: (value: number) => `${value.toLocaleString()} ${sample.unit}`,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#8a96aa', fontSize: 10, margin: 12, hideOverlap: true },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: maximum,
        splitNumber: 4,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#8a96aa',
          fontSize: 10,
          formatter: (value: number) => mode === 'throughput' && value >= 1000 ? `${value / 1000}k` : String(value),
        },
        splitLine: { lineStyle: { color: '#eaf0f8', type: 'dashed' } },
      },
      series: [
        {
          id: 'yaojing-simulation',
          name: '曜境云（演示）',
          type: 'line',
          data: sample.current,
          smooth: 0.4,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 3 },
          emphasis: { focus: 'series', scale: 1.4 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(40, 100, 255, 0.14)' },
              { offset: 1, color: 'rgba(40, 100, 255, 0)' },
            ]),
          },
        },
        {
          id: 'reference-simulation',
          name: '参考配置（演示）',
          type: 'line',
          data: sample.reference,
          smooth: 0.4,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, type: 'dashed' },
        },
      ],
    })
  }, [mode, effectiveLoad, reduce])

  useEffect(() => {
    const container = containerRef.current
    const chart = chartRef.current
    if (!container || !chart || !tour || reduce) return

    let interval: ReturnType<typeof setInterval> | undefined
    let inView = false
    let hovered = container.matches(':hover')
    let nextIndex = 0
    const stop = () => {
      if (interval !== undefined) clearInterval(interval)
      interval = undefined
    }
    const clearHighlight = () => {
      if (chart.isDisposed()) return
      chart.dispatchAction({ type: 'hideTip' })
      chart.dispatchAction({ type: 'downplay' })
    }
    const showNext = () => {
      if (chart.isDisposed()) return
      chart.dispatchAction({ type: 'downplay' })
      chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: nextIndex })
      chart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: nextIndex })
      nextIndex = (nextIndex + 1) % samples[mode].current.length
    }
    const sync = () => {
      if (!inView || document.hidden || hovered) {
        stop()
        if (!hovered) clearHighlight()
        return
      }
      if (interval === undefined) {
        showNext()
        interval = setInterval(showNext, 2000)
      }
    }
    const onEnter = () => { hovered = true; stop(); clearHighlight() }
    const onLeave = () => { hovered = false; sync() }
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.2)
      sync()
    }, { threshold: [0, 0.2] })

    observer.observe(container)
    document.addEventListener('visibilitychange', sync)
    container.addEventListener('pointerenter', onEnter)
    container.addEventListener('pointerleave', onLeave)
    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      container.removeEventListener('pointerenter', onEnter)
      container.removeEventListener('pointerleave', onLeave)
      clearHighlight()
    }
  }, [tour, reduce, mode, effectiveLoad])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`近 24 小时${samples[mode].title}趋势，模拟负载 ${effectiveLoad} 倍，曜境云与参考配置对比。所有数值均为演示数据，不代表实测性能。`}
      style={{ height: 230, width: '100%', minWidth: 0 }}
    />
  )
}
