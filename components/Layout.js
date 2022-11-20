import classNames from 'classnames';
import styles from './Layout.module.css';

export function GradientBackground({ variant, className }) {
  const classes = classNames(
    {
      [styles.colorBackground]: variant === 'large',
      [styles.colorBackgroundBottom]: variant === 'small',
    },
    className
  );

  return <div className={classes} />;
}

export default function Layout({ children }) {
  return (
    <div className="relative pb-24 overflow-hidden text-black">
      <div className="flex flex-col items-center max-w-4xl w-full mx-auto px-10">
        {children}
      </div>
    </div>
  );
}
