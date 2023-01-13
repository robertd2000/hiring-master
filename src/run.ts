import { IExecutor } from './Executor';
import ITask from './Task';

export default async function run(
  executor: IExecutor,
  queue: AsyncIterable<ITask>,
  maxThreads = 0
) {
  // maxThreads = Math.max(0, maxThreads);
  // const promises = [];
  // const tasks: number[] = [];
  // for await (const q of queue) {
  //   if (!tasks.includes(q.targetId)) {
  //     tasks.push(q.targetId);
  //     promises[q.targetId] = executor.executeTask(q);
  //     // promises.push(executor.executeTask(q));
  //   }
  // }
  if (maxThreads === 0) {
    const promises = [];
    const tasks: number[] = [];
    for await (const q of queue) {
      if (!tasks.includes(q.targetId)) {
        tasks.push(q.targetId);
        promises[q.targetId] = executor.executeTask(q);
        // promises.push(executor.executeTask(q));
      }
    }

    const res = Promise.all(promises);
    console.log(res);

    return res;
  } else {
    const p = [];
    const tasks: number[] = [];

    for await (const q of queue) {
      p.push(executor.executeTask(q));
      if (!tasks.includes(q.targetId)) {
        if (p.length === maxThreads) {
          Promise.all(p);
          p.splice(0, p.length);
        }
      }
    }
  }

  /**
   * Код надо писать сюда
   * Тут что-то вызываем в правильном порядке executor.executeTask для тасков из очереди queue
   */
}
