/**
 * 使用できる Module の Action です。
 *
 * Module が common や Local などの寄せ集めになっており、
 * 使用するべき Action を理解するのが困難になったため集約させました。
 */
export * as common from './common/actions';
export { actions as timesheet } from './timesheet';
export * as widgets from './widgets/actions';
