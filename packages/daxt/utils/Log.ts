export class Log {
  static error(title: string, err: string, obj: object) {
    console.error(title);
    console.info("Instancia: ", obj);
    console.error(err);
  }
}
