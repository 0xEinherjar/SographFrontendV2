const API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const AUTH_HEADER = {
  Authorization: `Bearer ${import.meta.env.VITE_PINATA_KEY_JWT}`,
};

async function pinToIPFS(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: AUTH_HEADER,
      body: data,
    });
    const result = await response.json();
    if (!result.IpfsHash) {
      return { success: false, message: "Failed to obtain IPFS hash" };
    }
    return { success: true, data: `https://ipfs.io/ipfs/${result.IpfsHash}` };
  } catch (error) {
    return { success: false, message: "Failed to upload to IPFS" };
  }
}

async function uploadFile(file) {
  const data = new FormData();
  data.append("file", file);
  return await pinToIPFS(data);
}

export async function pinProfileToIPFS(params) {
  try {
    let avatarUrl = null;
    if (params.avatar) {
      const { success, data } = await handleFileUpload(params.avatar);
      avatarUrl = success ? data : avatarUrl;
    }
    const profileData = {
      avatar: avatarUrl,
      name: params.name,
      description: params.description,
      created_at: params.createdAt,
      biography: params.biography ?? "",
      location: params.location ?? "",
      links: {
        twitter: params.links?.twitter ?? "",
        youtube: params.links?.youtube ?? "",
        twitch: params.links?.twitch ?? "",
        instagram: params.links?.instagram ?? "",
      },
    };
    return await pinJsonToIPFS(profileData);
  } catch (error) {
    return { success: false, message: "Failed to pin profile to IPFS" };
  }
}

export async function pinPostToIPFS(params) {
  try {
    let attachmentUrl = null;
    if (params.attachment) {
      const { success, data } = await handleFileUpload(params.attachment);
      attachmentUrl = success ? data : attachmentUrl;
    }
    const postData = {
      attachment: attachmentUrl,
      text: params.text,
      created_at: params.createdAt,
    };
    return await pinJsonToIPFS(postData);
  } catch (error) {
    return { success: false, message: "Failed to pin post to IPFS" };
  }
}

export async function pinCommentToIPFS(params) {
  try {
    const postData = {
      text: params.text,
      created_at: params.createdAt,
    };
    return await pinJsonToIPFS(postData);
  } catch (error) {
    return { success: false, message: "Failed to pin comment to IPFS" };
  }
}

async function handleFileUpload(file) {
  if (file instanceof File) {
    return await uploadFile(file);
  }
  return { success: true, data: file };
}

async function pinJsonToIPFS(jsonData) {
  const blob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  const data = new FormData();
  data.append("file", blob);
  return await pinToIPFS(data);
}
