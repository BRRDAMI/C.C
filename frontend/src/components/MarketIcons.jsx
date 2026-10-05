import React from "react";

// Market tab icons (user-provided). Black backgrounds are dropped via
// mix-blend-lighten so they sit cleanly on the dark sidebar, matching adurite.com.

const Icon = ({ src, size }) => (
  <img
    src={src}
    alt=""
    style={{ width: size, height: size }}
    className="object-contain mix-blend-lighten select-none pointer-events-none"
    draggable={false}
  />
);

export const LimitedsIcon = ({ size = 28 }) => <Icon src="/market/limiteds.jpg" size={size} />;
export const ToyCodesIcon = ({ size = 28 }) => <Icon src="/market/toycodes.jpg" size={size} />;
export const Cs2Icon = ({ size = 28 }) => <Icon src="/market/cs2.jpg" size={size} />;
export const RustIcon = ({ size = 28 }) => <Icon src="/market/rust.jpg" size={size} />;

export const marketIcons = {
  limiteds: LimitedsIcon,
  toycodes: ToyCodesIcon,
  cs2: Cs2Icon,
  rust: RustIcon,
};
