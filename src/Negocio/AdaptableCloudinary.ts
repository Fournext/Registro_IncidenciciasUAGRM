// =========================================================================
// SERVICIO A: CLOUDINARY (Real - REST API)
// =========================================================================
export class AdaptableCloudinary {
  private CLOUD_NAME = "dmfl4ahiy";
  private UPLOAD_PRESET = "ml_default";

  public async SubirACloudinary(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error en la subida física a Cloudinary.");
    }

    const data = await response.json();
    return data.secure_url;
  }

  public async ObtenerURLCloudinary(idPublico: string): Promise<string | null> {
    return `https://res.cloudinary.com/${this.CLOUD_NAME}/image/upload/${idPublico}`;
  }

}
