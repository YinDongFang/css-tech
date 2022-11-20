import { useContext } from 'react';
import { ThemeContext } from '../pages';
import { githubIcon, moonIcon, sunIcon } from './Icons';

const ThemeSwitcher = () => {
  const { setTheme } = useContext(ThemeContext);

  return (
    <div className="flex mt-6 bg-white justify-center dark:bg-gray-900 rounded-3xl p-1">
      <button
        type="button"
        aria-label="Use Dark Mode"
        onClick={() => setTheme('dark')}
        className="flex items-center pr-2 dark:bg-primary rounded-3xl justify-center align-center p-2 w-24 h-10 transition"
      >
        {moonIcon}
      </button>

      <button
        type="button"
        aria-label="Use Light Mode"
        onClick={() => setTheme('light')}
        className="flex items-center pr-2 bg-primary dark:bg-transparent rounded-3xl justify-center align-center p-2 w-24 h-10 transition"
      >
        {sunIcon}
      </button>
    </div>
  );
};

export default function Footer({ copyrightText }) {
  return (
    <footer className="py-16 flex flex-col items-center">
      <div className="dark:text-white mb-3 opacity-60">
        <span>{copyrightText}</span>
        <a
          href="https://github.com/YinDongFang"
          target="_blank"
          rel="noreferrer"
          className="ml-2 dark:text-white text-black"
        >
          {githubIcon}
        </a>
      </div>
      <ThemeSwitcher />
    </footer>
  );
}
