import { FC, useEffect, useState } from 'react';

interface CountDownProps {
  seconds?: number;
  onEnd: (time: number) => void;
}

const CountDown: FC<CountDownProps> = ({ seconds, onEnd }) => {
  const [time, setTime] = useState(seconds || 60);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(time => {
        if (time === 1) {
          onEnd && onEnd(time);
          clearInterval(id);
        }
        return time - 1;
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [seconds, onEnd]);
  return <span>{time}秒后重新获取</span>;
};

export default CountDown;
