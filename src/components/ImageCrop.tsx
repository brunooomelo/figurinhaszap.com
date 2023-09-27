import { TypeCrop } from "@/hooks/useCrop";
import Cropper from "react-easy-crop";

type ImageCropProps = {
  previewImagem: string
} & TypeCrop
function ImageCrop({
  previewImagem,
  crop,
  onCropComplete,
  setCrop,
  setZoom,
  zoom,
}: ImageCropProps) {
  return (
    <div className="relative h-[300px] w-full rounded-sm overflow-hidden">
      <Cropper
        image={previewImagem}
        crop={crop}
        zoom={zoom}
        showGrid={false}
        aspect={1}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </div>
  );
}

export default ImageCrop;
