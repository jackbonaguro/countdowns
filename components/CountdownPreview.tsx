import { View, Text, TouchableOpacity, TouchableNativeFeedback, Platform, TouchableHighlight } from 'react-native';
import { getCountdownDatetime, type Countdown } from '@/hooks/useCountdowns';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format, formatDistance, formatRelative, set, subDays } from 'date-fns'
import { useEffect, useState } from 'react';
import { NumberRoll } from './NumberRoll';
import { Link } from 'expo-router';
import { styles } from '@/styles';

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

const TouchableComponent = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

export default function CountdownPreview({
  countdown,
  id,
}: {
  countdown: Omit<Countdown, 'id'>;
  id?: number;
}) {
  const updateCountdown = () => {
    const now = Date.now();
  
    let differenceNumber = differenceInDays(datetime, now);
    let differenceUnit = 'day';
  
    if (Math.abs(differenceNumber) < 1) {
      differenceNumber = differenceInHours(datetime, now);
      differenceUnit = 'hour';
    }
    if (Math.abs(differenceNumber) < 1) {
      differenceNumber = differenceInMinutes(datetime, now);
      differenceUnit = 'minute';
    }
    if (Math.abs(differenceNumber) < 1) {
      differenceNumber = differenceInSeconds(datetime, now);
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

  const time = countdown.time;
  const datetime = getCountdownDatetime(countdown);
  const fixedDate = format(datetime, 'eee, d MMM yyyy');
  const fixedTime = time ? format(datetime, ' h:mm a') : '';

  useEffect(() => {
    updateCountdown();
    const updateInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(updateInterval);
  }, [countdown.date, countdown.time]);

  const [countdownParams, setCountdownParams] = useState<CountdownParams>();
  
  return (
    <Link href={typeof id !== 'undefined' ? `/editCountdown/${id}` : '/'} asChild disabled={typeof id === 'undefined'}>
      <TouchableComponent>
        <View
          style={{
            borderRadius: 8,
            backgroundColor: countdown.color,
            flexDirection: 'row',
            justifyContent: 'space-between',
            ...styles.shadow,
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
      </TouchableComponent>
    </Link>
  );
}
