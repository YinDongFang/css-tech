import { Category } from './Category';
import { Slider, ConfigProvider } from 'antd';
import { useContext, useState } from 'react';
import { ThemeContext } from '../pages';
import { format, before } from '../utils/time';

const start = 2010;
const months = (new Date().getFullYear() - start) * 12 + new Date().getMonth();

export function Content({ categorys }) {
  const { theme } = useContext(ThemeContext);
  const [step, setStep] = useState(0);

  const formatted = format(start, step);

  const filterredCategory = categorys
    .map(category => {
      return {
        ...category,
        projects: category.projects?.filter(project => before(project.create, formatted))
      }
    })
    .filter(category => {
      if (category.time) {
        return before(category.time, formatted);
      } else {
        return category.projects?.length;
      }
    });

  return (
    <ConfigProvider prefixCls={theme === 'dark' ? 'antd-dark' : 'antd-default'}>
      <h1 className='text-xl text-black dark:text-white opacity-70'>Date: {formatted}</h1>
      <Slider
        value={step}
        min={0}
        max={months}
        onChange={setStep}
        tooltip={{ formatter: (v) => format(start, v) }}
      />
      <div className="flex-col items-stretch">
        {filterredCategory.map((category) => (
          <Category key={category.name} {...category} />
        ))}
      </div>
    </ConfigProvider>
  );
}
