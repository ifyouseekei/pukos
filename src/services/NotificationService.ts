class NotificationService {
  static isPermitted: boolean = false;
  static notification: Notification | null;

  private constructor() {}

  public static getPermission() {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      this.isPermitted = true;
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.isPermitted = true;
        }
      });
    }
  }

  public static close() {
    this.notification?.close();
  }

  public static notify({
    callback,
    message,
    title,
  }: {
    callback?: () => void;
    message: string;
    title: string;
  }): void {
    this.getPermission();
    if (!this.isPermitted) {
      return;
    }
    // make sure to close the previous notification if it has one
    if (this.notification) {
      this.notification.close();
    }

    this.notification = new Notification(title, { body: message });
    this.notification.onclick = () => {
      callback?.();
      this.notification?.close();
    };
  }
}

export default NotificationService;
