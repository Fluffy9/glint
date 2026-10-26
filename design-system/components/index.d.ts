import type * as React from 'react';

export type IconName = 'search' | 'close' | 'check' | 'heart' | 'user' | 'sync' | 'moon' | 'bolt' | 'info' | 'warning';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  icon?: IconName;
  /** Wrap a string label in [ brackets ] (marketing and onboarding). */
  brackets?: boolean;
  /** Accessible name for icon-only buttons. */
  label?: string;
  /** Force a visual state for documentation. */
  state?: 'hover' | 'active';
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconName;
  help?: string;
  error?: string;
}
export declare function Input(props: InputProps): React.ReactElement;

export interface ChipProps {
  variant?: 'outline' | 'soft';
  selected?: boolean;
  onClick?: () => void;
  /** Shows a remove (×) button. */
  onRemove?: () => void;
  children?: React.ReactNode;
}
export declare function Chip(props: ChipProps): React.ReactElement;

export interface TabsProps {
  items: { id: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  brackets?: boolean;
  label?: string;
}
export declare function Tabs(props: TabsProps): React.ReactElement;

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  /** Accent-filled title bar for the card the screen is about. */
  accent?: boolean;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  elevation?: 2 | 3;
}
export declare function Card(props: CardProps): React.ReactElement;

export interface AlertProps {
  tone?: 'warning' | 'danger' | 'info' | 'success';
  title?: string;
  barTitle?: string;
  actions?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}
export declare function Alert(props: AlertProps): React.ReactElement;

export interface ToggleProps { label?: React.ReactNode; checked?: boolean; defaultChecked?: boolean; disabled?: boolean; onChange?: (checked: boolean) => void }
export declare function Toggle(props: ToggleProps): React.ReactElement;

export interface CheckboxProps { label?: React.ReactNode; checked?: boolean; defaultChecked?: boolean; disabled?: boolean; onChange?: (checked: boolean) => void }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;

export interface RadioListProps { legend?: string; items: { id: string; label: React.ReactNode }[]; value?: string; defaultValue?: string; onChange?: (id: string) => void }
export declare function RadioList(props: RadioListProps): React.ReactElement;

export interface SliderProps { label?: string; min?: number; max?: number; step?: number; value?: number; defaultValue?: number; onChange?: (v: number) => void; format?: (v: number) => string }
export declare function Slider(props: SliderProps): React.ReactElement;

export interface ProgressRingProps { value: number; display?: string; label?: string; size?: number; thickness?: number; ariaLabel?: string }
export declare function ProgressRing(props: ProgressRingProps): React.ReactElement;

export interface StatProps { label: string; value: React.ReactNode; unit?: string; delta?: string; trend?: 'up' | 'down' }
export declare function Stat(props: StatProps): React.ReactElement;

export interface SparkleProps { size?: number; color?: string; outlined?: boolean; title?: string }
export declare function Sparkle(props: SparkleProps): React.ReactElement;

export interface IconProps { name: IconName; size?: number; color?: string; label?: string }
export declare function Icon(props: IconProps): React.ReactElement;

export interface WarpCheckProps { cols?: number; rows?: number; cell?: number; amp?: number; seed?: number; stars?: boolean; width?: number | string; height?: number | string }
export declare function WarpCheck(props: WarpCheckProps): React.ReactElement;

export interface TwinkleProps { size?: number; color?: string; duration?: number; delay?: number; loop?: number; play?: unknown; autoplay?: boolean; restAt?: number; pixel?: 0 | 16 | 24 | 32 | number; className?: string; style?: React.CSSProperties }
export declare function Twinkle(props: TwinkleProps): React.ReactElement;

export interface GlintFxProps { children: React.ReactNode; trigger?: 'mount' | 'hover'; loop?: number; play?: unknown; corner?: 'tr' | 'tl' | 'br' | 'bl'; sparkleSize?: number; sparkDelay?: number; pixel?: number; color?: string; sheen?: string; radius?: string | number; className?: string; style?: React.CSSProperties }
export declare function GlintFx(props: GlintFxProps): React.ReactElement;

export interface CheckerWipeProps { play: number; onCovered?: () => void; cell?: number; stagger?: number; color?: string; glint?: boolean; className?: string }
export declare function CheckerWipe(props: CheckerWipeProps): React.ReactElement;

declare global {
  interface Window {
    Glint: {
      Button: typeof Button; Input: typeof Input; Chip: typeof Chip; Tabs: typeof Tabs; Card: typeof Card; Alert: typeof Alert;
      Toggle: typeof Toggle; Checkbox: typeof Checkbox; RadioList: typeof RadioList; Slider: typeof Slider;
      ProgressRing: typeof ProgressRing; Stat: typeof Stat; Sparkle: typeof Sparkle; Icon: typeof Icon; WarpCheck: typeof WarpCheck;
      Twinkle: typeof Twinkle; GlintFx: typeof GlintFx; CheckerWipe: typeof CheckerWipe;
      SPARKLE_PATH: string;
    };
  }
}
