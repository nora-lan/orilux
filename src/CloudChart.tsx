import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

type CloudChartProps = {
  mode: 'latency' | 'throughput'
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

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
export const cloudMetrics = {
  latency: { value: average(samples.latency.current).toFixed(0), unit: ' ms' },
  throughput: { value: (average(samples.throughput.current) / 1000).toFixed(2), unit: ' k / s' },
}

export default function CloudChart({ mode }: CloudChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chart = echarts.init(container, undefined, { renderer: 'canvas' })
    const sample = samples[mode]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    chart.setOption({
      animation: !reducedMotion,
      animationDuration: 450,
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
        axisPointer: { type: 'line', lineStyle: { color: '#d8e2f6', type: 'dashed' } },
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
        max: sample.maximum,
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
          name: '曜境云（演示）',
          type: 'line',
          data: sample.current,
          smooth: 0.4,
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 7,
          lineStyle: { width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(40, 100, 255, 0.12)' },
              { offset: 1, color: 'rgba(40, 100, 255, 0)' },
            ]),
          },
        },
        {
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

    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.dispose()
    }
  }, [mode])

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`近 24 小时${samples[mode].title}趋势，曜境云与参考配置对比。所有数值均为演示数据，不代表实测性能。`}
      style={{ height: 230, width: '100%', minWidth: 0 }}
    />
  )
}
