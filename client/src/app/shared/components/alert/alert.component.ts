import {Component} from '@angular/core';
import {Alert, AlertType} from "../../models/alert";
import {AlertService} from "../../services/alert.service";


@Component({
  moduleId: module.id,
  selector: 'alert',
  templateUrl: 'alert.component.html'
})

export class AlertComponent {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }

      // add alert to array
      this.alerts.push(alert);
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }
    // TODO some banner classes are not yet implemented in Visual Framework 2.0
    // Use phase class for all now
    return 'vf-banner--phase ';
    return '.vf-u-background-color--green--lightest';

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'vf-banner--success';
      case AlertType.Error:
        return 'vf-banner--alert';
      case AlertType.Info:
        return 'vf-banner--notice';
      case AlertType.Warning:
        return 'vf-banner--warning warning';
    }
  }
}
