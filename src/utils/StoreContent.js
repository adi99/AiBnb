import { NFTStorage, File } from 'nft.storage';

const nftStorageKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU0QzI4N0YyYmEzMzk4NkU2OUM0OUE1ZkI0MGU5ZTk1ZGRjQTdkODgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzAxMjgzNzk3OSwibmFtZSI6IkFkaSJ9.KLZGwXJKNxv_ijnBx5z3IEq0luZVp16BylaP6YPKaOQ";

function GetAccessToken() {
  return nftStorageKey;
}

function MakeStorageClient() {
  return new NFTStorage({ token: GetAccessToken() });
}

export const StoreContent = async (files) => {
  console.log('Uploading file to IPFS with nft.storage...');
  const client = MakeStorageClient();
  // Assuming 'file' is a Blob or File object you're planning to store
  // You must convert it to the `File` format expected by nft.storage
  const nftFile = new File([files], 'image.png', { type: 'image/png' });
  const cid = await client.store({
    name: 'Image',
    description: 'Your description here', // Optional: Add a description
    image: nftFile,
  });
  console.log('Stored file with URL:', cid.url);
  return cid; // This URL points to the IPFS gateway for the uploaded content
};
