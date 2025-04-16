import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { useDebounce } from "use-debounce";

const DebouncedInput = (props: {
  debounceInterval?: number;
  value?: string;
  onChangeText?: (value?: string) => Promise<void>
}) => {
  const [inputValue, setInputValue] = useState(props.value);

  const [debouncedValue] = useDebounce(inputValue, props.debounceInterval || 0);

  useEffect(() => {
    props.debounceInterval && props.onChangeText && props.onChangeText(debouncedValue);
}, [debouncedValue, props.onChangeText]);

  return <TextInput value={inputValue} onChangeText={setInputValue} />;
};

export default DebouncedInput;
