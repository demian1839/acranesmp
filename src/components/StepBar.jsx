import { STEPS } from '../data/windowData'

export default function StepBar({ currentStep, completedSteps, onStepClick }) {
  return (
    <div className="step-bar">
      <div className="step-bar__inner">
        {STEPS.map((step, idx) => {
          const isActive    = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)
          const isDisabled  = step.id > currentStep && !isCompleted

          let cls = 'step-bar__item'
          if (isActive)    cls += ' step-bar__item--active'
          if (isCompleted && !isActive) cls += ' step-bar__item--completed'
          if (isDisabled)  cls += ' step-bar__item--disabled'

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className={cls}
                onClick={() => !isDisabled && onStepClick(step.id)}
                title={step.label}
              >
                <span className="step-bar__num">
                  {isCompleted && !isActive ? '✓' : step.id}
                </span>
                <span>{step.shortLabel}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <span className="step-bar__sep">›</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
