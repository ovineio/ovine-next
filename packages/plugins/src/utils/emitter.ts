import { useEffect } from 'react';
import { isArray } from 'lodash';
import { EventEmitter } from 'eventemitter3';

type EmitterCallBack = (data: any, key: string) => void;
type Action = string | string[];
const emitterIns = new EventEmitter();

const onEmitter = (items: Array<[Action, EmitterCallBack]>) => {
  if (!isArray(items)) {
    return;
  }

  const bindItems: Array<{ action: string; handle: EmitterCallBack }> = [];
  items.forEach((item: any) => {
    const [action, callback] = item;
    const actions = typeof action === 'string' ? [action] : action;

    actions.forEach((action: string) => {
      const handle = (data: any) => {
        callback(data, action);
      };
      // 默认 全局推送
      emitterIns.on(action, handle);
      // 客户端 推送
      bindItems.push({
        action,
        handle,
      });
    });
  });

  return () => {
    bindItems.forEach((item) => {
      if (item.action) {
        emitterIns.off(item.action, item.handle);
      }
    });
  };
};

/**
 * 绑定单个监听事件
 * @param items
 */
const useOnEmitter = (action: Action, callback: EmitterCallBack) => {
  useEffect(() => {
    return onEmitter([[action, callback]]);
  }, []);
};

/**
 * 同时绑定多个监听事件
 * @param items
 */
const useSomeEmitters = (...items: Array<[Action, EmitterCallBack]>) => {
  useEffect(() => {
    return onEmitter(items);
  }, []);
};

const emitter = Object.assign(emitterIns, {
  useOnEmitter,
  useSomeEmitters,
});

export default emitter;
