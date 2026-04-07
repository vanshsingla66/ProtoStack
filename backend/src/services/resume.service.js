import imagekit from "../lib/imagekit.js";
import { runResumeParser } from "../utils/resumeParser.js";

export const parseResumeService = async (file) => {
  const uploadResult = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: `${Date.now()}-${file.originalname}`,
    folder: "/prostack/resumes",
    useUniqueFileName: true,
  });

  const parsed = runResumeParser(uploadResult.url);

  return {
    parsed: {
      ...parsed,
      resumeUrl: uploadResult.url,
      imagekitFileId: uploadResult.fileId,
    },
    resumeUrl: uploadResult.url,
  };
};