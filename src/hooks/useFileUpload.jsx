import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default function useFileUpload() {
  const photoUpload = async (file, path) => {
    const fileName = new Date().getTime().toString() + file.name;
    const storageRef = ref(storage, `${path}/${fileName}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    return fileUrl;
  };
  return { photoUpload };
}
