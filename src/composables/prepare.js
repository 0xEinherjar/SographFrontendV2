import { useUtils } from "../composables/utils.js";
const { formatToNumber } = useUtils();
export const usePrepare = () => {
  async function profileToCaller(data) {
    const metadataURL = data[0];
    if (!String(metadataURL).startsWith("https://ipfs.io/ipfs/")) return null;
    const metadata = await fetch(metadataURL).then((response) =>
      response.json()
    );
    let avatar = metadata.avatar;
    if (avatar != null && !avatar.startsWith("https://ipfs.io/ipfs/")) {
      avatar = null;
    }
    return {
      avatar: avatar,
      name: metadata.name,
      description: metadata.description,
      handle: data[1],
      hasSubscription: data[4],
      following: Number(String(data[2]).replace(/n/i, "")),
      followers: Number(String(data[3]).replace(/n/i, "")),
      isFollowing: data[5],
      isFollower: data[6],
      biography: metadata.biography,
      location: metadata.location,
      createdAt: metadata.created_at,
      links: {
        instagram: metadata.links.instagram,
        twitch: metadata.links.twitch,
        twitter: metadata.links.twitter,
        youtube: metadata.links.youtube,
      },
    };
  }

  async function profile(data) {
    const metadataURL = data[0];
    if (!metadataURL.startsWith("https://ipfs.io/ipfs/")) return null;
    const metadata = await fetch(metadataURL).then((response) =>
      response.json()
    );
    let avatar = metadata.avatar;
    if (avatar != null && !avatar.startsWith("https://ipfs.io/ipfs/")) {
      avatar = null;
    }
    return {
      avatar: avatar,
      name: metadata.name,
      description: metadata.description,
      handle: data[1],
      hasSubscription: data[4],
      following: Number(String(data[2]).replace(/n/i, "")),
      followers: Number(String(data[3]).replace(/n/i, "")),
      biography: metadata.biography,
      location: metadata.location,
      createdAt: metadata.created_at,
      links: {
        instagram: metadata.links.instagram,
        twitch: metadata.links.twitch,
        twitter: metadata.links.twitter,
        youtube: metadata.links.youtube,
      },
    };
  }

  async function postToCaller(data) {
    const postInfo = [];
    for (const list of data) {
      if (list[6] == "0x0000000000000000000000000000000000000000") continue;
      if (!list[3].startsWith("https://ipfs.io/ipfs/")) continue;
      if (!list[5].startsWith("https://ipfs.io/ipfs/")) continue;
      let author = await fetch(list[3]).then((response) => response.json());
      let metadata = await fetch(list[5]).then((response) => response.json());
      postInfo.push({
        authorName: author.name,
        authorAvatar: author.avatar,
        id: formatToNumber(list[0]),
        hasShared: list[1],
        authorHasSubscription: list[2],
        authorHandle: list[4],
        owner: list[6],
        totalLike: formatToNumber(list[7]),
        totalShared: formatToNumber(list[8]),
        totalComments: formatToNumber(list[9]),
        hasLiked: list[10],
        attachment: metadata.attachment,
        text: metadata.text,
        createdAt: metadata.created_at,
      });
    }
    return postInfo.reverse();
  }

  async function post(data) {
    const postInfo = [];
    for (const list of data) {
      if (list[6] == "0x0000000000000000000000000000000000000000") continue;
      if (!list[3].startsWith("https://ipfs.io/ipfs/")) continue;
      if (!list[5].startsWith("https://ipfs.io/ipfs/")) continue;
      let author = await fetch(list[3]).then((response) => response.json());
      let metadata = await fetch(list[5]).then((response) => response.json());
      postInfo.push({
        authorName: author.name,
        authorAvatar: author.avatar,
        id: formatToNumber(list[0]),
        hasShared: list[1],
        authorHasSubscription: list[2],
        authorHandle: list[4],
        owner: list[6],
        totalLike: formatToNumber(list[7]),
        totalShared: formatToNumber(list[8]),
        totalComments: formatToNumber(list[9]),
        attachment: metadata.attachment,
        text: metadata.text,
        createdAt: metadata.created_at,
      });
    }
    return postInfo.reverse();
  }

  return { profile, profileToCaller, post, postToCaller };
};

export const usePrepare2 = () => {
  // Função auxiliar para buscar e validar metadata a partir de uma URL IPFS
  async function fetchAndValidateMetadata(url) {
    if (!url.startsWith("https://ipfs.io/ipfs/")) return null;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao buscar metadata");
    const metadata = await response.json();
    return metadata;
  }

  // Função auxiliar para processar dados de perfil
  function processProfileData(data, metadata) {
    return {
      avatar:
        metadata.avatar && metadata.avatar.startsWith("https://ipfs.io/ipfs/")
          ? metadata.avatar
          : null,
      name: metadata.name,
      description: metadata.description,
      handle: data[1],
      hasSubscription: data[4],
      following: formatToNumber(data[2]),
      followers: formatToNumber(data[3]),
      biography: metadata.biography,
      location: metadata.location,
      createdAt: metadata.created_at,
      links: metadata.links,
    };
  }

  // Função para preparar os dados do perfil
  async function profile(data) {
    const metadata = await fetchAndValidateMetadata(data[0]);
    if (!metadata) return null;
    return processProfileData(data, metadata);
  }

  // Função para preparar os dados do perfil para o chamador
  async function profileToCaller(data) {
    const metadata = await fetchAndValidateMetadata(data[0]);
    if (!metadata) return null;
    return processProfileData(data, metadata);
  }

  // Função auxiliar para processar dados de posts
  function processPostData(list, author, metadata) {
    return {
      authorName: author.name,
      authorAvatar: author.avatar,
      id: formatToNumber(list[0]),
      hasShared: list[1],
      authorHasSubscription: list[2],
      authorHandle: list[4],
      owner: list[6],
      totalLike: formatToNumber(list[7]),
      totalShared: formatToNumber(list[8]),
      totalComments: formatToNumber(list[9]),
      attachment: metadata.attachment,
      text: metadata.text,
      createdAt: metadata.created_at,
    };
  }

  // Função para preparar os dados dos posts
  async function post(data) {
    const postInfo = [];
    for (const list of data) {
      if (list[6] === "0x0000000000000000000000000000000000000000") continue;

      const [author, metadata] = await Promise.all([
        fetchAndValidateMetadata(list[3]),
        fetchAndValidateMetadata(list[5]),
      ]);

      if (author && metadata) {
        postInfo.push(processPostData(list, author, metadata));
      }
    }
    return postInfo.reverse();
  }

  // Função para preparar os dados dos posts para o chamador
  async function postToCaller(data) {
    const postInfo = await post(data);
    return postInfo;
  }

  return { profile, profileToCaller, post, postToCaller };
};
