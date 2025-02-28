import { Modal, Switch, Text, View } from "react-native";
import styled from "styled-components/native";
import DatePicker from 'react-native-date-picker'
import { useEffect, useState } from "react";
import { formatDate } from "date-fns";
import Button from "./Button";
import CountdownPreview, { CountdownPreviewSkeleton } from "./CountdownPreview";
import EmojiInput from "./EmojiInput";
import { Countdown } from "@/store/useCountdowns";
import HuePicker from "./HuePicker";

const Form = styled.View`
  gap: 8px;
  padding-vertical: 16px;
`;
const FormLabel = styled.Text`
  font-size: 14px;
`;
const FormInput = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  border-radius: 4px;
  padding: 8px;
`;

export default function CountdownEditor(props: {
  initialCountdown?: Omit<Countdown, 'id'>;
  onValidate: (countdown: Omit<Countdown, 'id'>, valid: boolean) => void;
}) {
  const [title, setTitle] = useState<string | undefined>(props.initialCountdown?.title);

  const [date, setDate] = useState<Date | undefined>(props.initialCountdown?.date);
  const [showDate, setShowDate] = useState(false);
  const dateLabel = !!date ? formatDate(date, 'MMM d, yyyy') : 'Select Date';

  const [time, setTime] = useState<Date | undefined>(props.initialCountdown?.time);
  const [showTime, setShowTime] = useState(false);
  const timeLabel = !!time ? formatDate(time, 'h:mm a') : 'All Day';

  const [emoji, setEmoji] = useState<string | undefined>(props.initialCountdown?.emoji);
  const [showEmoji, setShowEmoji] = useState(false);

  const [hue, setHue] = useState<number | undefined>(props.initialCountdown?.hue);


  const previewReady = !!title && !!date && !!emoji && typeof hue !== 'undefined';

  useEffect(() => {
    props.onValidate({
      title: title ?? '',
      date: date ?? new Date(),
      time,
      emoji: emoji ?? '',
      hue: hue ?? 0,
    }, previewReady);
  }, [previewReady, title, date, time, emoji, hue]);

  return (
    <Form>
      <FormLabel>Name</FormLabel>
      <FormInput value={title} onChangeText={setTitle} />

      <FormLabel>Date</FormLabel>
      <Button title={dateLabel} onPress={() => setShowDate(true)} />
      <DatePicker
        modal
        mode="date"
        open={showDate}
        date={date ?? new Date()}
        onConfirm={(date: Date) => {
          setDate(date);
          setShowDate(false);
        }}
        onCancel={() => setShowDate(false)}
      />

      <FormLabel>Time</FormLabel>
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <Button title={timeLabel} onPress={() => setShowTime(true)} />
        {!!time && <Button title='Clear' onPress={() => {
          setTime(undefined);
          setShowTime(false);
        }} />}
      </View>
      <DatePicker
        modal
        mode="time"
        open={showTime}
        date={time ?? new Date()}
        onConfirm={(date: Date) => {
          setTime(date);
          setShowTime(false);
        }}
        onCancel={() => setShowTime(false)}
      />

      <FormLabel>Emoji</FormLabel>
      <Button title={emoji ?? 'Select'} onPress={() => setShowEmoji(true)} />
      {showEmoji && (
        <Modal
          visible={showEmoji}
          onRequestClose={() => setShowEmoji(false)}
          // transparent
          animationType="slide"
        >
          <EmojiInput onEmojiSelected={(emoji) => {
            setEmoji(emoji);
            setShowEmoji(false);
          }} onCancel={() => {
            setShowEmoji(false);
          }} />
        </Modal>
      )}

      <FormLabel>Hue</FormLabel>
      <HuePicker hue={hue} onHueChange={setHue} />

      <FormLabel>Preview</FormLabel>
      {previewReady && <CountdownPreview countdown={{
        title,
        date,
        time,
        emoji,
        hue,
      }} />}
      {!previewReady && <CountdownPreviewSkeleton partialCountdown={{}} />}
    </Form>
  )
}
