import { Ref, ref, unref } from "vue";
import { isString } from "../helper";

export interface DataSwitchOption {
  /**
   * 数据数组
   */
  dataArray: string[];
  /**
   * 切换间隔时间，单位：毫秒
   */
  timeout?: number;
  /**
   * 是否随机切换数据
   */
  shuffle?: boolean;
  /**
   * 切换数据之前执行的回调函数
   */
  onBeforeUpdate?: (newValue: string) => void;
  /**
   * 自定义切换逻辑
   */
  onUpdate?: (data: Ref<string>, newValue: string) => void;
  /**
   * 切换数据之后执行的回调函数
   */
  onAfterUpdate?: (newValue: string) => void;
}

/**
 * 从数据列表里按顺序/随机获取一笔数据
 *
 * @param dataArray 数据列表
 * @param options 选项
 */
export const useSwitchData = (
  dataArray: string[],
  { timeout = 4000, shuffle = false, onBeforeUpdate, onUpdate, onAfterUpdate }: DataSwitchOption
) => {
  const data = ref(dataArray[0]);
  const index = ref(-1);
  let timer: NodeJS.Timeout;

  const startTimer = () => {
    if (timer) clearTimeout(timer);
    if (timeout > 0) {
      timer = setTimeout(() => {
        startAutoSwitch();
      }, timeout);
    }
  };

  /**
   * 开启自动切换数据
   */
  const startAutoSwitch = () => {
    if (dataArray.length < 1) return;
    if (isString(dataArray)) return (data.value = dataArray);
    if (dataArray.length === 1) return (data.value = dataArray[0]);
    // 启动定时器
    startTimer();

    let newValue: string;

    if (shuffle) {
      // 随机选择一个不同的值
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * dataArray.length);
      } while (newIndex === unref(index)); // 确保随机切换时，不会切换到相同的数据

      index.value = newIndex;
      newValue = dataArray[newIndex];
    } else {
      // 按顺序选择下一个值
      index.value = (unref(index) + 1) % dataArray.length;
      newValue = dataArray[unref(index)];
    }

    if (newValue === unref(data)) return;

    onBeforeUpdate?.(newValue);

    if (onUpdate) return onUpdate(data, newValue);

    data.value = newValue;
    onAfterUpdate?.(newValue);
  };

  /**
   * 关闭自动切换数据
   */
  const stopAutoSwitch = () => {
    if (timer) clearTimeout(timer);
  };

  return { data, index, startAutoSwitch, stopAutoSwitch };
};
