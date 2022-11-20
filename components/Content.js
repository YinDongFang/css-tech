import { Category } from './Category';
import { Slider, ConfigProvider } from 'antd';
import { useContext, useState } from 'react';
import { ThemeContext } from '../pages';
import { getFormattedDate } from '../utils/time';

const start = 1996;
const months = (new Date().getFullYear() - start) * 12 + new Date().getMonth();

export function Content({ categorys }) {
  const { theme } = useContext(ThemeContext);
  const [step, setStep] = useState(0);

  return (
    <ConfigProvider prefixCls={theme === 'dark' ? 'antd-dark' : 'antd-default'}>
      <h1 className='text-xl text-black dark:text-white opacity-70'>Date: {getFormattedDate(start, step)}</h1>
      <Slider
        value={step}
        min={0}
        max={months}
        onChange={setStep}
        tooltip={{ formatter: (v) => getFormattedDate(start, v) }}
      />
      <div className="flex-col items-stretch">
        {categorys.map((category) => (
          <Category key={category.name} {...category} />
        ))}
      </div>
    </ConfigProvider>
  );
}
