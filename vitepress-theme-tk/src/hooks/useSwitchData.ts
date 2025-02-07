import { Ref, ref, unref } from "vue";
import { isString } from "../helper";

export interface DataSwitchOption {
  dataArray: string[];
  timeout?: number;
  onBeforeUpdate?: (newValue: string) => void;
  onUpdate?: (data: Ref<string>, newValue: string) => void;
  onAfterUpdate?: (newValue: string) => void;
}

export const useSwitchData = ({
  dataArray,
  timeout = 4000,
  onBeforeUpdate,
  onUpdate,
  onAfterUpdate,
}: DataSwitchOption) => {
  const data = ref("");
  const index = ref(-1);
  let timer: NodeJS.Timeout;

  const startTimer = () => {
    if (timer) clearTimeout(timer);
    if (timeout > 0) {
      timer = setTimeout(() => {
        switchData();
      }, timeout);
    }
  };

  const switchData = () => {
    if (dataArray.length < 1) return;
    if (isString(dataArray)) return (data.value = dataArray);
    if (dataArray.length === 1) return (data.value = dataArray[0]);
    // 启动定时器
    startTimer();

    index.value = (unref(index) + 1) % dataArray.length;
    const newValue = dataArray[unref(index)];

    if (newValue === unref(data)) return;

    onBeforeUpdate?.(newValue);

    if (onUpdate) return onUpdate(data, newValue);

    data.value = newValue;
    onAfterUpdate?.(newValue);
  };

  return { data, index, switchData };
};
