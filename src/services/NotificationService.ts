class NotificationService {
  isPermitted: boolean;

  private constructor() {
    this.isPermitted = false;
  }

  public getPermission() {
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

  public notify(callback: (message) => {}, title:String, message: String): void {
    if (this.isPermitted) {
      const notification = new Notification(message);
      notification.onclick = () => {
        callback(message);
      };
    }
    return;
  }
}

export default NotificationService;
