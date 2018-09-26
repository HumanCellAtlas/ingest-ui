export class Alert {
  type: AlertType;
  title: string;
  message: string;
  dismissible: boolean;
}

export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}
