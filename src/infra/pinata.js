async function uploadFile(file) {
  try {
    const data = new FormData();
    data.append("file", file);
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_KEY_JWT}`,
        },
        body: data,
      }
    );
    const result = await response.json();
    if (!result.IpfsHash) return { success: false };
    return { success: true, data: `https://ipfs.io/ipfs/${result.IpfsHash}` };
  } catch (error) {
    return { success: false };
  }
}

export async function pinProfileToIPFS(params) {
  try {
    const data = new FormData();
    let avatar = params.avatar;
    if (params.avatar instanceof File) {
      const result = await uploadFile(params.avatar);
      if (result.success) {
        avatar = result.data;
      } else {
        return { success: false };
      }
    }
    const json = JSON.stringify({
      avatar: avatar,
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
    });
    const blob = new Blob([json], { type: "application/json" });
    data.append("file", blob);
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_KEY_JWT}`,
        },
        body: data,
      }
    );
    const result = await response.json();
    if (!result.IpfsHash) return { success: false };
    return { success: true, data: `https://ipfs.io/ipfs/${result.IpfsHash}` };
  } catch (error) {
    return { success: false };
  }
}

export async function pinPostToIPFS(params) {
  try {
    const data = new FormData();
    let attachment = null;
    if (Boolean(params.attachment)) {
      const result = await uploadFile(params.attachment);
      if (result.success) {
        attachment = result.data;
      } else {
        return { success: false };
      }
    }
    const json = JSON.stringify({
      attachment: attachment,
      text: params.text,
      created_at: params.createdAt,
    });
    const blob = new Blob([json], { type: "application/json" });
    data.append("file", blob);
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "post",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_KEY_JWT}`,
        },
        body: data,
      }
    );
    const result = await response.json();
    if (!result.IpfsHash) return { success: false };
    return { success: true, data: `https://ipfs.io/ipfs/${result.IpfsHash}` };
  } catch (error) {
    return { success: false };
  }
}
