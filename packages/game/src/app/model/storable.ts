/**
 * Base class to make things storable,
 * In order to use override `toString()` and `fromString()` methods of descendants;
 */
export class Storable extends EventTarget {

  private offFns: CallableFunction[] = [];

  /**
   * updatedAt timestamp
   */
  protected updatedAt: number = 0;

  constructor(protected readonly storageKey: string) {
    super();
    this.subscribeOnStorageUpdate();
  }

  protected subscribeOnStorageUpdate() {
    const handler = () => {
      this.updateFromStorage();
    };
    window.addEventListener('storage', handler);
    this.offFns.push(() => {
      window.removeEventListener('storage', handler);
    });
  }

  /**
   * Method for updating the entity from the storage, should be overridden if need
   */
  public updateFromStorage () {
    Object.assign(this, this.fromString(
      localStorage.getItem(this.storageKey) || 'null'
    ));
    this.dispatchUpdate();
    return this;
  }

  /**
   * Method for saving data to storage.
   */
  public saveToStorage () {
    this.updatedAt = Date.now();
    localStorage.setItem(this.storageKey, this.toString());
    this.dispatchSave();
    return this;
  }

  protected dispatchUpdate() {
    this.dispatchEvent(new Event('update'));
  }

  protected dispatchSave() {
    this.dispatchEvent(new Event('save'));
  }



  protected fromString(stringData: string) {
    let data = {}
    try {
      data = {
        ...JSON.parse(stringData)
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      return data;
    }
  };

  public override toString() {
    const {
      offFns,
      ...props
    } = this;

    return JSON.stringify({props});
  }

  public static persistStateAfterExecution() {
    return (target: Storable, propertyKey: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const result = await method.apply(this, args);
        await (this as Storable).saveToStorage();
        return result;
      }
      return descriptor;
    };
  }
}
