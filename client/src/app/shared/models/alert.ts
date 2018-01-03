export class Alert {
  type: AlertType;
  title: string;
  message: string;
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}
