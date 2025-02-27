class NotificationService {
  static isPermitted: boolean = false;

  private constructor() {}

  public static getPermission() {
    if (!("Notification" in window)) {
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
    if (this.isPermitted) {
      const notification = new Notification(title, { body: message });
      notification.onclick = () => {
        callback?.();
      };
    }
    return;
  }
}

export default NotificationService;
