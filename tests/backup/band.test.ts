import { describe, expect, it } from "vitest";
import { bluetoothBand, type BandBluetooth } from "../../lib/band";

describe("bluetooth band", () => {
  it("does not invent a service id", async () => {
    const bluetooth: BandBluetooth = {
      requestDevice: async () => {
        throw new Error("should not request a device");
      },
    };
    const source = bluetoothBand(bluetooth, null);
    await expect(source.connect()).rejects.toThrow("not published");
  });

  it("reads bytes from the configured service", async () => {
    const payload = new Uint8Array([4, 5, 6]);
    const bluetooth: BandBluetooth = {
      async requestDevice(options) {
        expect(options.filters).toEqual([{ services: ["0000abcd-0000-1000-8000-00805f9b34fb"] }]);
        return {
          gatt: {
            async connect() {
              return {
                async getPrimaryService() {
                  return {
                    async getCharacteristics() {
                      return [{ async readValue() { return new DataView(payload.buffer); } }];
                    },
                  };
                },
              };
            },
          },
        };
      },
    };
    const source = bluetoothBand(bluetooth, "0000abcd-0000-1000-8000-00805f9b34fb");
    await source.connect();
    expect(Array.from(await source.read())).toEqual([4, 5, 6]);
  });
});
