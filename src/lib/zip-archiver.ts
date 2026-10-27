import zlib from "node:zlib";

function makeCrc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
}

const CRC32_TABLE = makeCrc32Table();

function calculateCrc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipEntry {
  path: string; // Zip içi dosya yolu, örn: "uploads/products/image.webp" veya "database.sql"
  data: Buffer;
}

/**
 * Sıfır harici kütüphane bağımlılığıyla standart, sıkıştırılmış (Deflate) PKZIP .zip arşivi üretir.
 * Windows Explorer, macOS Archive Utility ve Linux unzip tarafından doğrudan açılabilir.
 */
export function createZipArchive(entries: ZipEntry[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let currentOffset = 0;

  for (const entry of entries) {
    const cleanPath = entry.path.replace(/\\/g, "/").replace(/^\/+/, "");
    const nameBuf = Buffer.from(cleanPath, "utf-8");
    const uncompressedSize = entry.data.length;
    const crc = calculateCrc32(entry.data);
    const compressedData = zlib.deflateRawSync(entry.data, { level: 6 });
    const compressedSize = compressedData.length;

    // 1. Local File Header (30 bayt + dosya adı + veri)
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // İmza
    localHeader.writeUInt16LE(20, 4); // Sürüm (Deflate uyumlu)
    localHeader.writeUInt16LE(0x0800, 6); // UTF-8 bayrağı
    localHeader.writeUInt16LE(8, 8); // Sıkıştırma metodu: Deflate (8)
    localHeader.writeUInt16LE(0, 10); // Saat
    localHeader.writeUInt16LE(0, 12); // Tarih
    localHeader.writeUInt32LE(crc, 14); // CRC-32
    localHeader.writeUInt32LE(compressedSize, 18); // Sıkıştırılmış boyut
    localHeader.writeUInt32LE(uncompressedSize, 22); // Orijinal boyut
    localHeader.writeUInt16LE(nameBuf.length, 26); // Dosya adı uzunluğu
    localHeader.writeUInt16LE(0, 28); // Ekstra alan uzunluğu

    const localChunk = Buffer.concat([localHeader, nameBuf, compressedData]);
    localHeaders.push(localChunk);

    // 2. Central Directory Header (46 bayt + dosya adı)
    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0); // İmza
    centralHeader.writeUInt16LE(20, 4); // Oluşturan sürüm
    centralHeader.writeUInt16LE(20, 6); // Gereken sürüm
    centralHeader.writeUInt16LE(0x0800, 8); // UTF-8 bayrağı
    centralHeader.writeUInt16LE(8, 10); // Sıkıştırma metodu
    centralHeader.writeUInt16LE(0, 12); // Saat
    centralHeader.writeUInt16LE(0, 14); // Tarih
    centralHeader.writeUInt32LE(crc, 16); // CRC-32
    centralHeader.writeUInt32LE(compressedSize, 20); // Sıkıştırılmış boyut
    centralHeader.writeUInt32LE(uncompressedSize, 24); // Orijinal boyut
    centralHeader.writeUInt16LE(nameBuf.length, 28); // Dosya adı uzunluğu
    centralHeader.writeUInt16LE(0, 30); // Ekstra alan uzunluğu
    centralHeader.writeUInt16LE(0, 32); // Yorum uzunluğu
    centralHeader.writeUInt16LE(0, 34); // Disk no
    centralHeader.writeUInt16LE(0, 36); // Dahili özellikler
    centralHeader.writeUInt32LE(0, 38); // Harici özellikler
    centralHeader.writeUInt32LE(currentOffset, 42); // Local header offset

    const centralChunk = Buffer.concat([centralHeader, nameBuf]);
    centralHeaders.push(centralChunk);

    currentOffset += localChunk.length;
  }

  const localHeadersBuf = Buffer.concat(localHeaders);
  const centralHeadersBuf = Buffer.concat(centralHeaders);

  // 3. End of Central Directory Record (22 bayt)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // İmza
  eocd.writeUInt16LE(0, 4); // Disk no
  eocd.writeUInt16LE(0, 6); // Central directory disk no
  eocd.writeUInt16LE(entries.length, 8); // Bu diskteki kayıt sayısı
  eocd.writeUInt16LE(entries.length, 10); // Toplam kayıt sayısı
  eocd.writeUInt32LE(centralHeadersBuf.length, 12); // Central dir boyutu
  eocd.writeUInt32LE(localHeadersBuf.length, 16); // Central dir başlangıç offseti
  eocd.writeUInt16LE(0, 20); // Yorum uzunluğu

  return Buffer.concat([localHeadersBuf, centralHeadersBuf, eocd]);
}
