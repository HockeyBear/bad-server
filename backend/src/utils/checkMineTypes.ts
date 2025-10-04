import * as fs from 'fs/promises';

const mineSignature: { [key: string]: Uint8Array } = {
  'image/png': new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  'image/jpeg': new Uint8Array([0xff, 0xd8, 0xff]),
  'image/gif': new Uint8Array([0x47, 0x49, 0x46, 0x38])
};

export const checkMineType = async (filePath: string): Promise<string | null> => {
  const file = await fs.open(filePath, 'r');
  const buffer = new Uint8Array(256);
  await file.read(buffer, 0, 256, 0);
  await file.close();

  const mine = Object.entries(mineSignature).find(([_, signature]) =>
    buffer.slice(0, signature.length).every((byte, i) => byte === signature[i])
  );

  if (mine) {
    return mine[0];
  }

  const fileContent = new TextDecoder('utf-8').decode(buffer).trim();
  if (fileContent.startsWith('<?xml') || fileContent.startsWith('<svg')) {
    return 'image/svg+xml';
  }

  return null;
};
