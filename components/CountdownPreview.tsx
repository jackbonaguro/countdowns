import { View, Text, TouchableOpacity } from 'react-native';
import { type Countdown } from '@/store/useCountdowns';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format, formatDistance, formatRelative, set, subDays } from 'date-fns'
import { useEffect, useState } from 'react';
import { NumberRoll } from './NumberRoll';
import { Link } from 'expo-router';

type CountdownParams = {
  differenceNumber: number;
  differenceUnitNormalized: string;
  differenceTerm: string;
}

export function CountdownPreviewSkeleton(props: {
  partialCountdown: Partial<Countdown>;
}) {
  return (
    <View 
      style={{
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}
    >
      <View style={{ paddingVertical: 16, alignItems: 'flex-start' }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{''}</Text>
        <Text style={{ color: '#fff', marginTop: 8 }}>{''}</Text>
      </View>
    </View>
  );
}

export default function CountdownPreview({
  countdown,
  index,
}: {
  countdown: Countdown;
  index?: number;
}) {
  const updateCountdown = () => {
    const now = Date.now();
  
    let differenceNumber = differenceInDays(combinedDate, now);
    let differenceUnit = 'day';
  
    if (Math.abs(differenceNumber) < 1) {
      differenceNumber = differenceInHours(combinedDate, now);
      differenceUnit = 'hour';
    }
    if (Math.abs(differenceNumber) < 1) {
      differenceNumber = differenceInMinutes(combinedDate, now);
      differenceUnit = 'minute';
    }
    if (Math.abs(differenceNumber) < 1) {
      differenceNumber = differenceInSeconds(combinedDate, now);
      differenceUnit = 'second';
    }
    const differenceTerm = differenceNumber >= 0 ? 'left' : 'ago';
    const differenceUnitNormalized = Math.abs(differenceNumber) === 1 ? differenceUnit : `${differenceUnit}s`;

    setCountdownParams({
      differenceNumber,
      differenceUnitNormalized,
      differenceTerm,
    });
  }

  const date = countdown.date;
  const time = countdown.time;
  const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time?.getHours() ?? 0, time?.getMinutes() ?? 0);

  const fixedDate = format(combinedDate, 'eee, d MMM yyyy');
  const fixedTime = time ? format(combinedDate, ' h:mm a') : '';

  const hue = countdown.hue;
  const backgroundColor = `hsl(${hue}, 75%, 50%)`;

  useEffect(() => {
    updateCountdown();
    const updateInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(updateInterval);
  }, [countdown.date]);

  const [countdownParams, setCountdownParams] = useState<CountdownParams>();
  
  return (
    <Link href={typeof index !== 'undefined' ? `/editCountdown/${index}` : '/'} asChild disabled={typeof index === 'undefined'}>
      <TouchableOpacity>
        <View 
          style={{
            // padding: 16,
            borderRadius: 8,
            backgroundColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View 
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}
          >
            <View style={{
              padding: 16,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 32 }}>{countdown.emoji}</Text>
            </View>
            <View style={{ paddingVertical: 16, alignItems: 'flex-start' }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{countdown.title}</Text>
              <Text style={{ color: '#fff', marginTop: 8 }}>{fixedDate}{fixedTime}</Text>
              {/* <Text style={{ color: '#fff', marginTop: 8 }}>{JSON.stringify(date)}</Text>
              <Text style={{ color: '#fff', marginTop: 8 }}>{JSON.stringify(time)}</Text>
              <Text style={{ color: '#fff', marginTop: 8 }}>{JSON.stringify(combinedDate)}</Text> */}
            </View>
          </View>
          {countdownParams && <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            width: '25%',
          }}>
            <NumberRoll
              number={Math.abs(countdownParams.differenceNumber)}
              fontSize={24}
              fontWeight="bold"
              color="#fff"
            />
            <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', }}>
              {`${countdownParams.differenceUnitNormalized} ${countdownParams.differenceTerm}`}
            </Text>
          </View>}
        </View>
      </TouchableOpacity>
    </Link>
  );
}
