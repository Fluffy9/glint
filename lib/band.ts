export type BandSource = {
  connect(): Promise<void>;
  read(): Promise<Uint8Array>;
};

export function fixtureBand(bytes: Uint8Array): BandSource {
  let connected = false;
  return {
    async connect() {
      connected = true;
    },
    async read() {
      if (!connected) throw new Error("band is not connected");
      return bytes;
    },
  };
}

type BandCharacteristic = { readValue(): Promise<DataView> };
type BandService = { getCharacteristics(): Promise<BandCharacteristic[]> };
type BandServer = { getPrimaryService(serviceId: string): Promise<BandService> };
type BandDevice = { gatt?: { connect(): Promise<BandServer> } };

export type BandBluetooth = {
  requestDevice(options: { filters: { services: string[] }[] }): Promise<BandDevice>;
};

export function bluetoothBand(bluetooth: BandBluetooth | null, serviceId: string | null): BandSource {
  let device: BandDevice | null = null;
  return {
    async connect() {
      if (!serviceId) throw new Error("The band service is not published yet.");
      if (!bluetooth) throw new Error("This browser cannot connect to the band.");
      device = await bluetooth.requestDevice({ filters: [{ services: [serviceId] }] });
      if (!device.gatt) throw new Error("The band did not connect.");
      await device.gatt.connect();
    },
    async read() {
      if (!serviceId || !device?.gatt) throw new Error("The band is not connected.");
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceId);
      const characteristics = await service.getCharacteristics();
      const value = await characteristics[0]?.readValue();
      if (!value) throw new Error("The band did not return bytes.");
      return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
    },
  };
}

export function browserBand(serviceId: string | null): BandSource {
  const bluetooth =
    typeof navigator === "undefined"
      ? null
      : ((navigator as Navigator & { bluetooth?: BandBluetooth }).bluetooth ?? null);
  return bluetoothBand(bluetooth, serviceId);
}
