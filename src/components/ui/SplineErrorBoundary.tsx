import React from 'react'

type Props = { children: React.ReactNode }

type State = { hasError: boolean }

export default class SplineErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console for now
    // In production we could report this to telemetry
    // eslint-disable-next-line no-console
    console.error('Spline render error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#050505]">
          <div className="text-center text-gray-400">
            <div className="mb-4">3D preview unavailable</div>
            <div className="text-sm">Try reloading the page or check the console</div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
