import React from "react";

const Stepper = ({ step, total = 5 }) => (
  <div data-testid="purchase-stepper" className="flex items-center w-full max-w-[940px] mx-auto px-2">
    {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
      <React.Fragment key={n}>
        <div
          data-testid={`purchase-step-${n}`}
          data-active={n === step}
          className={`shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
            n <= step ? "bg-primary text-white" : "bg-primary/35 text-white/70"
          }`}
        >
          {n}
        </div>
        {n < total && (
          <div className="flex-1 h-[3px] mx-1 rounded-full bg-primary/25 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: n < step ? "100%" : "0%" }}
            />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

export default Stepper;
