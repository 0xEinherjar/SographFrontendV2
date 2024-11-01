const API_URL = "https://api.quicknode.com/ipfs/rest/v1/s3/put-object";

export async function uploadToIPFS(fileBody, fileName, mimeType) {
  try {
    const formData = new FormData();
    formData.append("Body", fileBody);
    formData.append("Key", fileName);
    formData.append("ContentType", mimeType);

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", import.meta.env.VITE_QUICKNODE_API_KEY);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}
