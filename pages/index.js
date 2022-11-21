import { getProjectsData } from '../utils/data-utils';
import Footer from '../components/Footer';
import Layout, { GradientBackground } from '../components/Layout';
import { getGlobalData } from '../utils/global-data';
import { Content } from '../components/Content';
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext('light');

export default function Index({ categorys, globalData }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storageTheme = localStorage.getItem('theme');
    setTheme(storageTheme === 'dark' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkQuery.onchange = (e) => setTheme(e.matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout>
        <header className="pt-10 pb-12">
          <p className="text-4xl dark:text-white text-center">
            {globalData.blogTitle}
          </p>
        </header>
        <main className="w-full">
          <Content categorys={categorys} />
        </main>
        <Footer copyrightText={globalData.footerText} />
        <GradientBackground
          variant="large"
          className="fixed top-20 opacity-40 dark:opacity-60"
        />
        <GradientBackground
          variant="small"
          className="fixed bottom-0 opacity-20 dark:opacity-10"
        />
      </Layout>
    </ThemeContext.Provider>
  );
}

export function getStaticProps() {
  const categorys = getProjectsData();
  const globalData = getGlobalData();

  return { props: { categorys, globalData } };
}
