import React from "react";

type Props = {
  createdDate: string;
  expiredDate: string;
};

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

const PaymentCountdownTimer = ({ expiredDate, createdDate }: Props) => {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const convertDate = React.useMemo(
    () => (date: string) => {
      const year = date.substring(0, 4);
      const month = date.substring(4, 6);
      const day = date.substring(6, 8);
      const hour = date.substring(8, 10);
      const minute = date.substring(10, 12);
      const second = date.substring(12, 14);
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    },
    []
  );
  const expirationDate = convertDate(expiredDate);
  const creationDate = convertDate(createdDate);

  let difference = expirationDate.getTime() - creationDate.getTime();

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      if (difference > 0) {
        const timeLeft = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
        setTimeLeft(timeLeft);
        difference -= 1000;
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    };

    timerRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [expiredDate, createdDate]);

  return (
    <div className="w-full bg-orange-200 text-orange-500  py-6 px-4">
      Complete payment in {timeLeft.hours} hours : {timeLeft.minutes} minutes :{" "}
      {timeLeft.seconds} seconds
    </div>
  );
};

export default PaymentCountdownTimer;
