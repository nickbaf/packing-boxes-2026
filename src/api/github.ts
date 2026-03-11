import { Octokit } from "@octokit/rest";
import type { BoxesData } from "@/types";

const REPO_OWNER = "nickbaf";
const REPO_NAME = "packing-boxes-2026";
const DATA_PATH = "data/boxes.json";
const BRANCH = "main";

interface FileContent {
  data: BoxesData;
  sha: string;
}

let octokitInstance: Octokit | null = null;

export function initOctokit(token: string) {
  octokitInstance = new Octokit({ auth: token });
}

function getOctokit(): Octokit {
  if (!octokitInstance) {
    throw new Error("GitHub client not initialized. Please log in first.");
  }
  return octokitInstance;
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const octokit = new Octokit({ auth: token });
    await octokit.rest.repos.get({ owner: REPO_OWNER, repo: REPO_NAME });
    return true;
  } catch {
    return false;
  }
}

const EMPTY_DATA: BoxesData = { boxes: [], users: [] };

function decodeBase64Utf8(b64: string): string {
  const raw = atob(b64);
  const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function fetchBoxes(): Promise<FileContent> {
  const octokit = getOctokit();

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: DATA_PATH,
      ref: BRANCH,
      headers: { "If-None-Match": "" },
    });

    if (Array.isArray(data) || data.type !== "file") {
      throw new Error("Unexpected response format from GitHub API");
    }

    const sha = data.sha;
    let content: string;

    if (data.content && data.encoding === "base64") {
      content = decodeBase64Utf8(data.content);
    } else {
      const { data: blob } = await octokit.rest.git.getBlob({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        file_sha: sha,
      });
      content = decodeBase64Utf8(blob.content);
    }

    const parsed: BoxesData = JSON.parse(content);
    return { data: parsed, sha };
  } catch (err: unknown) {
    const is404 =
      err instanceof Error && "status" in err && (err as { status: number }).status === 404;

    if (is404) {
      const sha = await createDataFile(EMPTY_DATA);
      return { data: EMPTY_DATA, sha };
    }
    throw err;
  }
}

async function createDataFile(data: BoxesData): Promise<string> {
  const octokit = getOctokit();
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

  const { data: result } = await octokit.rest.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: DATA_PATH,
    message: "Initialize boxes data file",
    content,
    branch: BRANCH,
  });

  return result.content?.sha ?? "";
}

export async function saveBoxes(
  newData: BoxesData,
  currentSha: string,
  commitMessage: string,
): Promise<string> {
  const octokit = getOctokit();
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));

  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: DATA_PATH,
    message: commitMessage,
    content,
    sha: currentSha,
    branch: BRANCH,
  });

  return data.content?.sha ?? currentSha;
}
