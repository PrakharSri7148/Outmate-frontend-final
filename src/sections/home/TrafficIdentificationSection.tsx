import { motion } from 'framer-motion'
import { SplineSceneFixed } from '../../components/ui/SplineScene'
import SplineErrorBoundary from '../../components/ui/SplineErrorBoundary'

const headlineLines = ['IDENTIFY', '70–80%', 'OF YOUR', 'WEBSITE', 'TRAFFIC']

const intelligenceCards = [
	{
		label: 'Anonymous visitors',
		description: 'Resolve hidden account-level traffic before it disappears into the bounce.',
	},
	{
		label: 'Behavioral signals',
		description: 'Read page paths, visit depth, and intent clusters as they happen.',
	},
	{
		label: 'Intent data',
		description: 'Surface high-value buying moments the second they start to form.',
	},
	{
		label: 'Identity resolution',
		description: 'Turn raw visitor activity into identified pipeline your team can act on.',
	},
]

function TrafficSplineVisual() {
	return (
		<div className="relative h-full w-full">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.08) 0%, rgba(124,58,237,0.06) 22%, transparent 55%), radial-gradient(circle at 50% 50%, rgba(59,130,246,0.03) 0%, transparent 60%)',
					filter: 'blur(18px)',
				}}
			/>

			<div className="relative h-full w-full drop-shadow-[0_0_50px_rgba(255,255,255,0.08)]">
				<SplineErrorBoundary>
					<SplineSceneFixed scene="https://prod.spline.design/CqvzfgH6e0SrfRMz/scene.splinecode" className="h-full w-full" autoReplayMs={18000} />
				</SplineErrorBoundary>
			</div>
		</div>
	)
}

export default function TrafficIdentificationSection() {
	return (
		<section
			className="relative overflow-hidden"
			style={{ background: 'rgba(0, 0, 0, 0.32)' }}
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						'radial-gradient(ellipse 110% 70% at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 90% 70% at 10% 50%, rgba(124,58,237,0.05) 0%, transparent 55%)',
				}}
			/>

			<div className="relative mx-auto max-w-[1600px] px-8 py-28 md:px-12 md:py-32 lg:px-16 lg:py-36">
				<div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
					<motion.div
						initial={{ opacity: 0, scale: 0.97 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
						className="flex min-h-[440px] items-center justify-center sm:min-h-[560px] lg:min-h-[760px]"
					>
						<div className="h-[clamp(440px,58vw,780px)] w-full max-w-[920px] lg:h-[760px]">
							<TrafficSplineVisual />
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 26 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.25 }}
						transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
						className="max-w-[820px]"
					>
						<p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30 md:text-xs">
							Visitor intelligence
						</p>

						<div className="mt-7 flex w-fit flex-col gap-0">
							{headlineLines.map((line, index) => (
								<motion.h2
									key={line}
									initial={{ opacity: 0, y: 34, filter: 'blur(6px)' }}
									whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
									className="font-display font-black leading-[0.88] tracking-[-0.07em] text-white"
									style={{ fontSize: 'clamp(3rem, 6.4vw, 7rem)' }}
								>
									{line}
								</motion.h2>
							))}
						</div>

						<motion.p
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
							className="mt-8 max-w-[700px] text-[16px] leading-[1.75] text-white/58 md:text-[17px]"
						>
							Identify the anonymous majority of your traffic, read behavioral signals in real time, and turn intent
							into pipeline before the visit goes cold.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.25 }}
							transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.52 }}
							className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2"
						>
							{intelligenceCards.map((card, index) => (
								<motion.div
									key={card.label}
									initial={{ opacity: 0, y: 14 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 * index }}
									className="rounded-[22px] border border-white/8 bg-white/[0.025] px-5 py-4"
								>
									<div className="text-[14px] font-semibold tracking-[-0.02em] text-white">
										{card.label}
									</div>
									<p className="mt-2 max-w-[26ch] text-[13px] leading-[1.6] text-white/48 md:text-[14px]">
										{card.description}
									</p>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
